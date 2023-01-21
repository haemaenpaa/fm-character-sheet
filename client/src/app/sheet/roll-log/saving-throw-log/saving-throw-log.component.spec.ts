import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Roll } from 'src/app/model/diceroll';
import { AbilityNamePipe } from '../../pipe/ability-name.pipe';

import { SavingThrowLogComponent } from './saving-throw-log.component';

describe('SavingThrowLogComponent', () => {
  let component: SavingThrowLogComponent;
  let fixture: ComponentFixture<SavingThrowLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SavingThrowLogComponent, AbilityNamePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(SavingThrowLogComponent);
    component = fixture.componentInstance;
    component.roll = new Roll();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
