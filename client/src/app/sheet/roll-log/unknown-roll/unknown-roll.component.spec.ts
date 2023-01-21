import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Roll } from 'src/app/model/diceroll';

import { UnknownRollComponent } from './unknown-roll.component';

describe('UnknownRollComponent', () => {
  let component: UnknownRollComponent;
  let fixture: ComponentFixture<UnknownRollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnknownRollComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnknownRollComponent);
    component = fixture.componentInstance;
    component.roll = new Roll();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
