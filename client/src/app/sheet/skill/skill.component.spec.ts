import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ModifierPipe } from '../pipe/modifier.pipe';
import { SkillNamePipe } from './skill-name.pipe';

import { SkillComponent } from './skill.component';

describe('SkillComponent', () => {
  let component: SkillComponent;
  let fixture: ComponentFixture<SkillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillComponent, ModifierPipe, SkillNamePipe],
      providers: [{ provide: MatDialog, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillComponent);
    component = fixture.componentInstance;
    component.skill = {
      identifier: 'test',
      name: 'test skill',
      rank: 0,
      defaultAbilities: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
