import { Component, Input } from '@angular/core';
import { Roll } from 'src/app/model/diceroll';

@Component({
  selector: 'spell-attack-roll',
  templateUrl: './spell-attack-roll.component.html',
  styleUrls: ['./spell-attack-roll.component.css', '../log-row-shared.css'],
})
export class SpellAttackRollComponent {
  @Input() roll!: Roll;
}
