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
  editing: boolean = false;
  @Output() valueChanged: EventEmitter<string> = new EventEmitter();

  onValueChanged(event: Event) {
    this.value = (event.target as HTMLInputElement).value;
    this.valueChanged.emit(this.value);
  }
  get isEmpty(): boolean {
    if (this.value == null) {
      return true;
    }
    return `${this.value}`.length == 0;
  }
}
