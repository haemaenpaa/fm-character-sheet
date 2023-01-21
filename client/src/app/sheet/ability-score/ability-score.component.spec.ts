import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditableTextComponent } from '../editable-text/editable-text.component';
import { AbilityNamePipe } from '../pipe/ability-name.pipe';
import { ModifierPipe } from '../pipe/modifier.pipe';

import { AbilityScoreComponent } from './ability-score.component';

describe('AbilityScoreComponent', () => {
  let component: AbilityScoreComponent;
  let fixture: ComponentFixture<AbilityScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AbilityScoreComponent,
        EditableTextComponent,
        AbilityNamePipe,
        ModifierPipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AbilityScoreComponent);
    component = fixture.componentInstance;
    component.ability = {
      identifier: 'br',
      score: 10,
      modifier: 0,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
