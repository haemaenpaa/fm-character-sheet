import { Component, Input } from '@angular/core';
import { LevelStruct, levelStructs } from 'src/app/common/LevelStruct';
import Character from 'src/app/model/character';

@Component({
  selector: 'character-li',
  templateUrl: './character-li.component.html',
  styleUrls: ['./character-li.component.css'],
})
export class CharacterLiComponent {
  @Input() character: Character | null = null;
  hovered: boolean = false;
  get levelList() {
    return this.character?.getAoLevels();
  }
  get levels(): LevelStruct[] {
    if (!this.character) {
      return [];
    }
    return levelStructs(this.character);
  }
  onMouseEnter() {
    this.hovered = true;
  }
  onMouseExit() {
    this.hovered = false;
  }
}
