import { Component } from '@angular/core';
import { Character, CharacterBuilder } from './model/character';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'fm-character-sheet';

  constructor() {}
}
