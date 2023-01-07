import { Component, Input } from '@angular/core';
import { Roll } from 'src/app/model/diceroll';

@Component({
  selector: 'attack-effect',
  templateUrl: './attack-effect.component.html',
  styleUrls: ['./attack-effect.component.css', '../log-row-shared.css'],
})
export class AttackEffectComponent {
  @Input() roll!: Roll;
  saveAbilities(saveVal: string): string[] {
    debugger;
    return saveVal.split('/');
  }
}
