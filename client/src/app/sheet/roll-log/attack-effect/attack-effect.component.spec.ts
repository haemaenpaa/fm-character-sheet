import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Roll } from 'src/app/model/diceroll';

import { AttackEffectComponent } from './attack-effect.component';

describe('AttackEffectComponent', () => {
  let component: AttackEffectComponent;
  let fixture: ComponentFixture<AttackEffectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttackEffectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AttackEffectComponent);
    component = fixture.componentInstance;
    component.roll = new Roll();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
