import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Roll } from 'src/app/model/diceroll';

import { SkillCheckComponent } from './skill-check.component';

describe('SkillCheckComponent', () => {
  let component: SkillCheckComponent;
  let fixture: ComponentFixture<SkillCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillCheckComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillCheckComponent);
    component = fixture.componentInstance;
    component.roll = new Roll();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
