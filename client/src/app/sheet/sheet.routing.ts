import { Route } from '@angular/router';
import { AbilitiesListComponent } from './abilities-list/abilities-list.component';
import { AttackListComponent } from './attack-list/attack-list.component';
import { BiographyComponent } from './biography/biography.component';
import { DefensesComponent } from './defenses/defenses.component';
import { DescriptionComponent } from './description/description.component';
import { InventoryViewComponent } from './inventory-view/inventory-view.component';
import { RollLogComponent } from './roll-log/roll-log.component';
import { SpellbookComponent } from './spellbook/spellbook.component';

/**
 * Routes used by the character sheet's sub-routers.
 */
export const upperOutletRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'description',
    outlet: 'details-outlet',
  },
  { path: 'rolls', component: RollLogComponent, outlet: 'details-outlet' },
  { path: 'defenses', component: DefensesComponent, outlet: 'details-outlet' },
  {
    path: 'description',
    component: DescriptionComponent,
    outlet: 'details-outlet',
  },

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'attacks',
    outlet: 'info-outlet',
  },
  {
    path: 'selections',
    pathMatch: 'full',
    component: AbilitiesListComponent,
    outlet: 'info-outlet',
  },
  {
    path: 'spellbook',
    pathMatch: 'full',
    component: SpellbookComponent,
    outlet: 'info-outlet',
  },
  {
    path: 'attacks',
    pathMatch: 'full',
    component: AttackListComponent,
    outlet: 'info-outlet',
  },
  {
    path: 'inventory',
    pathMatch: 'full',
    component: InventoryViewComponent,
    outlet: 'info-outlet',
  },
  {
    path: 'biography',
    pathMatch: 'full',
    component: BiographyComponent,
    outlet: 'info-outlet',
  },
];
