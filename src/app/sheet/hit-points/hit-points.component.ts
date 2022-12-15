import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'hit-points',
  templateUrl: './hit-points.component.html',
  styleUrls: ['./hit-points.component.css'],
})
export class HitPointsComponent {
  @Input() current!: number;
  @Input() max!: number;
  @Input() temporary!: number;

  editingCurrent: boolean = false;
  editingTemp: boolean = false;

  @Output() currentChanged: EventEmitter<number> = new EventEmitter();
  @Output() tempChanged: EventEmitter<number> = new EventEmitter();

  setEditingCurrent() {
    this.editingCurrent = true;
    this.editingTemp = false;
  }

  setEditingTemp() {
    this.editingTemp = true;
    this.editingCurrent = false;
  }

  endEditing() {
    this.editingTemp = false;
    this.editingCurrent = false;
  }

  onInputValueChanged(event: Event) {
    console.log('onInputValueChanged', event.target);
    const element = event.target as HTMLInputElement;
    const value = element.value.trim();
    const newValue = this.applyChange(this.current, value);
    if (this.editingCurrent) {
      this.currentChanged.emit(newValue);
    }
    if (this.editingTemp) {
      this.tempChanged.emit(newValue);
    }
    this.endEditing();
  }

  applyChange(initial: number, modifier: string): number {
    if (modifier.charAt(0) == '+' || modifier.charAt(0) == '-') {
      // A preceding plus sign is parsed into a positive number.
      return initial + Number.parseInt(modifier);
    }
    return Number.parseInt(modifier);
  }
}
