import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbilityScoreComponent } from './ability-score/ability-score.component';
import { AbilityGridComponent } from './ability-grid/ability-grid.component';
import { CharacterSheetComponent } from './character-sheet/character-sheet.component';
import { AbilityNamePipe } from './pipe/ability-name.pipe';
import { ModifierPipe } from './pipe/modifier.pipe';
import { RollPipe } from './pipe/roll.pipe';

@NgModule({
  declarations: [
    AbilityGridComponent,
    AbilityScoreComponent,
    CharacterSheetComponent,
    AbilityNamePipe,
    ModifierPipe,
    RollPipe,
  ],
  imports: [CommonModule],
  exports: [CharacterSheetComponent, AbilityGridComponent],
})
export class SheetModule {}
