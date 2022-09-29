import { Component, Input, OnInit } from '@angular/core';
import { Ability } from 'src/app/model/ability';

@Component({
  selector: 'ability-score',
  templateUrl: './ability-score.component.html',
  styleUrls: ['./ability-score.component.css'],
})
export class AbilityScoreComponent implements OnInit {
  @Input() ability!: Ability;
  constructor() {}

  ngOnInit(): void {}
}
