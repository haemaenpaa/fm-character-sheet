import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbilityNumberStruct } from 'src/app/model/character';
import { AbilityNamePipe } from '../pipe/ability-name.pipe';
import { ModifierPipe } from '../pipe/modifier.pipe';

import { AbilitySelectComponent } from './ability-select.component';

function placeholder() {
  const struct: AbilityNumberStruct = {
    br: 0,
    dex: 0,
    vit: 0,
    int: 0,
    cun: 0,
    res: 0,
    pre: 0,
    man: 0,
    com: 0,
  };
  return {
    abilities: struct,
    baseModifier: 0,
    colorized: false,
  };
}

describe('AbilitySelectComponent', () => {
  let component: AbilitySelectComponent;
  let fixture: ComponentFixture<AbilitySelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AbilitySelectComponent, AbilityNamePipe, ModifierPipe],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: placeholder() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AbilitySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
