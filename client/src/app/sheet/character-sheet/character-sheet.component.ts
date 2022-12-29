import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import Character from 'src/app/model/character';
import { Race } from 'src/app/model/race';
import { CharacterService } from 'src/app/services/character.service';
import { RollLogService } from 'src/app/services/roll-log-service.service';
import { LevelStruct, levelStructs } from '../../common/LevelStruct';
import { RaceEditComponent } from '../race-edit/race-edit.component';

@Component({
  selector: 'character-sheet',
  templateUrl: './character-sheet.component.html',
  styleUrls: ['./character-sheet.component.css', '../common.css'],
})
export class CharacterSheetComponent {
  character: Character | null = null;
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
        console.log(c);
      });
    });
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
}