import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import CharacterHitDice from 'src/app/model/character-hit-dice';
import { GameAction, HitDieParams } from 'src/app/model/game-action';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';
import { EditableTextComponent } from '../editable-text/editable-text.component';

import {
  HitDiceRollerComponent,
  HitDiceRollerData,
} from './hit-dice-roller.component';

function placeholder(): HitDiceRollerData {
  const dice: CharacterHitDice = {
    6: 0,
    8: 0,
    10: 0,
    12: 0,
  };
  return {
    characterId: 0,
    hitDiceMax: { ...dice },
    hitDiceRemaining: { ...dice },
  };
}

describe('HitDiceRollerComponent', () => {
  let component: HitDiceRollerComponent;
  let fixture: ComponentFixture<HitDiceRollerComponent>;
  let result: CharacterHitDice;
  let roll: GameAction;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HitDiceRollerComponent, EditableTextComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: (res: CharacterHitDice) => {
              result = res;
            },
          },
        },
        { provide: MAT_DIALOG_DATA, useValue: placeholder() },
        {
          provide: ActionDispatchService,
          useValue: {
            dispatch: (action: GameAction) => {
              roll = action;
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HitDiceRollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should regain half of maximum', () => {
    component.hitDiceMax = {
      6: 2,
      8: 2,
      10: 2,
      12: 0,
    };
    component.hitDiceRemaining = {
      6: 1,
      8: 0,
      10: 0,
      12: 0,
    };

    component.regainHalf();
    expect(result).not.toBeNull();
    expect(result[6]).withContext('wrong count of d6').toBe(2);
    expect(result[8]).withContext('wrong count of d8').toBe(2);
    expect(result[10]).withContext('wrong count of d10').toBe(0);
    expect(result[12]).withContext('wrong count of d12').toBe(0);
  });

  it('should not regain more than maximum', () => {
    component.hitDiceMax = {
      6: 2,
      8: 2,
      10: 2,
      12: 0,
    };
    component.hitDiceRemaining = {
      6: 2,
      8: 2,
      10: 0,
      12: 0,
    };

    component.regainHalf();
    expect(result).not.toBeNull();
    expect(result[6]).withContext('wrong count of d6').toBe(2);
    expect(result[8]).withContext('wrong count of d8').toBe(2);
    expect(result[10]).withContext('wrong count of d10').toBe(2);
    expect(result[12]).withContext('wrong count of d12').toBe(0);
  });

  it('should regain one', () => {
    component.hitDiceMax = {
      6: 0,
      8: 0,
      10: 1,
      12: 1,
    };

    component.regainHalf();
    expect(result).not.toBeNull();
    expect(result[6]).withContext('wrong count of d6').toBe(0);
    expect(result[8]).withContext('wrong count of d8').toBe(0);
    expect(result[10]).withContext('wrong count of d10').toBe(1);
    expect(result[12]).withContext('wrong count of d12').toBe(0);
  });

  it('should roll from largest', () => {
    component.hitDiceMax = {
      6: 0,
      8: 1,
      10: 2,
      12: 1,
    };
    component.hitDiceRemaining = {
      6: 0,
      8: 1,
      10: 2,
      12: 1,
    };
    component.roll(3);

    expect(result[6]).withContext('wrong count of d6').toBe(0);
    expect(result[8]).withContext('wrong count of d8').toBe(1);
    expect(result[10]).withContext('wrong count of d10').toBe(0);
    expect(result[12]).withContext('wrong count of d12').toBe(0);

    const checkParams = roll.params as HitDieParams;
    expect(checkParams[6]).withContext('wrong count of d6 rolled').toBe(0);
    expect(checkParams[8]).withContext('wrong count of d8 rolled').toBe(0);
    expect(checkParams[10]).withContext('wrong count of d10 rolled').toBe(2);
    expect(checkParams[12]).withContext('wrong count of d12 rolled').toBe(1);
  });

  it('should roll health', () => {
    component.hitDiceMax = {
      6: 3,
      8: 1,
      10: 2,
      12: 1,
    };
    component.hitDiceRemaining = {
      6: 1,
      8: 1,
      10: 1,
      12: 1,
    };
    component.rollHealth();
    expect(result).toBeUndefined();

    const checkParams = roll.params as HitDieParams;
    expect(checkParams[6]).withContext('wrong count of d6 rolled').toBe(3);
    expect(checkParams[8]).withContext('wrong count of d8 rolled').toBe(1);
    expect(checkParams[10]).withContext('wrong count of d10 rolled').toBe(2);
    expect(checkParams[12]).withContext('wrong count of d12 rolled').toBe(1);
  });
});
