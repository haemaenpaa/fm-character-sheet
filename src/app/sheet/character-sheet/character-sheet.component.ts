import { Component, Input, OnInit } from '@angular/core';
import { Character } from 'src/app/model/character';
import { CharacterService } from 'src/app/services/character.service';

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
  constructor(private characterService: CharacterService) {}

  ngOnInit(): void {}

  /**
   * Parses the character's AO levels into an easier to display format.
   */
  get levelList(): LevelStruct[] {
    var ret: LevelStruct[] = [];
    const aoLevels = this.character.aoLevels;
    for (let ao in aoLevels) {
      ret.push({ abilityOrigin: ao, level: aoLevels[ao] });
    }
    return ret;
  }
}
