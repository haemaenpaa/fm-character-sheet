import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Character from 'src/app/model/character';
import { CheckParams, SpellAttackParams } from 'src/app/model/game-action';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';
import { AbilitySelectComponent } from '../ability-select/ability-select.component';

@Component({
  selector: 'spellbook',
  templateUrl: './spellbook.component.html',
  styleUrls: [
    './spellbook.component.css',
    '../common.css',
    '../accessibility-common.css',
  ],
})
export class SpellbookComponent {
  @Input() character!: Character;
  @Input() colorized: boolean = false;
  @Output() characterChanged: EventEmitter<void> = new EventEmitter();
  constructor(
    private dialog: MatDialog,
    private actionService: ActionDispatchService
  ) {}

  selectCastingAbility() {
    const dialogRef = this.dialog.open(AbilitySelectComponent, {
      data: {
        abilities: this.character.getAbilityModifiers(),
        baseModifier: this.character.proficiency,
        colorized: this.colorized,
      },
    });
    const selectComponent = dialogRef.componentInstance;
    selectComponent.physical = false;

    dialogRef.afterClosed().subscribe((abl) => {
      if (abl) {
        this.character.spells.spellcastingAbility = abl;
      }
      this.characterChanged.emit();
    });
  }

  callSpellAttack() {
    if (!this.character || !this.character.spells.spellcastingAbility) {
      return;
    }
    const params: SpellAttackParams = {
      characterName: this.character.name,
      advantage: 'none',
      abilityIdentifier: this.character.spells.spellcastingAbility,
      spellAttackBonus: this.character.spellAttack,
    };
    this.actionService.dispatch({
      type: 'spell-attack',
      params,
    });
  }
}
