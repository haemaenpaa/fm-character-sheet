import { Component, Input } from '@angular/core';
import { SimpleRoll } from 'src/app/model/diceroll';

@Component({
  selector: 'soul-check-log',
  templateUrl: './soul-check-log.component.html',
  styleUrls: ['./soul-check-log.component.css', '../log-row-shared.css'],
})
export class SoulCheckLogComponent {
  @Input() roll!: SimpleRoll;
}
