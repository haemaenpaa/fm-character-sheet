import { Component, Input } from '@angular/core';
import { MultiRoll, SimpleRoll } from 'src/app/model/diceroll';

@Component({
  selector: 'attack',
  templateUrl: './attack.component.html',
  styleUrls: ['./attack.component.css', '../log-row-shared.css'],
})
export class AttackComponent {
  private _roll!: MultiRoll;
  toHit?: SimpleRoll;
  damage?: SimpleRoll;
  effects: SimpleRoll[] = [];

  @Input() set roll(r: MultiRoll) {
    this._roll = r;
    this.toHit = r.rolls.find((sr) => sr.title === 'attack');
    this.damage = r.rolls.find((sr) => sr.title === 'attackdmg');
    this.effects = r.rolls.filter((sr) => sr.title === 'attackeffect');
  }
  get character(): string {
    return (
      this._roll.rolls.map((r) => r.character).find((name) => !!name) || ''
    );
  }

  saveAbilities(saveVal: string): string[] {
    return saveVal.split('/');
  }
}
