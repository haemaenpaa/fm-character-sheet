import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Character from 'src/app/model/character';
import { CharacterService } from 'src/app/services/character.service';
import { RollLogService } from 'src/app/services/roll-log-service.service';
import { LevelStruct, levelStructs } from '../../common/LevelStruct';

@Component({
  selector: 'character-sheet',
  templateUrl: './character-sheet.component.html',
  styleUrls: ['./character-sheet.component.css'],
})
export class CharacterSheetComponent implements OnInit {
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

  ngOnInit(): void {}

  /**
   * Parses the character's AO levels into an easier to display format.
   */
  get levelList(): LevelStruct[] {
    return levelStructs(this.character);
  }

  onCharacterChanged() {
    console.log('Character changed. Persisting character.');
    this.characterService
      .persistCharacter(this.character!)
      .then((c) => (this.character = c));
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
}
