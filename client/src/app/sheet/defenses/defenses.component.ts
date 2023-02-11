import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Ability } from 'src/app/model/ability';
import Character from 'src/app/model/character';
import CharacterHitDice from 'src/app/model/character-hit-dice';
import { SaveParams } from 'src/app/model/game-action';
import Resistance from 'src/app/model/resistance';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';
import { CharacterService } from 'src/app/services/character.service';
import { HitDiceService } from 'src/app/services/hit-dice.service';
import { ResistanceService } from 'src/app/services/resistance.service';
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
  @Input() character!: Character;
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
    private characterService: CharacterService,
    private hitDiceService: HitDiceService,
    private resistanceService: ResistanceService,
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
    const oldSaves = [...this.character.savingThrows];
    if (newValue) {
      this.character.addSavingThrow(save);
    } else {
      this.character.removeSavingThrow(save);
    }
    this.updateOnFieldChange('savingThrows', oldSaves);
    this.characterChanged.emit();
  }

  onHpTotalChanged($event: number) {
    const oldValue = this.character.hitPointTotal;
    this.character.hitPointTotal = clamp(
      $event,
      0,
      this.character.hitPointMaximum
    );
    this.updateOnFieldChange('hitPointTotal', oldValue);
    this.changeDetector.detectChanges();
  }
  onHpMaxChanged($event: number) {
    const oldTotal = this.character.hitPointTotal;
    const oldMax = this.character.hitPointMaximum;
    this.character.hitPointMaximum = $event;
    this.character.hitPointTotal = clamp(
      this.character.hitPointTotal,
      0,
      $event
    );

    this.characterService
      .updateCharacter(this.character)
      .catch((err) => {
        console.error('Failed to set hit point max', err);
        this.character.hitPointMaximum = oldMax;
        this.character.hitPointTotal = oldTotal;
      })
      .then((char) => {
        if (char) {
          this.characterChanged.emit();
        }
      });
  }
  onTempHpChanged($event: number) {
    const oldValue = this.character.tempHitPoints;
    if (this.character) {
      this.character.tempHitPoints = Math.max($event, 0);
      this.changeDetector.detectChanges();
    }
    this.updateOnFieldChange('tempHitPoints', oldValue);
  }

  addStatusResistance(resistance: string) {
    const oldResistances = [...this.character.statusResistances];
    const indexPresent = this.character?.statusResistances.findIndex(
      (r) => r.value === resistance
    );
    if (indexPresent && indexPresent > 0) {
      return;
    }
    const added: Resistance = {
      type: 'resistance',
      value: resistance,
    };
    this.character.statusResistances = [
      ...this.character.statusResistances,
      added,
    ];
    this.resistanceService
      .updateStatusResistance(added, this.character.id!)
      .then(
        (_) => this.characterChanged.emit(),
        (error) => {
          console.error('Failed to create status resistance.', error);
          this.character.statusResistances = oldResistances;
        }
      );
  }
  removeStatusResistance(deletedResistance: Resistance) {
    const oldResistances = [...this.character.statusResistances];
    if (!this.character) {
      return;
    }
    this.character.statusResistances = this.character.statusResistances.filter(
      (res) => res.value != deletedResistance.value
    );

    this.resistanceService
      .deleteStatusResistance(deletedResistance.value, this.character.id!)
      .then(
        (_) => this.characterChanged.emit(),
        (error) => {
          console.error('Failed to delete status resistance.', error);
          this.character.statusResistances = oldResistances;
        }
      );
  }
  modifyStatusResistance($event: ResistanceModifyEvent) {
    const oldResistances = [...this.character.statusResistances];
    if (!this.character) {
      return;
    }
    this.character.statusResistances = this.applyModifyEvent(
      this.character.statusResistances,
      $event
    );

    this.resistanceService
      .updateStatusResistance($event.new, this.character.id!)
      .then(
        (_) => this.characterChanged.emit(),
        (error) => {
          console.error('Failed to create status resistance.', error);
          this.character.statusResistances = oldResistances;
        }
      );
  }
  addDamageResistance(resistance: string) {
    const oldResistances = [...this.character.damageResistances];
    const indexPresent = this.character?.damageResistances.findIndex(
      (r) => r.value === resistance
    );
    if (indexPresent && indexPresent > 0) {
      return;
    }
    const added: Resistance = {
      type: 'resistance',
      value: resistance,
    };
    this.character.damageResistances = [
      ...this.character.damageResistances,
      added,
    ];
    this.resistanceService
      .updateDamageResistance(added, this.character.id!)
      .then(
        (_) => this.characterChanged.emit(),
        (error) => {
          console.error('Failed to create damage resistance', error);
          this.character.damageResistances = oldResistances;
        }
      );
  }

  removeDamageResistance(deletedResistance: Resistance) {
    const oldResistances = [...this.character.damageResistances];
    this.character.damageResistances = this.character.damageResistances.filter(
      (res) => res.value != deletedResistance.value
    );
    this.resistanceService
      .deleteDamageResistance(deletedResistance.value, this.character.id!)
      .then(
        (_) => this.characterChanged.emit(),
        (error) => {
          console.error('Failed to delete damage resistance', error);
          this.character.damageResistances = oldResistances;
        }
      );
  }

  modifyDamageResistance($event: ResistanceModifyEvent) {
    if (!this.character) {
      return;
    }
    const oldResistances = [...this.character.damageResistances];
    this.character.damageResistances = this.applyModifyEvent(
      this.character.damageResistances,
      $event
    );
    this.resistanceService
      .updateDamageResistance($event.new, this.character.id!)
      .then(
        (_) => this.characterChanged.emit(),
        (error) => {
          console.error('Failed to modify resistance', error);
          this.character.damageResistances = oldResistances;
        }
      );
  }

  setArmorValue(newValue: number) {
    const oldAv = this.character.armorValue;
    this.character.armorValue = newValue;
    this.updateOnFieldChange('armorValue', oldAv);
  }

  setSpeed(newSpeed: number) {
    const oldSpeed = this.character.speed;
    this.character.speed = newSpeed;
    this.updateOnFieldChange('speed', oldSpeed);
  }

  onRemainingHitDiceChanged(hitDice: CharacterHitDice) {
    const oldRemaining = { ...this.character.hitDiceRemaining };
    this.character!.hitDiceRemaining = hitDice;
    this.hitDiceService
      .updateHitDiceRemaining(hitDice, this.character.id!)
      .catch((error) => {
        this.character.hitDiceRemaining = oldRemaining;
      })
      .then((r) => {
        if (r) {
          this.characterChanged.emit();
        }
      });
  }

  private updateOnFieldChange(field: string, oldValue: any) {
    this.characterService
      .updateCharacter(this.character)
      .catch((err) => {
        console.error(`Failed to set ${field}`, err);
        (this.character as any)[field] = oldValue;
        this.changeDetector.detectChanges();
      })
      .then((char) => {
        if (char) {
          this.characterChanged.emit();
        }
      });
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
