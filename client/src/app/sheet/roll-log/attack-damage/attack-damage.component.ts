import { Component, Input } from '@angular/core';
import { Roll, RollComponent } from 'src/app/model/diceroll';

@Component({
  selector: 'attack-damage',
  templateUrl: './attack-damage.component.html',
  styleUrls: ['./attack-damage.component.css', '../log-row-shared.css'],
})
export class AttackDamageComponent {
  @Input() roll!: Roll;
}
