import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbilityNamePipe } from '../pipe/ability-name.pipe';

import { SavingThrowComponent } from './saving-throw.component';

describe('SavingThrowComponent', () => {
  let component: SavingThrowComponent;
  let fixture: ComponentFixture<SavingThrowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SavingThrowComponent, AbilityNamePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(SavingThrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
