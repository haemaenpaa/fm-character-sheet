import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { AoSelectionListComponent } from './ao-selection-list.component';
import { SortSelectionsPipe } from './sort-selections.pipe';

describe('AoSelectionListComponent', () => {
  let component: AoSelectionListComponent;
  let fixture: ComponentFixture<AoSelectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AoSelectionListComponent, SortSelectionsPipe],
      providers: [{ provide: MatDialog, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(AoSelectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
