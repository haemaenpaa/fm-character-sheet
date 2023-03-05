import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleRoll } from 'src/app/model/diceroll';

import { HealthRollRowComponent } from './health-roll-row.component';

describe('HealthRollRowComponent', () => {
  let component: HealthRollRowComponent;
  let fixture: ComponentFixture<HealthRollRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HealthRollRowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HealthRollRowComponent);
    component = fixture.componentInstance;
    component.roll = new SimpleRoll();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
