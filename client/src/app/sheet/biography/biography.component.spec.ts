import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterBiography } from 'src/app/model/character-bio';
import { CharacterBuilder } from 'src/app/model/character-builder';
import { BiographyService } from 'src/app/services/biography.service';
import { EditableTextComponent } from '../editable-text/editable-text.component';

import { BiographyComponent } from './biography.component';

const dummyService = {
  updateCharacerBio: (attack: CharacterBiography) =>
    new Promise((res) => res(attack)),
};

describe('BiographyComponent', () => {
  let component: BiographyComponent;
  let fixture: ComponentFixture<BiographyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BiographyComponent, EditableTextComponent],
      providers: [{ provide: BiographyService, useValue: dummyService }],
    }).compileComponents();

    fixture = TestBed.createComponent(BiographyComponent);
    component = fixture.componentInstance;
    component.character = new CharacterBuilder().build();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should edit biography', () => {
    const expected = 'Expected value';
    component.onSectionChange('characterBiography', expected);
    expect(component.character.biography.characterBiography).toBe(expected);
  });

  it('should edit connections', () => {
    const expected = 'Expected value';
    component.onSectionChange('characterConnections', expected);
    expect(component.character.biography.characterConnections).toBe(expected);
  });
});
