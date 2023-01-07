import { Route } from '@angular/router';
import { AbilitiesListComponent } from './abilities-list/abilities-list.component';
import { AttackListComponent } from './attack-list/attack-list.component';
import { DefensesComponent } from './defenses/defenses.component';
import { RollLogComponent } from './roll-log/roll-log.component';
import { SpellbookComponent } from './spellbook/spellbook.component';

/**
 * Routes used by the character sheet's sub-routers.
 */
export const upperOutletRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'defenses',
    outlet: 'details-outlet',
  },
  { path: 'rolls', component: RollLogComponent, outlet: 'details-outlet' },
  { path: 'defenses', component: DefensesComponent, outlet: 'details-outlet' },

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
];
