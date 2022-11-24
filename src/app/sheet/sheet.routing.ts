import { Route } from '@angular/router';
import { RollLogComponent } from './roll-log/roll-log.component';

/**
 * Routes used by the character sheet's sub-routers.
 */
export const upperOutletRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: RollLogComponent,
    outlet: 'upper-outlet',
  },
  { path: 'rolls', component: RollLogComponent, outlet: 'upper-outlet' },
];
