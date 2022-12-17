import { Component, Input } from '@angular/core';
import Resistance from 'src/app/model/resistance';

@Component({
  selector: 'resistance-item',
  templateUrl: './resistance-item.component.html',
  styleUrls: ['./resistance-item.component.css'],
})
export class ResistanceItemComponent {
  @Input() resistance!: Resistance;
  @Input() racial: boolean = false;
}
