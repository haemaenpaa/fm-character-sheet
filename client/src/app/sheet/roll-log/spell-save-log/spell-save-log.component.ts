import { Component, Input } from '@angular/core';
import { Roll } from 'src/app/model/diceroll';

@Component({
  selector: 'spell-save-log',
  templateUrl: './spell-save-log.component.html',
  styleUrls: ['./spell-save-log.component.css', '../log-row-shared.css'],
})
export class SpellSaveLogComponent {
  @Input() roll!: Roll;
  saveAbilities(saveVal: string): string[] {
    return saveVal.split('/');
  }
}
