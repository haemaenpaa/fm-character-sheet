import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { AoSelection } from 'src/app/model/ao-selection';

import { AoSelectionItemComponent } from './ao-selection-item.component';

describe('AoSelectionItemComponent', () => {
  let component: AoSelectionItemComponent;
  let fixture: ComponentFixture<AoSelectionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AoSelectionItemComponent],
      providers: [{ provide: MatDialog, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(AoSelectionItemComponent);
    component = fixture.componentInstance;
    component.selection = new AoSelection();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
