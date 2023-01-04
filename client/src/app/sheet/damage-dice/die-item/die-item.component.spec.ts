import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DieItemComponent } from './die-item.component';

describe('DieItemComponent', () => {
  let component: DieItemComponent;
  let fixture: ComponentFixture<DieItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DieItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DieItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
