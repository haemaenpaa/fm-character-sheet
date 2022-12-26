import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'saving-throw',
  templateUrl: './saving-throw.component.html',
  styleUrls: ['./saving-throw.component.css'],
})
export class SavingThrowComponent {
  @Input() hasSave: boolean = false;
  @Input() ability: string[] = ['br'];
  @Output() toggle: EventEmitter<boolean> = new EventEmitter();
  @Output() roll: EventEmitter<string[]> = new EventEmitter();
}
