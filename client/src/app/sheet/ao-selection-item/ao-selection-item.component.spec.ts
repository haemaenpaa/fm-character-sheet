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
    component.selection = placeholder();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

function placeholder(): AoSelection {
  const selection: AoSelection = {
    id: 0,
    abilityOrigin: '',
    level: 0,
    name: '',
    description: '',
    isPrimary: false,
    takenAtLevel: 0,
  };
  return selection;
}
