import { Component, Input } from '@angular/core';
import { Hoverable } from 'src/app/common/hoverable';
import {
  MultiRoll,
  SimpleRoll,
  toCheckArithmetic,
} from 'src/app/model/diceroll';
import { toModifier } from 'src/app/utils/modifier-utils';
import { Clipboard } from '@angular/cdk/clipboard';
import { ABILITY_TO_NAME } from 'src/app/model/constants';
import { Roll20MacroService } from 'src/app/services/roll20-macro.service';

@Component({
  selector: 'attack',
  templateUrl: './attack.component.html',
  styleUrls: ['./attack.component.css', '../log-row-shared.css'],
})
export class AttackComponent extends Hoverable {
  private _roll!: MultiRoll;
  toHit?: SimpleRoll;
  damage?: SimpleRoll;
  effects: SimpleRoll[] = [];

  constructor(
    private clipboard: Clipboard,
    private macroService: Roll20MacroService
  ) {
    super();
  }

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

  copyMacro() {
    this.clipboard.copy(this.macroService.getDiceAlgebra(this._roll));
  }
}
