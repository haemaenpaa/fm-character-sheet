import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { CharacterBuilder } from 'src/app/model/character-builder';
import { AoSelectionService } from 'src/app/services/ao-selection.service';
import { AoSelectionListComponent } from '../ao-selection-list/ao-selection-list.component';
import { SortSelectionsPipe } from '../ao-selection-list/sort-selections.pipe';
import { RacialAbilitiesComponent } from '../racial-abilities/racial-abilities.component';

import { AbilitiesListComponent } from './abilities-list.component';

const dummySelectionsService = {};

describe('AbilitiesListComponent', () => {
  let component: AbilitiesListComponent;
  let fixture: ComponentFixture<AbilitiesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AbilitiesListComponent,
        AoSelectionListComponent,
        RacialAbilitiesComponent,
        SortSelectionsPipe,
      ],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: AoSelectionService, useValue: dummySelectionsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AbilitiesListComponent);
    component = fixture.componentInstance;
    component.character = new CharacterBuilder().build();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
