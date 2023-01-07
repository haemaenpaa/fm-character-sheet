import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';
import DummyClass from 'src/app/utils/dummy-class';
import { ModifierPipe } from '../../pipe/modifier.pipe';

import { AttackItemComponent } from './attack-item.component';

describe('AttackItemComponent', () => {
  let component: AttackItemComponent;
  let fixture: ComponentFixture<AttackItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttackItemComponent, ModifierPipe],
      providers: [
        { provide: MatDialog, useClass: DummyClass },
        { provide: ActionDispatchService, useClass: DummyClass },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AttackItemComponent);
    component = fixture.componentInstance;
    component.attack = {
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
    component.abilityModifiers = {
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
    component.proficiency = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute ability bonus', () => {
    component.attack.abilities = ['br', 'cun'];
    component.abilityModifiers.br = 3;
    component.abilityModifiers.cun = -1;
    expect(component.abilityBonus).toBe(2);
  });
  it('should compute ability damage bonus', () => {
    component.attack.abilities = ['br', 'cun'];
    component.abilityModifiers.br = 3;
    component.abilityModifiers.cun = -1;
    expect(component.abilityDamageBonus)
      .withContext('All ability modifiers should count for main hand attack.')
      .toBe(2);
    component.attack.offhand = true;
    expect(component.abilityDamageBonus)
      .withContext('Only negative modifiers count for offhand damage.')
      .toBe(-1);
  });
});
