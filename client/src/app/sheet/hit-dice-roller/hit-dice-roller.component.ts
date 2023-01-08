import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import CharacterHitDice, { hitDiceSum } from 'src/app/model/character-hit-dice';
import { HitDieParams } from 'src/app/model/game-action';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';

export interface HitDiceRollerData {
  characterId: number;
  hitDiceMax: CharacterHitDice;
  hitDiceRemaining: CharacterHitDice;
}

@Component({
  selector: 'hit-dice-roller',
  templateUrl: './hit-dice-roller.component.html',
  styleUrls: ['./hit-dice-roller.component.css'],
})
export class HitDiceRollerComponent {
  characterId: number;
  hitDiceMax: CharacterHitDice;
  hitDiceRemaining: CharacterHitDice;
  colorized: boolean = false;
  regain: number = 1;
  spend: number = 1;
  constructor(
    private actionService: ActionDispatchService,
    private dialogRef: MatDialogRef<HitDiceRollerComponent>,
    @Inject(MAT_DIALOG_DATA) data: HitDiceRollerData
  ) {
    this.characterId = data.characterId;
    this.hitDiceMax = data.hitDiceMax;
    this.hitDiceRemaining = data.hitDiceRemaining;
  }

  get totalRemaining(): number {
    return hitDiceSum(this.hitDiceRemaining);
  }
  get maximum(): number {
    return hitDiceSum(this.hitDiceMax);
  }

  roll(count: number) {
    if (count === 0) {
      this.dialogRef.close();
      return;
    }
    const result = { ...this.hitDiceRemaining };
    const params: HitDieParams = {
      characterId: this.characterId,
      6: 0,
      8: 0,
      10: 0,
      12: 0,
    };
    const sizes = [12, 10, 8, 6];
    var useRemaining = count;
    for (let size of sizes) {
      if (useRemaining == 0) {
        break;
      }
      const remaining = (result as any)[size];
      if (useRemaining > remaining) {
        (result as any)[size] = 0;
        useRemaining -= remaining;
        (params as any)[size] = remaining;
      } else {
        (result as any)[size] = remaining - useRemaining;
        (params as any)[size] = useRemaining;
        break;
      }
    }
    this.actionService.dispatch({ type: 'hit-die', params });
    this.dialogRef.close(result as CharacterHitDice);
  }

  regainHalf() {
    const toRegain = Math.floor((this.maximum - this.totalRemaining) / 2);
    this.regainDice(Math.max(1, toRegain));
  }

  regainDice(count: number) {
    if (count === 0 || this.totalRemaining === this.maximum) {
      this.dialogRef.close();
      return;
    }
    const result = { ...this.hitDiceRemaining };
    const sizes = [6, 8, 10, 12];
    var regainRemaining = count;
    for (let size of sizes) {
      if (regainRemaining == 0) {
        break;
      }
      const remaining = (result as any)[size];
      const max = (this.hitDiceMax as any)[size];
      if (remaining === max) {
        continue;
      }
      if (regainRemaining > max - remaining) {
        (result as any)[size] = max;
        regainRemaining -= max - remaining;
      } else {
        (result as any)[size] += regainRemaining;
        break;
      }
    }
    console.log('Regain', result);

    this.dialogRef.close(result as CharacterHitDice);
  }

  rollHealth() {
    const params: HitDieParams = {
      characterId: this.characterId,
      6: this.hitDiceMax[6],
      8: this.hitDiceMax[8],
      10: this.hitDiceMax[10],
      12: this.hitDiceMax[12],
    };
    this.actionService.dispatch({ type: 'health-roll', params });
    this.dialogRef.close();
  }
}
