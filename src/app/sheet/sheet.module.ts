import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbilityScoreComponent } from './ability-score/ability-score.component';
import { AbilityGridComponent } from './ability-grid/ability-grid.component';
import { CharacterSheetComponent } from './character-sheet/character-sheet.component';

@NgModule({
  declarations: [
    AbilityGridComponent,
    AbilityScoreComponent,
    CharacterSheetComponent,
  ],
  imports: [CommonModule],
  exports: [CharacterSheetComponent, AbilityGridComponent],
})
export class SheetModule {}
