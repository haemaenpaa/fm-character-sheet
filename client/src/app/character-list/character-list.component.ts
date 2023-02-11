import { Component } from '@angular/core';
import { last } from 'rxjs';
import Character from '../model/character';
import { CharacterBuilder } from '../model/character-builder';
import { CharacterService } from '../services/character.service';

const FIRST_NAMES = [
  'Abrax',
  'Bertrude',
  'Calin',
  'Deem',
  'Eldia',
  'Fara',
  'Gort',
  'Hania',
  'Illie',
  'Jeo',
  'Karl',
  'Lomen',
  'Mugg',
  'Nobb',
  'Olivia',
  'Prim',
  'Qaa',
  'Rica',
  'Sanaa',
  'Tannim',
  'Ulfbert',
  'Vic',
  'Wrenna',
  'Xill',
  'Yvon',
  'Zhop',
];
const LAST_NAMES = [
  'Armiger',
  'Black',
  'Carmine',
  'Deerhart',
  'Ellesmere',
  'Foulger',
  'Giantsbane',
  'Hale',
  'Iaison',
  'Jetwick',
  'Kellner',
  'Loonsby',
  'Masterson',
  'Naermere',
  'Ostrakos',
  'Pheaton',
  'Quicktongue',
  'Richwall',
  'Stronghammer',
  'Trout',
  'Underhill',
  'Vendix',
  'Wolfspaw',
  'Xorondir',
  'Young',
  'Zorowich',
];

@Component({
  selector: 'character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css'],
})
export class CharacterListComponent {
  hilightId: number | null = null;
  characters: Character[] = [];
  addInProgress: boolean = false;
  constructor(private characterService: CharacterService) {
    this.characters = characterService.allCachedCharacters;
    characterService.getAllCharacters().then(
      (characters) => (this.characters = characters),
      (error) => console.error(error)
    );
  }

  newCharacter() {
    if (this.addInProgress) {
      return;
    }
    this.addInProgress = true;
    const firstname =
      FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastname = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const character = new CharacterBuilder()
      .setName(`${firstname} ${lastname}`)
      .build();
    this.characterService.persistCharacter(character);
    this.characterService
      .createCharacter(character)
      .then((c) => {
        this.hilightId = c.id!;
        this.characters = [...this.characters, c];
      })
      .finally(() => (this.addInProgress = false));
  }

  onImport(event: Event) {
    debugger;
    const files = (event.target as HTMLInputElement).files;
    if (!files) {
      return;
    }
    const promises: Promise<Character>[] = [];
    for (var i = 0; i < files.length; i++) {
      promises.push(this.characterService.importCharacterFromFile(files[i]));
    }
    Promise.all(promises).then(
      (added) => {
        this.characters = [...this.characters, ...added];
      },
      (error) => {
        console.error('Failed to import characters', error);
      }
    );
  }
}
