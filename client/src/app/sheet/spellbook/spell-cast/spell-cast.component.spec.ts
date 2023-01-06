import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Character from 'src/app/model/character';
import { CharacterBuilder } from 'src/app/model/character-builder';
import { Spell } from 'src/app/model/character-spells';
import { randomId } from 'src/app/model/id-generator';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';
import { CharacterService } from 'src/app/services/character.service';
import DummyClass from 'src/app/utils/dummy-class';

import { SpellCastComponent } from './spell-cast.component';

function placeholder(): Spell {
  return {
    id: 0,
    tier: 1,
    school: '',
    name: '',
    saveAbility: null,
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
  characterId = 1;
}

class DummyCharacterService {
  resolve!: (value: Character) => void;
  getCharacterById(id: number): Promise<Character> {
    return new Promise((res, rej) => {
      this.resolve = res;
    });
  }
}

describe('SpellCastComponent', () => {
  let component: SpellCastComponent;
  let fixture: ComponentFixture<SpellCastComponent>;
  let characterService: DummyCharacterService;
  let actionDispatch: ActionDispatchService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpellCastComponent],
      providers: [
        { provide: MatDialogRef, useClass: DummyClass },
        { provide: MAT_DIALOG_DATA, useClass: DummyData },
        { provide: CharacterService, useClass: DummyCharacterService },
      ],
    }).compileComponents();

    characterService = TestBed.inject(CharacterService) as any;
    actionDispatch = TestBed.inject(ActionDispatchService);
    fixture = TestBed.createComponent(SpellCastComponent);

    component = fixture.componentInstance;
    component.spell = placeholder();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
