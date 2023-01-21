import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Roll } from 'src/app/model/diceroll';

import { SpellAttackRollComponent } from './spell-attack-roll.component';

describe('SpellAttackRollComponent', () => {
  let component: SpellAttackRollComponent;
  let fixture: ComponentFixture<SpellAttackRollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpellAttackRollComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpellAttackRollComponent);
    component = fixture.componentInstance;
    component.roll = new Roll();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
