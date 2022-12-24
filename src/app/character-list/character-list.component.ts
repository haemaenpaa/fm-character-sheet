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
  constructor(private characterService: CharacterService) {}
  get characters(): Character[] {
    return this.characterService.allCharacters;
  }
  newCharacter() {
    const firstname =
      FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastname = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const character = new CharacterBuilder()
      .setName(`${firstname} ${lastname}`)
      .build();
    this.characterService
      .persistCharacter(character)
      .then((c) => (this.hilightId = c.id));
  }
}
