import { Component, Input, OnInit } from '@angular/core';
import { Ability } from 'src/app/model/ability';
import { Character } from 'src/app/model/character';
import { Roll, RollComponent } from 'src/app/model/diceroll';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';

/**
 * Component to display an ability grid.
 */
@Component({
  selector: 'ability-grid',
  templateUrl: './ability-grid.component.html',
  styleUrls: ['./ability-grid.component.css'],
})
export class AbilityGridComponent implements OnInit {
  @Input() character!: Character;
  constructor(private rollService: ActionDispatchService) {}

  ngOnInit(): void {}

  /**
   * Dispatches an ability check action according to the ability.
   * @param ability Ability the check will use.
   */
  performRoll(ability: Ability) {
    this.rollService.dispatch({
      type: 'ability-check',
      params: {
        characterName: this.character.name,
        advantage: 'none',
        ability,
        proficiency: 0,
      },
    });
  }
}
