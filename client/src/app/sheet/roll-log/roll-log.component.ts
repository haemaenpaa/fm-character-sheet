import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Roll, SimpleRoll, MultiRoll } from 'src/app/model/diceroll';
import { RollLogService } from 'src/app/services/roll-log-service.service';
import {
  ABILITY_CHECK_PATTERN,
  ABILITY_SAVE_PATTERN,
  SKILL_CHECK_PATTERN,
  SPELL_ATTACK_PATTERN,
  ATTACK_PATTERN,
  HIT_DICE_PATTERN,
  HIT_POINTS_PATTERN,
} from '../../model/roll-pattern-constants';

// Row type, to be used in an ngSwitch to select the component to display.
type RowType =
  | 'simple-check'
  | 'skill-check'
  | 'saving-throw'
  | 'spell-attack'
  | 'spell'
  | 'attack'
  | 'attack-damage'
  | 'attack-effect'
  | 'hit-dice'
  | 'hit-points'
  | 'initiative'
  | 'unknown';

/**
 * Component to display a log of rolls made.
 */
@Component({
  selector: 'roll-log',
  templateUrl: './roll-log.component.html',
  styleUrls: ['./roll-log.component.css'],
})
export class RollLogComponent implements AfterViewChecked {
  @ViewChild('logScroll') private logScrollContainer?: ElementRef;
  @Input() colorized: boolean = false;
  constructor(private rollService: RollLogService) {}

  get rolls(): Roll[] {
    return this.rollService.rolls;
  }

  ngAfterViewChecked(): void {
    if (this.logScrollContainer) {
      this.logScrollContainer.nativeElement.scrollTop =
        this.logScrollContainer.nativeElement.scrollHeight;
    }
  }

  asSimple(r: Roll): SimpleRoll {
    return r as SimpleRoll;
  }
  asMulti(r: Roll): MultiRoll {
    return r as MultiRoll;
  }

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
      return 'saving-throw';
    }
    if (roll.title?.match(SKILL_CHECK_PATTERN)) {
      return 'skill-check';
    }
    if (roll.title?.match(SPELL_ATTACK_PATTERN)) {
      return 'spell-attack';
    }
    if (roll.title === 'spell') {
      return 'spell';
    }
    if (roll.title?.match(ATTACK_PATTERN)) {
      return 'attack';
    }
    if (roll.title?.match(HIT_DICE_PATTERN)) {
      return 'hit-dice';
    }
    if (roll.title?.match(HIT_POINTS_PATTERN)) {
      return 'hit-points';
    }
    if (roll.title === 'initiative') {
      return 'initiative';
    }
    return 'unknown';
  }
}
