import { Component, Input } from '@angular/core';
import Character from 'src/app/model/character';
import { SimpleRoll } from 'src/app/model/diceroll';
import { GameAction } from 'src/app/model/game-action';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';
import { AdvantageResolverService } from 'src/app/services/advantage-resolver.service';

@Component({
  selector: 'initiative-button',
  templateUrl: './initiative-button.component.html',
  styleUrls: ['./initiative-button.component.css'],
})
export class InitiativeButtonComponent {
  @Input() character!: Character;

  constructor(
    private actionService: ActionDispatchService,
    private advantageResolver: AdvantageResolverService
  ) {}

  callRoll(event: Event) {
    if (!this.character.id && this.character.id != 0) {
      return;
    }
    this.actionService.dispatch({
      type: 'initiative',
      params: {
        characterId: this.character.id,
        advantage: this.advantageResolver.resolveForEvent(event),
      },
    });
  }
}
