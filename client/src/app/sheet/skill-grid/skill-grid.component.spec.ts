import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { CharacterBuilder } from 'src/app/model/character-builder';
import { AbilityNamePipe } from '../pipe/ability-name.pipe';
import { ModifierPipe } from '../pipe/modifier.pipe';
import { SkillNamePipe } from '../skill/skill-name.pipe';
import { SkillComponent } from '../skill/skill.component';

import { SkillGridComponent } from './skill-grid.component';

describe('SkillGridComponent', () => {
  let component: SkillGridComponent;
  let fixture: ComponentFixture<SkillGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SkillGridComponent,
        SkillComponent,
        ModifierPipe,
        SkillNamePipe,
        AbilityNamePipe,
      ],
      providers: [{ provide: MatDialog, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillGridComponent);
    component = fixture.componentInstance;
    component.character = new CharacterBuilder().build();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
