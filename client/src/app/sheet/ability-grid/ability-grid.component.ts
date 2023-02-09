import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ability } from 'src/app/model/ability';
import Character from 'src/app/model/character';
import CharacterAbilities, {
  AbilityImpl,
} from 'src/app/model/character-abilities';
import { AbilityService } from 'src/app/services/ability.service';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';

/**
 * Component to display an ability grid.
 */
@Component({
  selector: 'ability-grid',
  templateUrl: './ability-grid.component.html',
  styleUrls: [
    './ability-grid.component.css',
    '../common.css',
    '../accessibility-common.css',
  ],
})
export class AbilityGridComponent implements OnInit {
  @Input() character!: Character;
  @Input() colorized: boolean = false;
  @Output() characterChanged: EventEmitter<void> = new EventEmitter();
  constructor(
    private rollService: ActionDispatchService,
    private abilityService: AbilityService
  ) {}

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

  onModified(
    identifier:
      | 'br'
      | 'dex'
      | 'vit'
      | 'int'
      | 'cun'
      | 'res'
      | 'pre'
      | 'man'
      | 'com',
    value: number
  ) {
    const oldAbilities: CharacterAbilities = { ...this.character.abilities };
    const modified = new AbilityImpl(identifier, value);
    this.character.abilities[identifier] = modified;
    this.abilityService
      .updateCharacterAbility(modified, this.character.id!)
      .then(
        (_) => this.characterChanged.emit(),
        (error) => {
          console.error('Failed to update ability', error);
          this.character.abilities = oldAbilities;
        }
      );
  }
}
