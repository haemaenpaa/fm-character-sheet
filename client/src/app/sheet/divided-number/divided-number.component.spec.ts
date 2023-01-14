import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DividedNumberComponent } from './divided-number.component';

describe('DividedNumberComponent', () => {
  let component: DividedNumberComponent;
  let fixture: ComponentFixture<DividedNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DividedNumberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DividedNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
