import { Route } from '@angular/router';
import { RollLogComponent } from './roll-log/roll-log.component';

export const upperOutletRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: RollLogComponent,
    outlet: 'upper-outlet',
  },
  { path: 'rolls', component: RollLogComponent, outlet: 'upper-outlet' },
];
