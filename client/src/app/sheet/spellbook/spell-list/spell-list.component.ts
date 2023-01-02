import { Component, Input } from '@angular/core';
import { Spell } from 'src/app/model/character-spells';

@Component({
  selector: 'spell-list',
  templateUrl: './spell-list.component.html',
  styleUrls: ['./spell-list.component.css', '../../common.css'],
})
export class SpellListComponent {
  @Input() tier: number = 0;
  @Input() souls: number = 0;
  @Input() slots: number = 0;
  @Input() slotsAvailable: number = 0;
  @Input() spells: Spell[] = [];

  addSpell() {
    this.spells.push({
      id: 0,
      tier: 0,
      school: '',
      name: 'placeholder',
      saveAbility: null,
      description: '',
      damage: [],
      upcastDamage: [],
      ritual: true,
      soulMastery: true,
      castingTime: '',
    });
  }
}
