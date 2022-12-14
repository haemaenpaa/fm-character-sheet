import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttackDamageComponent } from './attack-damage.component';

describe('AttackDamageComponent', () => {
  let component: AttackDamageComponent;
  let fixture: ComponentFixture<AttackDamageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttackDamageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttackDamageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
