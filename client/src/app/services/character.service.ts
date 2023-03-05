import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CharacterDto } from 'fm-transfer-model/src/model/character';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  convertCharacterDto,
  convertCharacterModel,
} from '../mapper/character-mapper';
import Character from '../model/character';
import { CharacterBuilder } from '../model/character-builder';
import { randomId } from '../model/id-generator';

const LS_CHAR_EXPRESSION = /^fm-char-\d+$/;
const LS_CHAR_PREFIX = 'fm-char-';

function characterCompare(a: Character, b: Character): number {
  if (a.name !== b.name) {
    return a.name < b.name ? -1 : 1;
  }
  if (a.totalLevel !== b.totalLevel) {
    return a.totalLevel < b.totalLevel ? 1 : -1;
  }
  if (a.id === undefined || b.id === undefined) {
    if (a.id === b.id) {
      return 0;
    }
    return a.id === undefined ? -1 : 1;
  }
  return a.id! < b.id! ? -1 : 1;
}
/**
 * An injectable service that manages the character information.
 */
@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private characters: Character[];
  constructor(private http: HttpClient) {
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
    const item = localStorage.getItem(key)!;
    return this.parseJSONString(item);
  }

  private parseJSONString(item: string): Character {
    const template = new CharacterBuilder().build();
    const parsed = JSON.parse(item);
    if (
      typeof parsed !== 'object' ||
      !parsed.name ||
      !parsed.race ||
      !parsed.abilities ||
      !parsed.defaultSkills
    ) {
      throw new Error('JSON does not appear to be a character json.');
    }
    for (const abl in parsed.abilities) {
      (template.abilities as any)[abl].score = (parsed.abilities as any)[
        abl
      ].score;
    }
    parsed.abilities = template.abilities;
    parsed.selections = parsed.selections.map((s: any) =>
      'id' in s ? s : { ...s, id: randomId() }
    );
    if (parsed.spells) {
      if (!parsed.spells.specialSlots) {
        parsed.spells.specialSlots = {};
      }
      if (!parsed.spells.specialSlotsAvailable) {
        parsed.spells.specialSlotsAvailable = {};
      }
    }
    return Object.assign(template, parsed);
  }

  getAllCharacters(): Promise<Character[]> {
    return new Promise<Character[]>((res, rej) => {
      this.http
        .get<CharacterDto[]>(environment.api.serverUrl + '/api/characters')
        .pipe(
          retry(3),
          catchError((error) => {
            rej(error);
            return throwError(
              () => new Error('Failed to fetch character list.')
            );
          })
        )
        .subscribe((characterDtos) =>
          res(characterDtos.map(convertCharacterDto))
        );
    });
  }

  get allCachedCharacters(): Character[] {
    return this.characters;
  }

  /**
   * Gets a character from local cache, falls back to API if not present.
   * @param id Characted ID
   * @returns
   */
  getCachedCharacterById(id: number): Promise<Character> {
    const local = this.characters.find((c) => c.id === id);
    if (local) {
      return new Promise((res) => res(local));
    }
    return this.getCharacterById(id);
  }
  /**
   * Gets a character by the given identifier
   * @param id Character ID
   * @returns A character by the given ID.
   */
  getCharacterById(id: number): Promise<Character> {
    return new Promise((resolve, reject) => {
      const cachedCharacter = this.characters.find((c) => c.id === id);
      this.http
        .get<CharacterDto>(`${environment.api.serverUrl}/api/character/${id}`)
        .pipe(
          retry(3),
          catchError((error) => {
            if (cachedCharacter) {
              resolve(cachedCharacter);
              console.error(
                'Failed to get character from API, returning cached.',
                error
              );
            } else {
              reject(error);
            }
            return throwError(
              () =>
                new Error('Failed to get character from API, returning cached.')
            );
          })
        )
        .subscribe((characterDto) =>
          resolve(convertCharacterDto(characterDto))
        );
    });
  }

  /**
   * Creates a new character in the backend.
   * @param character
   * @returns
   */
  createCharacter(character: Character): Promise<Character> {
    const ret: Promise<Character> = new Promise((res, rej) => {
      this.http
        .post<CharacterDto>(
          environment.api.serverUrl + '/api/character/',
          convertCharacterModel(character)
        )
        .subscribe((resp) => {
          console.log('Character created', resp);
          const created = convertCharacterDto(resp);
          this.persistCharacter(created);
          res(created);
        });
    });
    return ret;
  }
  updateCharacter(character: Character): Promise<Character> {
    return new Promise((res, rej) => {
      this.http
        .put<CharacterDto>(
          `${environment.api.serverUrl}/api/character/${character.id}`,
          convertCharacterModel(character)
        )
        .subscribe((resp) => {
          console.log('Character updated', resp);
          const updated = convertCharacterDto(resp);
          this.persistCharacter(updated);
          res(updated);
        });
    });
  }
  /**
   * Saves the character.
   * @param character
   * @returns
   */
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
      this.updateCachedCharacter(character);
      resolve(character);
    });
  }

  importCharacterFromFile(file: File): Promise<Character> {
    var resolve: (val: Character) => any, reject: (err: any) => any;
    const ret = new Promise<Character>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    const reader = new FileReader();
    reader.onload = (e) => {
      const json = e.target?.result?.toString();
      if (json) {
        try {
          const character = this.parseJSONString(json);
          character.id = undefined;
          this.persistCharacter(character);
          this.createCharacter(character).then(resolve, reject);
        } catch (e) {
          alert(`File ${file.name} does not look like a character file.`);
        }
      }
    };
    reader.readAsText(file);
    return ret;
  }

  delete(id: number): Promise<void> {
    return new Promise((resolve) => {
      localStorage.removeItem(LS_CHAR_PREFIX + id);
      this.characters = this.characters.filter((c) => c.id !== id);
      this.http
        .delete(`${environment.api.serverUrl}/api/character/${id}`)
        .subscribe((resp) => {
          console.log('Character deleted', resp);
          resolve;
        });
      resolve();
    });
  }

  private updateCachedCharacter(newer: Character) {
    const localIdx = this.characters.findIndex((c) => c.id === newer.id);
    if (localIdx < 0) {
      this.characters.push(newer);
    } else {
      this.characters[localIdx] = newer;
    }
  }
}
