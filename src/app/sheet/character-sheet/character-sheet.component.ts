import { Component, OnInit } from '@angular/core';
import Character from 'src/app/model/character';
import { CharacterService } from 'src/app/services/character.service';
import { RollLogService } from 'src/app/services/roll-log-service.service';

/**
 * Structure for AO level display.
 */
interface LevelStruct {
  abilityOrigin: string;
  level: number;
}

@Component({
  selector: 'character-sheet',
  templateUrl: './character-sheet.component.html',
  styleUrls: ['./character-sheet.component.css'],
})
export class CharacterSheetComponent implements OnInit {
  get character(): Character {
    return this.characterService.currentCharacter();
  }
  /**
   * Constructor.
   * @param characterService Service to retrieve the character from.
   * @param _ Inject RollLogService here to ensure it is initialized.
   */
  constructor(
    private characterService: CharacterService,
    private _: RollLogService
  ) {}

  ngOnInit(): void {}

  /**
   * Parses the character's AO levels into an easier to display format.
   */
  get levelList(): LevelStruct[] {
    var ret: LevelStruct[] = [];
    const aoLevels = this.character.getAoLevels();
    for (let ao in aoLevels) {
      ret.push({ abilityOrigin: ao, level: aoLevels[ao] });
    }
    return ret;
  }

  onOutletLoaded(component: any) {
    console.log('Outlet loaded', component);
    if ('character' in component) {
      component.character = this.character;
    }
  }
}
