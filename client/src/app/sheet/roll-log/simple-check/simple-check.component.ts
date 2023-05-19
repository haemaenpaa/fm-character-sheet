import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, OnInit } from '@angular/core';
import { Hoverable } from 'src/app/common/hoverable';
import { ABILITY_TO_NAME } from 'src/app/model/constants';
import { Roll, SimpleRoll } from 'src/app/model/diceroll';
import { Roll20MacroService } from 'src/app/services/roll20-macro.service';
import { article } from 'src/app/utils/grammar-utils';
import { toModifier } from 'src/app/utils/modifier-utils';

/**
 * A simple check component. Displays the name of the check, followed by the roll.
 */
@Component({
  selector: 'simple-check',
  templateUrl: './simple-check.component.html',
  styleUrls: ['./simple-check.component.css', '../log-row-shared.css'],
})
export class SimpleCheckComponent extends Hoverable {
  @Input('roll') roll!: SimpleRoll;
  constructor(
    private clipboard: Clipboard,
    private macroService: Roll20MacroService
  ) {
    super();
  }
  copyMacro() {
    const macro = this.macroService.getDiceAlgebra(this.roll);
    this.clipboard.copy(macro);
  }
}
