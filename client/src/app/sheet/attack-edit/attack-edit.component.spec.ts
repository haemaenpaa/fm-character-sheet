import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AbilityNumberStruct } from 'src/app/model/character';
import CharacterAttack from 'src/app/model/character-attack';
import DummyClass from 'src/app/utils/dummy-class';
import { __values } from 'tslib';
import { DamageDiceComponent } from '../damage-dice/damage-dice.component';
import { EditableTextComponent } from '../editable-text/editable-text.component';

import { AttackEditComponent } from './attack-edit.component';

class DummyData {
  attack: CharacterAttack = {
    id: 0,
    name: '',
    range: '',
    abilities: [],
    proficient: false,
    attackBonus: 0,
    damage: [],
    offhand: false,
    effects: [],
  };
  abilities: AbilityNumberStruct = {
    br: 0,
    dex: 0,
    vit: 0,
    int: 0,
    cun: 0,
    res: 0,
    pre: 0,
    man: 0,
    com: 0,
  };
  proficiency: number = 0;
}

describe('AttackEditComponent', () => {
  let component: AttackEditComponent;
  let fixture: ComponentFixture<AttackEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AttackEditComponent,
        EditableTextComponent,
        DamageDiceComponent,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useClass: DummyData },
        { provide: MatDialogRef, useClass: DummyClass },
        { provide: MatDialog, useClass: DummyClass },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AttackEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove ability', () => {
    component.attack.abilities.push('br', 'dex');
    component.removeAbility('br');
    expect(component.attack.abilities)
      .withContext('A removed ability should have been removed')
      .not.toContain('br');
    expect(component.attack.abilities)
      .withContext('Other abilities should not have been removed')
      .toContain('dex');
  });

  it('should set null save', () => {
    const effect = {
      id: 0,
      description: 'Test',
      save: 'br',
      dv: 12,
    };
    component.attack.effects.push(effect);
    const event: any = { target: { value: 'null' } };
    component.setEffectSave(effect, event);
    expect(effect.save)
      .withContext('Null save should have been set')
      .toBeUndefined();
  });

  it('should remove effect', () => {
    const effect1 = {
      id: 1,
      description: 'Test',
      save: 'br',
      dv: 12,
    };
    const effect2 = {
      id: 2,
      description: 'Test',
      save: 'br',
      dv: 12,
    };
    component.attack.effects.push(effect1, effect2);
    component.removeEffect(effect1);
    expect(component.attack.effects.length)
      .withContext('Exactly one effect should remain.')
      .toBe(1);
    expect(component.attack.effects[0].id)
      .withContext('Correct effect should have been deleted')
      .toBe(2);
  });
});
