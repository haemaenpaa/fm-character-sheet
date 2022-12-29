import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityGridComponent } from './ability-grid.component';

describe('AbilityGridComponent', () => {
  let component: AbilityGridComponent;
  let fixture: ComponentFixture<AbilityGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbilityGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbilityGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
