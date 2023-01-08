import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HitDiceDisplayComponent } from './hit-dice-display.component';

describe('HitDiceDisplayComponent', () => {
  let component: HitDiceDisplayComponent;
  let fixture: ComponentFixture<HitDiceDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HitDiceDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HitDiceDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
