import { Component, Input } from '@angular/core';
import Resistance from 'src/app/model/resistance';

@Component({
  selector: 'resistances',
  templateUrl: './resistances.component.html',
  styleUrls: ['./resistances.component.css'],
})
export class ResistancesComponent {
  @Input() racialResistances: Resistance[] = [];
  @Input() resistances: Resistance[] = [];
}
