import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Race } from 'src/app/model/race';
import { EditableTextComponent } from '../editable-text/editable-text.component';
import { RacialAbilitiesComponent } from '../racial-abilities/racial-abilities.component';
import { ResistancesComponent } from '../resistances/resistances.component';

import { RaceEditComponent } from './race-edit.component';
function placeholder() {
  const race: Race = {
    name: 'Test race',
    subrace: null,
    abilities: {},
    damageResistances: [],
    statusResistances: [],
  };
  const colorized: boolean = false;
  return { race, colorized };
}
describe('RaceEditComponent', () => {
  let component: RaceEditComponent;
  let fixture: ComponentFixture<RaceEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RaceEditComponent,
        EditableTextComponent,
        ResistancesComponent,
        RacialAbilitiesComponent,
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: placeholder() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RaceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
