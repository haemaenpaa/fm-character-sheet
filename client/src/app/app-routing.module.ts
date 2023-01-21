import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharacterListComponent } from './character-list/character-list.component';
import { CharacterSheetComponent } from './sheet/character-sheet/character-sheet.component';
import { upperOutletRoutes } from './sheet/sheet.routing';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'character-list',
  },
  {
    path: 'character-list',
    component: CharacterListComponent,
    pathMatch: 'full',
  },
  {
    path: 'sheet/:id',
    component: CharacterSheetComponent,
    children: upperOutletRoutes,
  },
  {
    path: 'callback',
    loadChildren: () =>
      import('./features/callback/callback.module').then(
        (m) => m.CallbackModule
      ),
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
