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
  ],
  imports: [CommonModule, RouterModule.forChild([])],
  exports: [CharacterSheetComponent],
})
export class SheetModule {}
