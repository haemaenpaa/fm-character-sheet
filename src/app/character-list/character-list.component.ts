import { Component } from '@angular/core';
import Character from '../model/character';
import { CharacterBuilder } from '../model/character-builder';
import { CharacterService } from '../services/character.service';

@Component({
  selector: 'character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css'],
})
export class CharacterListComponent {
  constructor(private characterService: CharacterService) {}
  get characters(): Character[] {
    return this.characterService.allCharacters;
  }
  newCharacter() {
    const character = new CharacterBuilder().setName('New character').build();
    this.characterService.persistCharacter(character);
  }
}
