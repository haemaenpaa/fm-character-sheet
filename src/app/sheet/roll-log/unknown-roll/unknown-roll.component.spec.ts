import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnknownRollComponent } from './unknown-roll.component';

describe('UnknownRollComponent', () => {
  let component: UnknownRollComponent;
  let fixture: ComponentFixture<UnknownRollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnknownRollComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnknownRollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
