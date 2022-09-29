import { Component, Input, OnInit } from '@angular/core';
import { Character } from 'src/app/model/character';

@Component({
  selector: 'character-sheet',
  templateUrl: './character-sheet.component.html',
  styleUrls: ['./character-sheet.component.css'],
})
export class CharacterSheetComponent implements OnInit {
  @Input() character!: Character;
  constructor() {}

  ngOnInit(): void {}
}
