import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { CharacterBuilder } from 'src/app/model/character-builder';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';
import { SpellService } from 'src/app/services/spell.service';
import DummyClass from 'src/app/utils/dummy-class';
import { EditableTextComponent } from '../editable-text/editable-text.component';
import { ModifierPipe } from '../pipe/modifier.pipe';
import { SpellListComponent } from './spell-list/spell-list.component';

import { SpellbookComponent } from './spellbook.component';
const dummySpellService = {};
describe('SpellbookComponent', () => {
  let component: SpellbookComponent;
  let fixture: ComponentFixture<SpellbookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SpellbookComponent,
        ModifierPipe,
        SpellListComponent,
        EditableTextComponent,
      ],
      providers: [
        { provide: MatDialog, useClass: DummyClass },
        { provide: ActionDispatchService, useValue: {} },
        { provide: SpellService, useValue: dummySpellService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SpellbookComponent);
    const character = new CharacterBuilder().build();
    component = fixture.componentInstance;
    component.character = character;
    fixture.detectChanges();
  });

  it('should create', () => {
    const character = new CharacterBuilder().build();
    component.character = character;
    expect(component)
      .withContext('Component should create without error.')
      .toBeTruthy(character);
  });
});
