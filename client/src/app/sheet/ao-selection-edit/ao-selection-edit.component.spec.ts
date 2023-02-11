import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AoSelection } from 'src/app/model/ao-selection';
import { AO_HIT_DICE } from 'src/app/model/constants';
import { EditableTextComponent } from '../editable-text/editable-text.component';

import { AoSelectionEditComponent } from './ao-selection-edit.component';

function placeholder() {
  const selection: AoSelection = {
    id: 0,
    abilityOrigin: '',
    level: 0,
    name: '',
    description: '',
    isPrimary: false,
    takenAtLevel: 0,
  };
  const aoNames: string[] = Object.keys(AO_HIT_DICE);
  return {
    selection,
    aoNames,
  };
}

describe('AoSelectionEditComponent', () => {
  let component: AoSelectionEditComponent;
  let fixture: ComponentFixture<AoSelectionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AoSelectionEditComponent, EditableTextComponent],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: placeholder() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AoSelectionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
