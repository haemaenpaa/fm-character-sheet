import { Component, Input, OnInit } from '@angular/core';
import { Character } from 'src/app/model/character';

@Component({
  selector: 'ability-grid',
  templateUrl: './ability-grid.component.html',
  styleUrls: ['./ability-grid.component.css'],
})
export class AbilityGridComponent implements OnInit {
  @Input() character!: Character;
  constructor() {}

  ngOnInit(): void {}
}
