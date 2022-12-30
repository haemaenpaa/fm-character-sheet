import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
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
  styleUrls: ['./character-sheet.component.css', '../common.css'],
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
    this.colorized = !!localStorage.getItem(LS_COLORIZED_KEY);
  }

  /**
   * Parses the character's AO levels into an easier to display format.
   */
  get levelList(): LevelStruct[] {
    return levelStructs(this.character);
  }

  onCharacterChanged() {
    console.log('Character changed. Persisting character.');
    this.characterService.persistCharacter(this.character!).then((c) => {
      this.character = c;
      this.changeDetector.detectChanges();
    });
  }

  onOutletLoaded(component: any) {
    if ('character' in component) {
      component.character = this.character;
    }
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
  }

  editRace() {
    if (!this.character) {
      return;
    }
    console.log(this.character.race);
    const race: Race = {
      name: this.character.race.name,
      subrace: this.character.race.subrace,
      abilities: { ...this.character.race.abilities },
      damageResistances: [...this.character.race.damageResistances],
      statusResistances: [...this.character.race.statusResistances],
    };
    const editDialog = this.dialog.open(RaceEditComponent, {
      data: race,
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
}
