import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Roll } from 'src/app/model/diceroll';

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
    component.roll = new Roll();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
