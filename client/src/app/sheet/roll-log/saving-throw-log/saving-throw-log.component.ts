import { Component, Input } from '@angular/core';
import { Roll, SimpleRoll } from 'src/app/model/diceroll';

@Component({
  selector: 'saving-throw-log',
  templateUrl: './saving-throw-log.component.html',
  styleUrls: ['./saving-throw-log.component.css', '../log-row-shared.css'],
})
export class SavingThrowLogComponent {
  @Input('roll') roll!: SimpleRoll;

  get abilities(): string[] {
    if (!this.roll.title) {
      return [];
    }
    return this.roll.title.split('_')[0].split('/');
  }
}
