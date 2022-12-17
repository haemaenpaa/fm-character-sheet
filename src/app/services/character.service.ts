import { Injectable } from '@angular/core';
import Character from '../model/character';
import { CharacterBuilder } from '../model/character-builder';

/**
 * An injectable service that manages the character information.
 */
@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  //Placeholder character for now.
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
      .setSubterfuge(2)
      .setDeception(3)
      .setMedicine(1)
      .addCustomSkill('Academics (herpetology)', 3, ['int'])
      .addCustomSkill('Craft (basket weaving)', 2, ['dex', 'cun'])
      .addCustomSkill('Game (poker)', 1, ['com', 'cun'])
      .addCustomSkill('Instrument (violoncello)', 4, ['com', 'cun'])
      .addSavingThrow('br')
      .addSavingThrow('pre/man')
      .setMaxHP(30)
      .setRace('Tiefling', 'Amakhnupis')
      .addRaceDmgResistance('Necrotic')
      .addRaceStatusResistance('Fear')
      .addDmgResistance('Thunder', 'immunity')
      .addStatusResistance('Deafened', 'immunity')
      .setName('Giordi')
      .build();
  }

  /**
   * Gets the "current" character.
   * @returns the current character
   */
  currentCharacter(): Character {
    return this.placeholder;
  }
}
