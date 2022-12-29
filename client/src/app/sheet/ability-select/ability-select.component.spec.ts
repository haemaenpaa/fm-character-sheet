import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilitySelectComponent } from './ability-select.component';

describe('AbilitySelectComponent', () => {
  let component: AbilitySelectComponent;
  let fixture: ComponentFixture<AbilitySelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbilitySelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbilitySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
