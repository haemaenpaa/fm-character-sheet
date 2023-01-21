import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AoSelectionEditComponent } from './ao-selection-edit.component';

describe('AoSelectionEditComponent', () => {
  let component: AoSelectionEditComponent;
  let fixture: ComponentFixture<AoSelectionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AoSelectionEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AoSelectionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
