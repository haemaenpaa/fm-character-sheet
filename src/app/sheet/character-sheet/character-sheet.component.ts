import { Component, Input, OnInit } from '@angular/core';
import { Character } from 'src/app/model/character';
import { Roll } from 'src/app/model/diceroll';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';
import { CharacterService } from 'src/app/services/character.service';

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

  get levelList(): LevelStruct[] {
    var ret: LevelStruct[] = [];
    const aoLevels = this.character.aoLevels;
    for (let ao in aoLevels) {
      ret.push({ abilityOrigin: ao, level: aoLevels[ao] });
    }
    return ret;
  }
}
