import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HitDiceRollerComponent } from './hit-dice-roller.component';

describe('HitDiceRollerComponent', () => {
  let component: HitDiceRollerComponent;
  let fixture: ComponentFixture<HitDiceRollerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HitDiceRollerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HitDiceRollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
