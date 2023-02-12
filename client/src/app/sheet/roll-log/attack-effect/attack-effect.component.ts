import { Component, Input } from '@angular/core';
import { SimpleRoll } from 'src/app/model/diceroll';

@Component({
  selector: 'attack-effect',
  templateUrl: './attack-effect.component.html',
  styleUrls: ['./attack-effect.component.css', '../log-row-shared.css'],
})
export class AttackEffectComponent {
  @Input() roll!: SimpleRoll;
  saveAbilities(saveVal: string): string[] {
    return saveVal.split('/');
  }
}
