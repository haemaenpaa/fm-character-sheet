import { Component, Input } from '@angular/core';
import { MultiRoll } from 'src/app/model/diceroll';

@Component({
  selector: 'attack',
  templateUrl: './attack.component.html',
  styleUrls: ['./attack.component.css', '../log-row-shared.css'],
})
export class AttackComponent {
  @Input() roll!: MultiRoll;
}
