import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterBuilder } from 'src/app/model/character-builder';
import { RollComponent } from 'src/app/model/diceroll';

import { AttackListComponent } from './attack-list.component';

describe('AttackListComponent', () => {
  let component: AttackListComponent;
  let fixture: ComponentFixture<AttackListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttackListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AttackListComponent);
    component = fixture.componentInstance;
    component.character = new CharacterBuilder().build();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add attack', () => {
    component.addAttack();
    expect(component.character.attacks.length)
      .withContext('An attack should have been added')
      .toBe(1);
  });

  it('should delete attack', () => {
    const attack1 = {
      id: 1,
      name: 'New attack',
      range: '1m',
      abilities: ['br'],
      proficient: true,
      attackBonus: 0,
      damage: [{ id: 11, type: 'slashing', roll: new RollComponent(6) }],
      offhand: false,
      effects: [],
    };
    const attack2 = {
      id: 2,
      name: 'New attack',
      range: '1m',
      abilities: ['br'],
      proficient: true,
      attackBonus: 0,
      damage: [{ id: 12, type: 'slashing', roll: new RollComponent(6) }],
      offhand: false,
      effects: [],
    };
    component.character.attacks.push(attack1, attack2);
    component.onAttackDeleted(attack1);
    expect(component.character.attacks.length)
      .withContext('An attack should have been deleted')
      .toBe(1);
    expect(component.character.attacks[0].id)
      .withContext('The correct attack should have been deleted')
      .toBe(2);
  });
  it('should modify attack', () => {
    const attack1 = {
      id: 1,
      name: 'New attack',
      range: '1m',
      abilities: ['br'],
      proficient: true,
      attackBonus: 0,
      damage: [{ id: 11, type: 'slashing', roll: new RollComponent(6) }],
      offhand: false,
      effects: [],
    };
    const attack2 = {
      id: 2,
      name: 'Modified attack',
      range: '1m',
      abilities: ['br'],
      proficient: true,
      attackBonus: 0,
      damage: [{ id: 12, type: 'slashing', roll: new RollComponent(6) }],
      offhand: false,
      effects: [],
    };
    const modified = {
      id: 2,
      name: 'Modified attack',
      range: '1m',
      abilities: ['br'],
      proficient: true,
      attackBonus: 0,
      damage: [{ id: 11, type: 'slashing', roll: new RollComponent(6) }],
      offhand: false,
      effects: [],
    };
    component.character.attacks.push(attack1, attack2);
    component.onAttackChanged(modified);

    expect(component.character.attacks.length)
      .withContext('Attacks should not have been added or deleted.')
      .toBe(2);
    expect(component.character.attacks[1].name)
      .withContext('The modified attack should have been modified')
      .toBe(modified.name);
  });
});
