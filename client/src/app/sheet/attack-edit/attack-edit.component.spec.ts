import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttackEditComponent } from './attack-edit.component';

describe('AttackEditComponent', () => {
  let component: AttackEditComponent;
  let fixture: ComponentFixture<AttackEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttackEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttackEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
