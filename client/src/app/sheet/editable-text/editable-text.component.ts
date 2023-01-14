import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'editable-text',
  templateUrl: './editable-text.component.html',
  styleUrls: ['./editable-text.component.css', '../common.css'],
})
export class EditableTextComponent {
  @Input() value: string | number | null | undefined = null;
  @Input() className: string | undefined = undefined;
  @Input() enabled: boolean = true;
  @Input() rows: number = 1;
  @Input() cols: number = 20;
  @Input() placeholder: string = 'click to edit';
  @Input() max?: number;
  @Input() min?: number;
  @Input() floatingPoint: boolean = false;
  editing: boolean = false;
  @Output() valueChanged: EventEmitter<string> = new EventEmitter();
  @Output() numberChanged: EventEmitter<number> = new EventEmitter();

  onValueChanged(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.valueChanged.emit(val);
    const num = this.floatingPoint
      ? Number.parseFloat(val)
      : Number.parseInt(val);
    if (!isNaN(num)) {
      var clamped = num;
      if (this.max !== undefined) {
        clamped = Math.min(clamped, this.max);
      }
      if (this.min !== undefined) {
        clamped = Math.max(this.min, clamped);
      }
      this.numberChanged.emit(clamped);
    }
  }
  get isEmpty(): boolean {
    if (this.value == null) {
      return true;
    }
    return `${this.value}`.length == 0;
  }
}
