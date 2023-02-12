import { Component, Input } from '@angular/core';
import { SimpleRoll } from 'src/app/model/diceroll';

@Component({
  selector: 'attack-damage',
  templateUrl: './attack-damage.component.html',
  styleUrls: ['./attack-damage.component.css', '../log-row-shared.css'],
})
export class AttackDamageComponent {
  @Input() roll!: SimpleRoll;
}
