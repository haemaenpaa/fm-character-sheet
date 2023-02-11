import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Spell } from 'src/app/model/character-spells';
import DummyClass from 'src/app/utils/dummy-class';
import { DamageDiceComponent } from '../../damage-dice/damage-dice.component';
import { EditableTextComponent } from '../../editable-text/editable-text.component';
import { SpellEditComponent } from './spell-edit.component';

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

describe('SpellEditComponent', () => {
  let component: SpellEditComponent;
  let fixture: ComponentFixture<SpellEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SpellEditComponent,
        EditableTextComponent,
        DamageDiceComponent,
      ],
      providers: [
        { provide: MatDialogRef, useClass: DummyClass },
        { provide: MAT_DIALOG_DATA, useClass: DummyClass },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SpellEditComponent);
    component = fixture.componentInstance;
    component.spell = placeholder();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set null save', () => {
    component.spell.saveAbility = 'br';
    const event: any = { target: { value: 'null' } };
    component.onSaveSelect(event as Event);
    expect(component.spell.saveAbility)
      .withContext("Setting 'null' as save ability should set null value.")
      .toBeUndefined();
  });
});
