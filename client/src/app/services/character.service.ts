import { Injectable } from '@angular/core';
import Character from '../model/character';
import { CharacterBuilder } from '../model/character-builder';
import { randomId } from '../model/id-generator';

const LS_CHAR_EXPRESSION = /^fm-char-\d+$/;
const LS_CHAR_PREFIX = 'fm-char-';

function characterCompare(a: Character, b: Character): number {
  if (a.name !== b.name) {
    return a.name < b.name ? -1 : 1;
  }
  if (a.id === b.id) {
    return 0;
  }
  if (a.id === null || b.id === null) {
    return a.id === null ? -1 : 1;
  }
  return a.id < b.id ? -1 : 1;
}
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
    this.sortCharacters;
  }

  private sortCharacters() {
    this.characters = this.characters.sort(characterCompare);
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
    parsed.selections = parsed.selections.map((s: any) =>
      'id' in s ? s : { ...s, id: randomId() }
    );

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
    const nullId = !character.id;
    if (nullId) {
      character.id = randomId();
    }
    return new Promise((resolve) => {
      localStorage.setItem(
        LS_CHAR_PREFIX + character.id,
        JSON.stringify(character)
      );
      const index = this.characters.findIndex((c) => c.id === character.id);
      if (index < 0) {
        this.characters.push(character);
        this.sortCharacters();
      } else {
        this.characters[index] = character;
        this.sortCharacters();
      }
      resolve(character);
    });
  }
}
