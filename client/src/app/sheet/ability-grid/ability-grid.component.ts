import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ability } from 'src/app/model/ability';
import Character from 'src/app/model/character';
import CharacterAbilities, {
  AbilityImpl,
} from 'src/app/model/character-abilities';
import { AbilityService } from 'src/app/services/ability.service';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';
import { AbillityRollEvent } from '../ability-score/ability-score.component';

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
  performRoll(event: AbillityRollEvent) {
    const ability = (
      this.character.abilities as unknown as { [key: string]: Ability }
    )[event.abilityIdentifier];
    this.rollService.dispatch({
      type: 'ability-check',
      params: {
        characterName: this.character.name,
        advantage: event.advantage,
        ability,
        proficiency: 0,
      },
    });
  }

  onModified(identifier: string, value: number) {
    const oldAbilities: CharacterAbilities = { ...this.character.abilities };
    const modified = new AbilityImpl(identifier, value);
    (this.character.abilities as unknown as { [key: string]: Ability })[
      identifier
    ] = modified;
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
