import { Injectable } from '@angular/core';
import { Character, CharacterBuilder } from '../model/character';

/**
 * An injectable service that manages the character information.
 */
@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private placeholder: Character;
  constructor() {
    this.placeholder = new CharacterBuilder()
      .setBrawn(7)
      .setDexterity(8)
      .setVitality(9)
      .setIntelligence(10)
      .setCunning(11)
      .setResolve(12)
      .setPresence(13)
      .setManipulation(14)
      .setComposure(15)
      .addSelection(
        'Predator',
        1,
        'Favored Enemy',
        'Choose one creature type etc...'
      )
      .addSecondarySelection(
        'Discipline',
        1,
        'Unarmored defence',
        'Add com mod to av when not wearing armor.'
      )
      .addSelection(
        'Discipline',
        2,
        'Mastery',
        'You basically get Kung Fu points.'
      )
      .setRace('Tiefling', 'Amakhnupis')
      .setName('Giordi')
      .build();
  }
  currentCharacter(): Character {
    return this.placeholder;
  }
}
