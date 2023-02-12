import { Component, Input } from '@angular/core';
import { Roll, SimpleRoll } from 'src/app/model/diceroll';

@Component({
  selector: 'health-roll-row',
  templateUrl: './health-roll-row.component.html',
  styleUrls: ['./health-roll-row.component.css', '../log-row-shared.css'],
})
export class HealthRollRowComponent {
  @Input() roll!: SimpleRoll;
}
