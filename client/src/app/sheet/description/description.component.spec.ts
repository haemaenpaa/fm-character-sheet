import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterBuilder } from 'src/app/model/character-builder';
import { EditableTextComponent } from '../editable-text/editable-text.component';

import { DescriptionComponent } from './description.component';

describe('DescriptionComponent', () => {
  let component: DescriptionComponent;
  let fixture: ComponentFixture<DescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DescriptionComponent, EditableTextComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DescriptionComponent);
    component = fixture.componentInstance;
    component.character = new CharacterBuilder().build();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should edit appearance', () => {
    const expected = 'Edited';
    component.onSectionChange('appearance', expected);
    expect(component.character.biography.appearance).toBe(expected);
  });
  it('should edit concept', () => {
    const expected = 'Edited';
    component.onSectionChange('concept', expected);
    expect(component.character.biography.concept).toBe(expected);
  });
  it('should edit soul mark', () => {
    const expected = 'Edited';
    component.onSectionChange('soulMarkDescription', expected);
    expect(component.character.biography.soulMarkDescription).toBe(expected);
  });
  it('should edit height', () => {
    const expected = 100;
    component.onNumberChange('height', expected);
    expect(component.character.biography.height).toBe(expected);
  });

  it('should edit weight', () => {
    const expected = 100;
    component.onNumberChange('weight', expected);
    expect(component.character.biography.weight).toBe(expected);
  });
});
