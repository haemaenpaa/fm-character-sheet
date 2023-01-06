import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import DummyClass from 'src/app/utils/dummy-class';
import { EditableTextComponent } from '../../editable-text/editable-text.component';

import { SlotEditComponent } from './slot-edit.component';

describe('SlotEditComponent', () => {
  let component: SlotEditComponent;
  let fixture: ComponentFixture<SlotEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SlotEditComponent, EditableTextComponent],
      providers: [
        { provide: MatDialogRef, useClass: DummyClass },
        { provide: MAT_DIALOG_DATA, useClass: DummyClass },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SlotEditComponent);
    component = fixture.componentInstance;
    component.regularSlots = {};
    component.specialSlots = {};

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set special slots', () => {
    component.setSpecial(3, '7');
    expect(component.specialSlots[3])
      .withContext('Special slot should have been edited.')
      .toBe(7);
  });
  it('should set regular slots', () => {
    component.setRegular(3, '7');
    expect(component.regularSlots[3])
      .withContext('Regular slot should have been edited.')
      .toBe(7);
  });
  it('should not set NaN', () => {
    component.setSpecial(3, 'a');
    component.setRegular(3, 'b');
    expect(component.regularSlots[3])
      .withContext('Regular slot should not be NaN')
      .not.toBeNaN();
    expect(component.specialSlots[3])
      .withContext('Special should should not be NaN')
      .not.toBeNaN();
  });

  it('should not set Negative', () => {
    component.setSpecial(3, '-2');
    component.setRegular(3, '-2');
    expect(component.regularSlots[3])
      .withContext('Regular slot should not be Negative')
      .toBe(0);
    expect(component.specialSlots[3])
      .withContext('Special should should not be Negative')
      .toBe(0);
  });
});
