import { Component, Input, OnInit } from '@angular/core';
import { Character } from 'src/app/model/character';

@Component({
  selector: 'skill-grid',
  templateUrl: './skill-grid.component.html',
  styleUrls: ['./skill-grid.component.css'],
})
export class SkillGridComponent implements OnInit {
  @Input() character!: Character;
  constructor() {}

  ngOnInit(): void {}

  get abilityModifiers(): { [key: string]: number } {
    return this.character.abilityModifiers as unknown as {
      [key: string]: number;
    };
  }
}
