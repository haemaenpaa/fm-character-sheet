import { ComponentFixture, TestBed } from '@angular/core/testing';
import { range } from 'rxjs';
import { CharacterBuilder } from 'src/app/model/character-builder';
import { GameAction, SaveParams } from 'src/app/model/game-action';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';
import { HitPointsComponent } from '../hit-points/hit-points.component';
import { AbilityNamePipe } from '../pipe/ability-name.pipe';
import { SavingThrowComponent } from '../saving-throw/saving-throw.component';

import { DefensesComponent } from './defenses.component';

class MockActionDispatchService extends ActionDispatchService {
  dispatchedActions: GameAction[] = [];
  public override dispatch(action: GameAction) {
    this.dispatchedActions.push(action);
  }
}

describe('DefensesComponent', () => {
  let component: DefensesComponent;
  let fixture: ComponentFixture<DefensesComponent>;
  let actionDispatchService: MockActionDispatchService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DefensesComponent,
        HitPointsComponent,
        SavingThrowComponent,
        AbilityNamePipe,
      ],
      providers: [
        { provide: ActionDispatchService, useClass: MockActionDispatchService },
      ],
    }).compileComponents();

    actionDispatchService = TestBed.inject(
      ActionDispatchService
    ) as MockActionDispatchService;

    fixture = TestBed.createComponent(DefensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display AV', () => {
    const character = new CharacterBuilder().build();
    component.character = character;
    for (let av of [8, 11, 16]) {
      character.armorValue = av;
      fixture.detectChanges();
      const element: HTMLElement = fixture.nativeElement;
      const shownAv = element.querySelector('#av-display')?.textContent;
      expect(shownAv).toBe(character.armorValue.toString());
    }
  });

  it('should detect saves', () => {
    const character = new CharacterBuilder().addSavingThrow('br').build();
    component.character = character;
    fixture.detectChanges();
    expect(component.hasSave('br')).toBeTrue();
    expect(component.hasSave('dex')).toBeFalse();
  });

  it('should roll saves', () => {
    const ability = 'br';
    const character = new CharacterBuilder()
      .addSelection('Mock AO', 1, 'Mock selection', '')
      .build();
    component.character = character;
    fixture.detectChanges();
    component.callRoll(ability);
    expect(actionDispatchService.dispatchedActions.length)
      .withContext('Roll should have been called')
      .toBeGreaterThan(0);
    const action = actionDispatchService.dispatchedActions[0];
    expect(action.type)
      .withContext('Roll should have been a saving throw')
      .toBe('ability-save');
    const params = action.params as SaveParams;
    expect(params.ability.identifier)
      .withContext('Saving throw ability should have been Brawn')
      .toBe(ability);
  });

  it('should apply proficiency on proficient saves', () => {
    const ability = 'br';
    const character = new CharacterBuilder()
      .addSelection('Mock AO', 1, 'Mock selection', '')
      .addSavingThrow(ability)
      .build();
    component.character = character;
    fixture.detectChanges();
    component.callRoll(ability);
    expect(actionDispatchService.dispatchedActions.length);
    const action = actionDispatchService.dispatchedActions[0];
    expect(action.type);
    const params = action.params as SaveParams;
    expect(params.proficiency)
      .withContext('Saving throw should have contained proficiency.')
      .not.toBeNull();
  });

  it('should not apply proficiency on non-proficient saves', () => {
    const ability = 'br';
    const character = new CharacterBuilder()
      .addSelection('Mock AO', 1, 'Mock selection', '')
      .build();
    component.character = character;
    fixture.detectChanges();
    component.callRoll(ability);
    expect(actionDispatchService.dispatchedActions.length);
    const action = actionDispatchService.dispatchedActions[0];
    expect(action.type);
    const params = action.params as SaveParams;
    expect(params.proficiency)
      .withContext('Saving throw should not have contained proficiency.')
      .toBeNull();
  });

  it('should use correct ability for saves', () => {
    const character = new CharacterBuilder()
      .addSelection('Mock AO', 1, 'Mock selection', '')
      .setIntelligence(12)
      .setCunning(8)
      .build();
    component.character = character;
    fixture.detectChanges();
    component.callRoll('int/cun');
    const action = actionDispatchService.dispatchedActions[0];
    const params = action.params as SaveParams;
    expect(params.ability.identifier)
      .withContext('Saving throw ability should have been Intelligence')
      .toBe('int');
  });

  it('should toggle saves', () => {
    const proficientAbility = 'dex';
    const nonProficientAbility = 'com';
    const character = new CharacterBuilder()
      .addSavingThrow(proficientAbility)
      .build();
    component.character = character;
    component.toggleAbility(nonProficientAbility, true);
    expect(character.savingThrows)
      .withContext('Proficiency should have been added')
      .toContain(nonProficientAbility);

    component.toggleAbility(proficientAbility, false);
    expect(character.savingThrows)
      .withContext('Proficiency should have been removed')
      .not.toContain(proficientAbility);
  });

  it('should not alter already set saves', () => {
    const proficientAbility = 'dex';
    const nonProficientAbility = 'com';
    const character = new CharacterBuilder()
      .addSavingThrow(proficientAbility)
      .build();
    component.character = character;
    component.toggleAbility(nonProficientAbility, false);
    expect(character.savingThrows)
      .withContext('Disabling disabled should not have led to changes.')
      .not.toContain(nonProficientAbility);

    component.toggleAbility(proficientAbility, true);
    expect(character.savingThrows)
      .withContext('Enabling enabled should not have led to changes.')
      .toContain(proficientAbility);
    const count = character.savingThrows.reduce((count, save) => {
      if (save == proficientAbility) return count + 1;
      return count;
    }, 0);
    expect(count)
      .withContext('Enabling enabled should not have caused an addition')
      .toBe(1);
  });

  it('should set hit point total', () => {
    const maxHP = 10;
    const hitPointTotal = 5;
    const character = new CharacterBuilder().setMaxHP(maxHP).build();
    component.character = character;
    component.onHpTotalChanged(hitPointTotal);
    expect(character.hitPointTotal)
      .withContext('Component should alter hit point total')
      .toBe(hitPointTotal);
  });

  it('should clamp hit point total', () => {
    const maxHP = 10;
    const hitPointTotal = maxHP * 3;
    const character = new CharacterBuilder().setMaxHP(maxHP).build();
    component.character = character;
    component.onHpTotalChanged(hitPointTotal);
    expect(character.hitPointTotal)
      .withContext('Component should clamp hit point total to maximum')
      .toBe(maxHP);
    component.onHpTotalChanged(-hitPointTotal);
    expect(character.hitPointTotal)
      .withContext('Component should clamp hit point total to minimum')
      .toBe(0);
  });

  it('should set temp hp', () => {
    const maxHP = 10;
    const hitPointTotal = 5;
    const character = new CharacterBuilder().setMaxHP(maxHP).build();
    component.character = character;
    component.onTempHpChanged(hitPointTotal);
    expect(character.tempHitPoints)
      .withContext('Component should alter temporary hit points')
      .toBe(hitPointTotal);
  });

  it('should clamp temp hp', () => {
    const maxHP = 10;
    const hitPointTotal = -5;
    const character = new CharacterBuilder().setMaxHP(maxHP).build();
    component.character = character;
    component.onTempHpChanged(hitPointTotal);
    expect(character.tempHitPoints)
      .withContext('Component should alter temporary hit points')
      .toBe(0);
  });
});
