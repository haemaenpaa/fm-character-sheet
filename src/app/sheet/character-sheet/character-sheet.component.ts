import { Component, Input, OnInit } from '@angular/core';
import { Character } from 'src/app/model/character';

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
  @Input() character!: Character;
  constructor() {}

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
