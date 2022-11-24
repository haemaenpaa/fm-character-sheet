import { Component, OnInit, SimpleChange } from '@angular/core';
import { Roll } from 'src/app/model/diceroll';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';
import { SimpleCheckComponent } from './simple-check/simple-check.component';
import { UnknownRollComponent } from './unknown-roll/unknown-roll.component';

const ABILITY_CHECK_PATTERN = /^(br|dex|vit|int|cun|res|pre|man|com)$/;
const ABILITY_SAVE_PATTERN = /_save$/;

// Row type, to be used in an ngSwitch to select the component to display.
type RowType = 'simple-check' | 'unknown';

@Component({
  selector: 'roll-log',
  templateUrl: './roll-log.component.html',
  styleUrls: ['./roll-log.component.css'],
})
export class RollLogComponent implements OnInit {
  rolls: Roll[] = [];

  constructor(private rollService: ActionDispatchService) {
    rollService.rolls().subscribe({
      next: (r) => {
        console.log(JSON.stringify(r));
        this.rolls.push(r);
      },
    });
  }

  ngOnInit(): void {}

  rollToType(roll: Roll): RowType {
    if (roll.title?.match(ABILITY_CHECK_PATTERN)?.length) {
      return 'simple-check';
    }
    return 'unknown';
  }
}
