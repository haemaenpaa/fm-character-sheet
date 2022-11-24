import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharacterSheetComponent } from './sheet/character-sheet/character-sheet.component';
import { upperOutletRoutes } from './sheet/sheet.routing';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/sheet',
    pathMatch: 'full',
  },
  {
    path: 'sheet',
    component: CharacterSheetComponent,
    children: upperOutletRoutes,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
