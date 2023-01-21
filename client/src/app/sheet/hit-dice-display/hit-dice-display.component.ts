import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import CharacterHitDice from 'src/app/model/character-hit-dice';
import {
  HitDiceRollerComponent,
  HitDiceRollerData,
} from '../hit-dice-roller/hit-dice-roller.component';

function hitDiceHash(input: CharacterHitDice) {
  const prime = 31;
  var ret = 0;
  for (const size in input) {
    ret = prime * ret + (input as any)[size];
  }
  return ret;
}

function hitDiceEqual(a: CharacterHitDice, b: CharacterHitDice): boolean {
  for (const size in a) {
    if ((a as any)[size] !== (b as any)[size]) {
      return false;
    }
  }
  return true;
}

interface HitDieDisplay {
  size: number;
  max: number;
  remaining: number;
}

@Component({
  selector: 'hit-dice-display',
  templateUrl: './hit-dice-display.component.html',
  styleUrls: ['./hit-dice-display.component.css'],
})
export class HitDiceDisplayComponent {
  @Input() hitDiceMax!: CharacterHitDice;
  @Input() hitDiceRemaining!: CharacterHitDice;
  @Input() characterId!: number;
  @Input() colorized: boolean = false;
  @Output() remainingChanged: EventEmitter<CharacterHitDice> =
    new EventEmitter();
  displaymemo: {
    hash: number;
    value?: HitDieDisplay[];
    hitDice?: CharacterHitDice;
    remaining?: CharacterHitDice;
  } = { hash: 0 };

  constructor(private dialog: MatDialog) {}

  get hitDiceDisplay(): HitDieDisplay[] {
    const hash =
      hitDiceHash(this.hitDiceMax) + 31 * hitDiceHash(this.hitDiceRemaining);
    if (
      !this.displaymemo.value ||
      hash != this.displaymemo.hash ||
      !hitDiceEqual(this.displaymemo.hitDice!, this.hitDiceMax) ||
      !hitDiceEqual(this.displaymemo.remaining!, this.hitDiceRemaining)
    ) {
      this.displaymemo.hash = hash;
      const value: HitDieDisplay[] = [];
      for (const size in this.hitDiceMax) {
        const max = (this.hitDiceMax as any)[size];
        if (max === 0) {
          continue;
        }
        const remaining = (this.hitDiceRemaining as any)[size];
        value.push({
          size: Number.parseInt(size),
          max,
          remaining,
        });
      }
      this.displaymemo.value = value;
      this.displaymemo.hitDice = { ...this.hitDiceMax };
      this.displaymemo.remaining = { ...this.hitDiceRemaining };
    }
    console.log(this.displaymemo.remaining);
    return this.displaymemo.value!;
  }

  openRoller() {
    const data: HitDiceRollerData = {
      characterId: this.characterId,
      hitDiceMax: { ...this.hitDiceMax },
      hitDiceRemaining: { ...this.hitDiceRemaining },
    };
    const dialogRef = this.dialog.open(HitDiceRollerComponent, {
      data,
    });
    dialogRef.componentInstance.colorized = this.colorized;
    dialogRef.afterClosed().subscribe((rem) => {
      if (!rem) {
        return;
      }
      this.remainingChanged.emit(rem);
    });
  }
}
