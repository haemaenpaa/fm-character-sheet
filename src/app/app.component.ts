import { Component } from '@angular/core';
import { Character, CharacterBuilder } from './model/character';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'fm-character-sheet';
  character: Character;

  constructor() {
    this.character = new CharacterBuilder()
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
      .build();
  }
}
