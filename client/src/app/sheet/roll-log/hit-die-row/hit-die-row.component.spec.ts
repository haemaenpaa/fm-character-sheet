import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Roll } from 'src/app/model/diceroll';

import { HitDieRowComponent } from './hit-die-row.component';

describe('HitDieRowComponent', () => {
  let component: HitDieRowComponent;
  let fixture: ComponentFixture<HitDieRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HitDieRowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HitDieRowComponent);
    component = fixture.componentInstance;
    component.roll = new Roll();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
