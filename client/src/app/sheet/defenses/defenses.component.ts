import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Ability } from 'src/app/model/ability';
import Character from 'src/app/model/character';
import { SaveParams } from 'src/app/model/game-action';
import Resistance from 'src/app/model/resistance';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';
import { ResistanceModifyEvent } from '../resistances/resistances.component';

function clamp(num: number, min: number, max: number) {
  return Math.min(max, Math.max(min, num));
}

@Component({
  selector: 'defenses',
  templateUrl: './defenses.component.html',
  styleUrls: ['./defenses.component.css'],
})
export class DefensesComponent {
  @Input() character: Character | null = null;
  @Input() colorized: boolean = false;
  @Output() characterChanged: EventEmitter<void> = new EventEmitter();

  savingThrows: string[] = [
    'br',
    'dex',
    'vit',
    'int/cun',
    'res',
    'pre/man',
    'com',
  ];

  constructor(
    private actionService: ActionDispatchService,
    private changeDetector: ChangeDetectorRef
  ) {}

  hasSave(save: string): boolean {
    if (!this.character) {
      return false;
    }
    return this.character.savingThrows.findIndex((s) => s === save) >= 0;
  }
  callRoll(save: string) {
    console.log('callRoll');
    if (!this.character) {
      return;
    }
    const abilities = save.split('/');
    var maxAbility: Ability = {
      identifier: 'PLACEHOLDER',
      score: -Infinity,
      modifier: -Infinity,
    };
    for (var abl of abilities) {
      const current: Ability = (this.character.abilities as any)[abl];
      if (current.score > maxAbility.score) {
        maxAbility = current;
      }
    }
    const parameters: SaveParams = {
      abilities: abilities,
      characterName: this.character.name,
      ability: maxAbility,
      proficiency: this.hasSave(save) ? this.character.proficiency : null,
      advantage: 'none',
    };
    console.log('callRoll dispatching', parameters);
    this.actionService.dispatch({
      type: 'ability-save',
      params: parameters,
    });
  }

  toggleAbility(save: string, newValue: boolean) {
    if (newValue) {
      this.character?.addSavingThrow(save);
    } else {
      this.character?.removeSavingThrow(save);
    }
    this.characterChanged.emit();
  }

  onHpTotalChanged($event: number) {
    debugger;
    if (this.character) {
      this.character.hitPointTotal = clamp(
        $event,
        0,
        this.character.hitPointMaximum
      );
      this.changeDetector.detectChanges();
    }
    this.characterChanged.emit();
  }
  onHpMaxChanged($event: number) {
    if (this.character) {
      this.character.hitPointMaximum = $event;
      this.character.hitPointTotal = clamp(
        this.character.hitPointTotal,
        0,
        $event
      );
      this.changeDetector.detectChanges();
      this.characterChanged.emit();
    }
  }
  onTempHpChanged($event: number) {
    if (this.character) {
      this.character.tempHitPoints = Math.max($event, 0);
      this.changeDetector.detectChanges();
    }
    this.characterChanged.emit();
  }

  addStatusResistance(resistance: string) {
    const indexPresent = this.character?.statusResistances.findIndex(
      (r) => r.value === resistance
    );
    if (indexPresent && indexPresent > 0) {
      return;
    }
    this.character?.statusResistances.push({
      type: 'resistance',
      value: resistance,
    });
    this.characterChanged.emit();
  }
  removeStatusResistance(deletedResistance: Resistance) {
    if (!this.character) {
      return;
    }
    this.character!.statusResistances =
      this.character!.statusResistances.filter(
        (res) => res.value != deletedResistance.value
      );
    this.characterChanged.emit();
  }
  modifyStatusResistance($event: ResistanceModifyEvent) {
    if (!this.character) {
      return;
    }
    this.character.statusResistances = this.applyModifyEvent(
      this.character.statusResistances,
      $event
    );
    this.characterChanged.emit();
  }
  addDamageResistance(resistance: string) {
    const indexPresent = this.character?.damageResistances.findIndex(
      (r) => r.value === resistance
    );
    if (indexPresent && indexPresent > 0) {
      return;
    }
    this.character?.damageResistances.push({
      type: 'resistance',
      value: resistance,
    });
    this.characterChanged.emit();
  }
  removeDamageResistance(deletedResistance: Resistance) {
    if (!this.character) {
      return;
    }
    this.character!.damageResistances =
      this.character!.damageResistances.filter(
        (res) => res.value != deletedResistance.value
      );
    this.characterChanged.emit();
  }
  modifyDamageResistance($event: ResistanceModifyEvent) {
    if (!this.character) {
      return;
    }
    this.character.damageResistances = this.applyModifyEvent(
      this.character.damageResistances,
      $event
    );
    this.characterChanged.emit();
  }

  setArmorValue(newValue: string) {
    if (!this.character) {
      return;
    }
    const newAv = Number.parseInt(newValue);
    this.character!.armorValue = newAv;
    this.characterChanged.emit();
  }

  private applyModifyEvent(
    resistances: Resistance[],
    event: ResistanceModifyEvent
  ): Resistance[] {
    return resistances.map((r) =>
      r.value === event.old.value ? event.new : r
    );
  }
}
