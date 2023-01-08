import { Component, Input } from '@angular/core';
import { Roll } from 'src/app/model/diceroll';

@Component({
  selector: 'hit-die-row',
  templateUrl: './hit-die-row.component.html',
  styleUrls: ['./hit-die-row.component.css', '../log-row-shared.css'],
})
export class HitDieRowComponent {
  @Input() roll!: Roll;
}
