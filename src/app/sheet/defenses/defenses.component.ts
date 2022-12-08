import { Component, Input } from '@angular/core';
import { Ability } from 'src/app/model/ability';
import Character from 'src/app/model/character';
import { SaveParams } from 'src/app/model/game-action';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';

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

  savingThrows: string[] = [
    'br',
    'dex',
    'vit',
    'int/cun',
    'res',
    'pre/man',
    'com',
  ];

  constructor(private actionService: ActionDispatchService) {}

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
  }

  onHpTotalChanged($event: number) {
    if (this.character) {
      this.character.hitPointTotal = clamp(
        $event,
        0,
        this.character.hitPointMaximum
      );
    }
  }
  onTempHpChanged($event: number) {
    if (this.character) {
      this.character.tempHitPoints = Math.max($event, 0);
    }
  }
}
