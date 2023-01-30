import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import Character from 'src/app/model/character';
import { Race } from 'src/app/model/race';
import { CharacterService } from 'src/app/services/character.service';
import { RollLogService } from 'src/app/services/roll-log-service.service';
import { LevelStruct, levelStructs } from '../../common/LevelStruct';
import { RaceEditComponent } from '../race-edit/race-edit.component';

const LS_COLORIZED_KEY = 'character-sheet-colorized';

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
    private changeDetector: ChangeDetectorRef,
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
  }

  /**
   * Parses the character's AO levels into an easier to display format.
   */
  get levelList(): LevelStruct[] {
    return levelStructs(this.character);
  }

  onCharacterChanged() {
    console.log('Character changed. Persisting character.');
    this.characterService.persistCharacter(this.character!);
    this.characterService.updateCharacter(this.character!).then((c) => {
      this.character = c;
      this.changeDetector.detectChanges();
    });
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
    this.character.race = race;
    this.onCharacterChanged();
  }

  setColorized(event: Event) {
    const element = event.target as HTMLInputElement;
    this._colorizedSubject.next(element.checked);
    this.colorized = element.checked;

    localStorage.setItem(LS_COLORIZED_KEY, `${this.colorized}`);
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
}
