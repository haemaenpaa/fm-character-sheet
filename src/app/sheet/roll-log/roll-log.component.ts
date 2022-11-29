import { Component, OnInit, SimpleChange } from '@angular/core';
import { Roll } from 'src/app/model/diceroll';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';
import { SimpleCheckComponent } from './simple-check/simple-check.component';
import { UnknownRollComponent } from './unknown-roll/unknown-roll.component';

const ABILITY_CHECK_PATTERN = /^(br|dex|vit|int|cun|res|pre|man|com)$/;
const SKILL_CHECK_PATTERN = /^skill_(.+)_(\w{2,3})$/;
const ABILITY_SAVE_PATTERN = /_save$/;

// Row type, to be used in an ngSwitch to select the component to display.
type RowType = 'simple-check' | 'skill-check' | 'unknown';

/**
 * Component to display a log of rolls made.
 */
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

  /**
   * Deduces the type of the roll from the title.
   * @param roll the roll
   * @returns Type of the roll, 'unknown' if it matched no rule.
   */
  rollToType(roll: Roll): RowType {
    if (roll.title?.match(ABILITY_CHECK_PATTERN)?.length) {
      return 'simple-check';
    }
    if (roll.title?.match(ABILITY_SAVE_PATTERN)?.length) {
      return 'simple-check';
    }
    if (roll.title?.match(SKILL_CHECK_PATTERN)) {
      return 'skill-check';
    }
    return 'unknown';
  }
}
