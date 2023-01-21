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

  it('should compute modifier', () => {
    component.proficiency = 3;
    component.skill.rank = 0;
    fixture.detectChanges();
    expect(component.skillModifier)
      .withContext('Skill rank 0 should have resulted in skill modifier 0')
      .toBe(0);
    component.skill.rank = 1;
    fixture.detectChanges();
    expect(component.skillModifier)
      .withContext('Skill rank 1 should have resulted in skill modifier 2')
      .toBe(2);
    component.skill.rank = 2;
    fixture.detectChanges();
    expect(component.skillModifier)
      .withContext('Skill rank 2 should have resulted in skill modifier 3')
      .toBe(3);
    component.skill.rank = 3;
    fixture.detectChanges();
    expect(component.skillModifier)
      .withContext('Skill rank 3 should have resulted in skill modifier 5')
      .toBe(5);
    component.skill.rank = 4;
    fixture.detectChanges();
    expect(component.skillModifier)
      .withContext('Skill rank 4 should have resulted in skill modifier 6')
      .toBe(6);
    component.skill.rank = 5;
    fixture.detectChanges();
    expect(component.skillModifier)
      .withContext('Skill rank 5 should have resulted in skill modifier 8')
      .toBe(8);
  });
});
