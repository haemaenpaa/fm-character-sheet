import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbilityScoreComponent } from './ability-score/ability-score.component';
import { AbilityGridComponent } from './ability-grid/ability-grid.component';
import { CharacterSheetComponent } from './character-sheet/character-sheet.component';
import { AbilityNamePipe } from './pipe/ability-name.pipe';
import { ModifierPipe } from './pipe/modifier.pipe';
import { RollPipe } from './pipe/roll.pipe';
import { RollLogComponent } from './roll-log/roll-log.component';
import { SimpleCheckComponent } from './roll-log/simple-check/simple-check.component';
import { UnknownRollComponent } from './roll-log/unknown-roll/unknown-roll.component';
import { RouterModule } from '@angular/router';
import { SkillComponent } from './skill/skill.component';
import { SkillNamePipe } from './skill/skill-name.pipe';
import { SkillGridComponent } from './skill-grid/skill-grid.component';
import { SkillCheckComponent } from './roll-log/skill-check/skill-check.component';
import { AbilitySelectComponent } from './ability-select/ability-select.component';
import { DefensesComponent } from './defenses/defenses.component';
import { SavingThrowComponent } from './saving-throw/saving-throw.component';
import { SavingThrowLogComponent } from './roll-log/saving-throw-log/saving-throw-log.component';
import { HitPointsComponent } from './hit-points/hit-points.component';
import { A11yModule } from '@angular/cdk/a11y';
import { ResistancesComponent } from './resistances/resistances.component';
import { ResistanceItemComponent } from './resistances/resistance-item/resistance-item.component';
import { EditableTextComponent } from './editable-text/editable-text.component';
import { AbilitiesListComponent } from './abilities-list/abilities-list.component';
import { RacialAbilitiesComponent } from './racial-abilities/racial-abilities.component';
import { AoSelectionListComponent } from './ao-selection-list/ao-selection-list.component';
import { AoSelectionItemComponent } from './ao-selection-item/ao-selection-item.component';
import { SortSelectionsPipe } from './ao-selection-list/sort-selections.pipe';
import { RaceEditComponent } from './race-edit/race-edit.component';
import { SpellbookComponent } from './spellbook/spellbook.component';
import { SpellAttackRollComponent } from './roll-log/spell-attack-roll/spell-attack-roll.component';
import { SpellListComponent } from './spellbook/spell-list/spell-list.component';
import { SlotEditComponent } from './spellbook/slot-edit/slot-edit.component';
import { SpellEditComponent } from './spellbook/spell-edit/spell-edit.component';
import { DamageDiceComponent } from './damage-dice/damage-dice.component';
import { DieItemComponent } from './damage-dice/die-item/die-item.component';
import { SpellDetailsComponent } from './spellbook/spell-details/spell-details.component';
import { SpellCastComponent } from './spellbook/spell-cast/spell-cast.component';
import { SpellSaveLogComponent } from './roll-log/spell-save-log/spell-save-log.component';
import { SoulCheckLogComponent } from './roll-log/soul-check-log/soul-check-log.component';
import { SpellDamageRollComponent } from './roll-log/spell-damage-roll/spell-damage-roll.component';
import { AttackListComponent } from './attack-list/attack-list.component';
import { AttackItemComponent } from './attack-list/attack-item/attack-item.component';
import { AttackEditComponent } from './attack-edit/attack-edit.component';
import { AttackComponent } from './roll-log/attack/attack.component';
import { AttackDamageComponent } from './roll-log/attack-damage/attack-damage.component';
import { AttackEffectComponent } from './roll-log/attack-effect/attack-effect.component';

/**
 * The character sheet module. Provides the character sheet component.
 */
@NgModule({
  declarations: [
    AbilityGridComponent,
    AbilityScoreComponent,
    CharacterSheetComponent,
    AbilityNamePipe,
    ModifierPipe,
    RollPipe,
    RollLogComponent,
    SimpleCheckComponent,
    UnknownRollComponent,
    SkillComponent,
    SkillNamePipe,
    SkillGridComponent,
    SkillCheckComponent,
    AbilitySelectComponent,
    DefensesComponent,
    SavingThrowComponent,
    SavingThrowLogComponent,
    HitPointsComponent,
    ResistancesComponent,
    ResistanceItemComponent,
    EditableTextComponent,
    AbilitiesListComponent,
    RacialAbilitiesComponent,
    AoSelectionListComponent,
    AoSelectionItemComponent,
    SortSelectionsPipe,
    RaceEditComponent,
    SpellbookComponent,
    SpellAttackRollComponent,
    SpellListComponent,
    SlotEditComponent,
    SpellEditComponent,
    DamageDiceComponent,
    DieItemComponent,
    SpellDetailsComponent,
    SpellCastComponent,
    SpellSaveLogComponent,
    SoulCheckLogComponent,
    SpellDamageRollComponent,
    AttackListComponent,
    AttackItemComponent,
    AttackEditComponent,
    AttackComponent,
    AttackDamageComponent,
    AttackEffectComponent,
  ],
  imports: [CommonModule, RouterModule.forChild([]), A11yModule],
  exports: [CharacterSheetComponent],
})
export class SheetModule {}
