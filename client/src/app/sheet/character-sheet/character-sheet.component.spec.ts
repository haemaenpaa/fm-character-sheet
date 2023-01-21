import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { CharacterSheetComponent } from './character-sheet.component';

describe('CharacterSheetComponent', () => {
  let component: CharacterSheetComponent;
  let fixture: ComponentFixture<CharacterSheetComponent>;
  let paramMap: Observable<ParamMap>;

  beforeEach(async () => {
    paramMap = new Subject();
    await TestBed.configureTestingModule({
      declarations: [CharacterSheetComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { paramMap } },
        { provide: MatDialog, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
