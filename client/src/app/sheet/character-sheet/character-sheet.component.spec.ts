import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { CharacterSheetComponent } from './character-sheet.component';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';
import { Roll, RollComponent, SimpleRoll } from 'src/app/model/diceroll';
import { Clipboard } from '@angular/cdk/clipboard';

describe('CharacterSheetComponent', () => {
  let component: CharacterSheetComponent;
  let fixture: ComponentFixture<CharacterSheetComponent>;
  let paramMap: Observable<ParamMap>;
  let copied: string[];
  let dummyRolls: Subject<Roll>;

  beforeEach(async () => {
    dummyRolls = new Subject<Roll>();
    paramMap = new Subject();
    copied = [];
    const dummyDispatchService = {
      rolls: () => dummyRolls.asObservable(),
    };
    const dummyClipboard = {
      copy: (str: string) => {
        copied.push(str);
        return true;
      },
    };
    await TestBed.configureTestingModule({
      declarations: [CharacterSheetComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { paramMap } },
        { provide: MatDialog, useValue: {} },
        { provide: HttpClient, useValue: {} },
        { provide: Clipboard, useValue: {} },
        { provide: ActionDispatchService, useValue: dummyDispatchService },
        { provide: Clipboard, useValue: dummyClipboard },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should push rolls if enabled', () => {
    component.autoPushRolls = true;
    const roll = new SimpleRoll();
    roll.title = 'hit-dice';
    roll.addDie(new RollComponent(8));
    dummyRolls.next(roll);
    expect(copied.length).toBe(1);
    expect(copied[0]).toContain('d8');
  });

  it('should not push rolls if disabled', () => {
    component.autoPushRolls = false;
    const roll = new SimpleRoll();
    roll.title = 'hit-dice';
    roll.addDie(new RollComponent(12));
    dummyRolls.next(roll);
    expect(copied.length).toBe(0);
  });
});
