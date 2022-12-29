import { Component, Input } from '@angular/core';
import { LevelStruct, levelStructs } from 'src/app/common/LevelStruct';
import Character from 'src/app/model/character';

function abbreviate(value: string): string {
  if (value.split(' ').length > 1) {
    return value.split(' ').reduce((out: string, cur: string) => {
      return out + cur.charAt(0).toUpperCase();
    }, '');
  }

  return value.substring(0, 3);
}

@Component({
  selector: 'character-li',
  templateUrl: './character-li.component.html',
  styleUrls: ['./character-li.component.css'],
})
export class CharacterLiComponent {
  @Input() character: Character | null = null;
  @Input() hilight: boolean = false;
  hovered: boolean = false;
  get levelList() {
    return this.character?.getAoLevels();
  }
  get levels(): LevelStruct[] {
    if (!this.character) {
      return [];
    }
    return levelStructs(this.character).map((ls) => ({
      ...ls,
      abilityOrigin: abbreviate(ls.abilityOrigin),
    }));
  }
  onMouseEnter() {
    this.hovered = true;
  }
  onMouseExit() {
    this.hovered = false;
  }
}
