import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Spell } from 'src/app/model/character-spells';
import DummyClass from 'src/app/utils/dummy-class';
import { DamageDiceComponent } from '../../damage-dice/damage-dice.component';

import { SpellDetailsComponent } from './spell-details.component';

function placeholder(): Spell {
  return {
    id: 0,
    tier: 0,
    school: '',
    name: '',
    description: '',
    damage: [],
    upcastDamage: [],
    ritual: false,
    soulMastery: false,
    concentration: false,
    attack: false,
    castingTime: '',
    duration: '',
    range: '',
    components: '',
    effect: '',
  };
}

class DummyData {
  spell: Spell = placeholder();
  characterId: number = -1;
}

describe('SpellDetailsComponent', () => {
  let component: SpellDetailsComponent;
  let fixture: ComponentFixture<SpellDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpellDetailsComponent, DamageDiceComponent],
      providers: [
        { provide: MatDialogRef, useClass: DummyClass },
        { provide: MatDialog, useClass: DummyClass },
        { provide: MAT_DIALOG_DATA, useClass: DummyData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SpellDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
