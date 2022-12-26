import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingThrowLogComponent } from './saving-throw-log.component';

describe('SavingThrowLogComponent', () => {
  let component: SavingThrowLogComponent;
  let fixture: ComponentFixture<SavingThrowLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavingThrowLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingThrowLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
