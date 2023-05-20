import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Hoverable } from 'src/app/common/hoverable';
import { AbilityNumberStruct } from 'src/app/model/character';
import CharacterAttack, { copyAttack } from 'src/app/model/character-attack';
import { Advantage, AttackParams } from 'src/app/model/game-action';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';
import { AttackEditComponent } from '../../attack-edit/attack-edit.component';
import { AdvantageResolverService } from 'src/app/services/advantage-resolver.service';

@Component({
  selector: 'attack-item',
  templateUrl: './attack-item.component.html',
  styleUrls: ['./attack-item.component.css', '../../common.css'],
})
export class AttackItemComponent extends Hoverable {
  @Input() attack!: CharacterAttack;
  @Input() abilityModifiers!: AbilityNumberStruct;
  @Input() proficiency: number = 0;
  @Input() characterId: number = 0;
  @Input() colorized: boolean = false;
  @Output() attackChanged: EventEmitter<CharacterAttack> = new EventEmitter();
  @Output() copied: EventEmitter<CharacterAttack> = new EventEmitter();
  @Output() deleted: EventEmitter<CharacterAttack> = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private actionService: ActionDispatchService,
    private advantageResolver: AdvantageResolverService
  ) {
    super();
  }

  get totalBonus(): number {
    var ret = this.attack.attackBonus;
    if (this.attack.proficient) {
      ret += this.proficiency;
    }
    ret += this.abilityBonus;
    return ret;
  }

  get abilityBonus(): number {
    return this.attack.abilities.reduce(
      (bonus: number, abl: string) =>
        bonus + (this.abilityModifiers as any)[abl],
      0
    );
  }
  get abilityDamageBonus(): number {
    if (this.attack.offhand) {
      return this.attack.abilities.reduce(
        (bonus: number, abl: string) =>
          bonus + Math.min(0, (this.abilityModifiers as any)[abl]),
        0
      );
    }
    return this.attack.abilities.reduce(
      (bonus: number, abl: string) =>
        bonus + (this.abilityModifiers as any)[abl],
      0
    );
  }

  edit() {
    console.log('Opening edit dialog');
    const editDialog = this.dialog.open(AttackEditComponent, {
      data: {
        attack: copyAttack(this.attack),
        abilities: this.abilityModifiers,
        proficiency: this.proficiency,
      },
    });
    editDialog.componentInstance.colorized = this.colorized;
    editDialog.afterClosed().subscribe((atk) => {
      if (atk) {
        this.attackChanged.emit(atk);
      }
    });
  }
  delete() {
    this.deleted.emit(this.attack);
  }
  copy() {
    this.copied.emit(this.attack);
  }

  roll(event: MouseEvent) {
    const params: AttackParams = {
      characterId: this.characterId,
      attackId: this.attack.id,
      advantage: this.advantageResolver.resolveForEvent(event),
    };
    this.actionService.dispatch({
      type: 'attack',
      params: params,
    });
  }
}
