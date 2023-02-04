import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterBuilder } from 'src/app/model/character-builder';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';
import { AbilityScoreComponent } from '../ability-score/ability-score.component';
import { EditableTextComponent } from '../editable-text/editable-text.component';
import { AbilityNamePipe } from '../pipe/ability-name.pipe';
import { ModifierPipe } from '../pipe/modifier.pipe';

import { AbilityGridComponent } from './ability-grid.component';

describe('AbilityGridComponent', () => {
  let component: AbilityGridComponent;
  let fixture: ComponentFixture<AbilityGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AbilityGridComponent,
        AbilityScoreComponent,
        AbilityNamePipe,
        EditableTextComponent,
        ModifierPipe,
      ],
      providers: [{ provide: ActionDispatchService, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(AbilityGridComponent);
    component = fixture.componentInstance;
    component.character = new CharacterBuilder().build();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
