import { Injectable } from '@angular/core';
import Character from '../model/character';
import { CharacterBuilder } from '../model/character-builder';

const MAX_ID = 2147483647; //Max value of a 32 bit signed integer
const LS_CHAR_EXPRESSION = /^fm-char-\d+$/;
const LS_CHAR_PREFIX = 'fm-char-';
/**
 * An injectable service that manages the character information.
 */
@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private characters: Character[];
  constructor() {
    this.characters = [];
    for (var i = 0; i < localStorage.length; i++) {
      const key: string = localStorage.key(i)!;
      const item = localStorage.getItem(key);
      if (key?.match(LS_CHAR_EXPRESSION)) {
        this.characters.push(this.loadCharacterFromLocalStorage(key));
      }
    }
  }

  private loadCharacterFromLocalStorage(key: string): Character {
    const item = localStorage.getItem(key);
    const template = new CharacterBuilder().build();
    const parsed = JSON.parse(item!);
    for (const abl in parsed.abilities) {
      (template.abilities as any)[abl].score = (parsed.abilities as any)[
        abl
      ].score;
    }
    parsed.abilities = template.abilities;

    return Object.assign(template, parsed);
  }

  get allCharacters(): Character[] {
    return this.characters;
  }

  /**
   * Gets a character by the given identifier
   * @param id Character ID
   * @returns A character by the given ID.
   */
  getCharacterById(id: number): Promise<Character> {
    return new Promise((resolve, reject) => {
      const character = this.characters.find((c) => c.id === id);
      if (character) {
        resolve(character);
      } else {
        reject(`No character by id ${id}`);
      }
    });
  }

  persistCharacter(character: Character): Promise<Character> {
    if (!character.id) {
      character.id = Math.floor(Math.random() * MAX_ID);
    }
    return new Promise((resolve) => {
      localStorage.setItem(
        LS_CHAR_PREFIX + character.id,
        JSON.stringify(character)
      );
      const index = this.characters.findIndex((c) => c.id === character.id);
      if (index < 0) {
        this.characters.push(character);
      } else {
        this.characters[index] = character;
      }
      resolve(character);
    });
  }
}
