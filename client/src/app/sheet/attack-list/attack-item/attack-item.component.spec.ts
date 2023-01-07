import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttackItemComponent } from './attack-item.component';

describe('AttackItemComponent', () => {
  let component: AttackItemComponent;
  let fixture: ComponentFixture<AttackItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttackItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttackItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
