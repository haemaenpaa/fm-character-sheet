import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellDamageRollComponent } from './spell-damage-roll.component';

describe('SpellDamageRollComponent', () => {
  let component: SpellDamageRollComponent;
  let fixture: ComponentFixture<SpellDamageRollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpellDamageRollComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpellDamageRollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
