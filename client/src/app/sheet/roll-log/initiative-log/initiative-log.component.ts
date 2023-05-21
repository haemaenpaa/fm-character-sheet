import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input } from '@angular/core';
import { Hoverable } from 'src/app/common/hoverable';
import { SimpleRoll } from 'src/app/model/diceroll';
import { Roll20MacroService } from 'src/app/services/roll20-macro.service';

@Component({
  selector: 'initiative-log',
  templateUrl: './initiative-log.component.html',
  styleUrls: ['./initiative-log.component.css', '../log-row-shared.css'],
})
export class InitiativeLogComponent extends Hoverable {
  @Input() roll!: SimpleRoll;

  constructor(
    private clipboard: Clipboard,
    private macroService: Roll20MacroService
  ) {
    super();
  }
  copyMacro() {
    this.clipboard.copy(this.macroService.getDiceAlgebra(this.roll));
  }
}
