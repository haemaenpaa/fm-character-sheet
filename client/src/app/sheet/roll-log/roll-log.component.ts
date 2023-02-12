import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Roll, SimpleRoll, MultiRoll } from 'src/app/model/diceroll';
import { RollLogService } from 'src/app/services/roll-log-service.service';

const ABILITY_CHECK_PATTERN = /^(br|dex|vit|int|cun|res|pre|man|com)$/;
const SKILL_CHECK_PATTERN = /^skill_(.+)_(\w{2,3})$/;
const ABILITY_SAVE_PATTERN = /^([\w/]+)_save$/;
const SPELL_ATTACK_PATTERN = /^spellatk$/;
const SPELL_SAVE_PATTERN = /^spellsave$/;
const SOUL_CHECK_PATTERN = /^soulcheck$/;
const SPELL_DAMAGE_PATTERN = /^spelldmg$/;
const ATTACK_PATTERN = /^attack$/;
const HIT_DICE_PATTERN = /^hit-dice$/;
const HIT_POINTS_PATTERN = /^hit-points$/;

// Row type, to be used in an ngSwitch to select the component to display.
type RowType =
  | 'simple-check'
  | 'skill-check'
  | 'saving-throw'
  | 'spell-attack'
  | 'soul-check'
  | 'spell-save'
  | 'spell-damage'
  | 'attack'
  | 'attack-damage'
  | 'attack-effect'
  | 'hit-dice'
  | 'hit-points'
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
    if (roll.title?.match(SPELL_SAVE_PATTERN)) {
      return 'spell-save';
    }
    if (roll.title?.match(SPELL_DAMAGE_PATTERN)) {
      return 'spell-damage';
    }
    if (roll.title?.match(SOUL_CHECK_PATTERN)) {
      return 'soul-check';
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
    return 'unknown';
  }
}
