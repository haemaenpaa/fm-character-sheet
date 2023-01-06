import { Component, Input } from '@angular/core';
import { Roll } from 'src/app/model/diceroll';

@Component({
  selector: 'spell-damage-roll',
  templateUrl: './spell-damage-roll.component.html',
  styleUrls: ['./spell-damage-roll.component.css', '../log-row-shared.css'],
})
export class SpellDamageRollComponent {
  @Input() roll!: Roll;

  get spellName(): string {
    return this.roll.title?.split('_')[2]!;
  }
}
