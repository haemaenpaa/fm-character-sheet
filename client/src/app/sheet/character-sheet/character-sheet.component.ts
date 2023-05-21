import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import Character from 'src/app/model/character';
import { Race } from 'src/app/model/race';
import { CharacterService } from 'src/app/services/character.service';
import { RaceService } from 'src/app/services/race.service';
import { RollLogService } from 'src/app/services/roll-log-service.service';
import { LevelStruct, levelStructs } from '../../common/LevelStruct';
import { RaceEditComponent } from '../race-edit/race-edit.component';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';
import { Roll } from 'src/app/model/diceroll';
import { Roll20MacroService } from 'src/app/services/roll20-macro.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { clamp } from '../../utils/math-utils';

const LS_COLORIZED_KEY = 'character-sheet-colorized';
const LS_PUSH_ROLLS_KEY = 'character-sheet-push-rolls';

@Component({
  selector: 'character-sheet',
  templateUrl: './character-sheet.component.html',
  styleUrls: [
    './character-sheet.component.css',
    'character-sheet.accessibility.css',
    '../common.css',
  ],
})
export class CharacterSheetComponent {
  character: Character | null = null;
  colorized: boolean = false;
  autoPushRolls: boolean = false;
  private _colorizedSubject: Subject<boolean> = new Subject();
  /**
   * Constructor.
   * @param characterService Service to retrieve the character from.
   * @param route the Activated route
   * @param _ Inject RollLogService here to ensure it is initialized.
   */
  constructor(
    private characterService: CharacterService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private raceService: RaceService,
    private actionService: ActionDispatchService,
    private macroService: Roll20MacroService,
    private clipboard: Clipboard,
    private _: RollLogService
  ) {
    this.route.paramMap.subscribe((params) => {
      const idString = params.get('id');
      if (!idString) {
        return;
      }
      const id = Number.parseInt(idString);
      this.characterService.getCharacterById(id).then((c) => {
        this.character = c;
      });
    });

    const savedColorized = localStorage.getItem(LS_COLORIZED_KEY);
    this.colorized = savedColorized === 'true';
    const savedAutoPush = localStorage.getItem(LS_PUSH_ROLLS_KEY);
    this.autoPushRolls = savedAutoPush === 'true';
    this.actionService.rolls().subscribe((r) => this.copyRoll(r));
  }

  /**
   * Parses the character's AO levels into an easier to display format.
   */
  get levelList(): LevelStruct[] {
    return levelStructs(this.character);
  }

  onCharacterNameChanged(name: string) {
    const oldName = this.character!.name;
    this.character!.name = name;
    this.characterService.updateCharacter(this.character!).then(
      (c) => this.onCharacterChanged(),
      (error) => {
        console.error('Could not set character name', error);
        this.character!.name = oldName;
      }
    );
  }

  onCharacterChanged() {
    console.log('Character changed. Persisting character.');
    this.characterService.persistCharacter(this.character!);
  }

  onOutletLoaded(component: any) {
    component.character = this.character;

    if ('characterChanged' in component) {
      const onCharacterChanged = this.onCharacterChanged.bind(this);
      component.characterChanged.subscribe(onCharacterChanged);
    }
    if ('colorized' in component) {
      component.colorized = this.colorized;
      this._colorizedSubject
        .asObservable()
        .subscribe((c) => (component.colorized = c));
    }
    console.log('onOutletLoaded', component);
  }

  editRace() {
    if (!this.character) {
      return;
    }
    console.log(this.character.race);
    const race: Race = {
      ...this.character.race,
      abilities: { ...this.character.race.abilities },
      damageResistances: this.character.race.damageResistances.map((r) => ({
        ...r,
      })),
      statusResistances: this.character.race.statusResistances.map((r) => ({
        ...r,
      })),
    };
    const editDialog = this.dialog.open(RaceEditComponent, {
      data: { race, colorized: this.colorized },
    });

    editDialog.afterClosed().subscribe(this.setCharacterRace.bind(this));
  }

  private setCharacterRace(race: Race) {
    if (!this.character || !race) {
      return;
    }

    const oldRace = { ...this.character.race };
    this.character.race = race;

    this.raceService.updateRace(this.character.race, this.character.id!).then(
      (_) => {
        this.onCharacterChanged();
      },
      (error) => {
        console.error('Failed to set race', error);
        this.character!.race = oldRace;
      }
    );
  }

  setColorized(event: Event) {
    const element = event.target as HTMLInputElement;
    this._colorizedSubject.next(element.checked);
    this.colorized = element.checked;

    localStorage.setItem(LS_COLORIZED_KEY, `${this.colorized}`);
  }

  setPushRolls(event: Event) {
    const element = event.target as HTMLInputElement;
    this.autoPushRolls = element.checked;

    localStorage.setItem(LS_PUSH_ROLLS_KEY, `${this.autoPushRolls}`);
  }

  exportJson() {
    if (!this.character) {
      return;
    }
    const fileContent = JSON.stringify(this.character, undefined, 2);

    const fileBlob = new Blob([fileContent], { type: 'application/json' });

    const link = document.createElement('a');
    link.download = this.character.name || 'fm-character';
    link.href = URL.createObjectURL(fileBlob);
    link.click();
    link.remove();
  }

  deleteCharacter() {
    if (
      !this.character ||
      !confirm(`Really delete ${this.character.name}? This can not be undone.`)
    ) {
      return;
    }
    this.characterService.delete(this.character.id!).then(() => {
      this.router.navigate(['character-list']);
    });
  }

  copyRoll(roll: Roll): void {
    if (!this.autoPushRolls) {
      return;
    }
    const macro = this.macroService.getDiceAlgebra(roll);
    const success = this.clipboard.copy(macro);
    if (success) {
      console.log(`Macro copied ${macro}`);
    } else {
      console.error(`Macro NOT copied ${macro}`);
    }
  }
  onHpTotalChanged($event: number) {
    if (!this.character) {
      return;
    }
    const oldValue = this.character.hitPointTotal;
    this.character.hitPointTotal = clamp(
      $event,
      0,
      this.character.hitPointMaximum
    );
    this.updateOnFieldChange('hitPointTotal', oldValue);
  }
  onHpMaxChanged($event: number) {
    if (!this.character) {
      return;
    }
    const oldTotal = this.character.hitPointTotal;
    const oldMax = this.character.hitPointMaximum;
    this.character.hitPointMaximum = $event;
    this.character.hitPointTotal = clamp(
      this.character.hitPointTotal,
      0,
      $event
    );

    this.characterService
      .updateCharacter(this.character)
      .catch((err) => {
        console.error('Failed to set hit point max', err);
        this.character!.hitPointMaximum = oldMax;
        this.character!.hitPointTotal = oldTotal;
      })
      .then((char) => {
        if (char) {
          this.onCharacterChanged();
        }
      });
  }
  onTempHpChanged($event: number) {
    if (!this.character) {
      return;
    }
    const oldValue = this.character.tempHitPoints;
    if (this.character) {
      this.character.tempHitPoints = Math.max($event, 0);
    }
    this.updateOnFieldChange('tempHitPoints', oldValue);
  }
  private updateOnFieldChange(field: string, oldValue: any) {
    this.characterService
      .updateCharacter(this.character!)
      .catch((err) => {
        console.error(`Failed to set ${field}`, err);
        (this.character as any)[field] = oldValue;
      })
      .then((char) => {
        if (char) {
          this.onCharacterChanged();
        }
      });
  }
}
