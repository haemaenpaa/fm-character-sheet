import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharacterListComponent } from './character-list/character-list.component';
import { CharacterSheetComponent } from './sheet/character-sheet/character-sheet.component';
import { upperOutletRoutes } from './sheet/sheet.routing';

const routes: Routes = [
  {
    path: '',
    component: CharacterListComponent,
    pathMatch: 'full',
  },
  {
    path: 'sheet/:id',
    component: CharacterSheetComponent,
    children: upperOutletRoutes,
  },
];
/**
 * Routing module for the application.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
