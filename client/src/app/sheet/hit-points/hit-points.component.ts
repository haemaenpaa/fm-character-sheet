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

  @Output() currentChanged: EventEmitter<number> = new EventEmitter();
  @Output() maxChanged: EventEmitter<number> = new EventEmitter();
  @Output() tempChanged: EventEmitter<number> = new EventEmitter();

  onTempChanged(value: string) {
    const newTemp = Number.parseInt(value);
    if (isNaN(newTemp)) {
      return;
    }
    this.tempChanged.emit(newTemp);
  }

  onMaxChanged(value: string) {
    const newMax = Number.parseInt(value);
    if (!isNaN(newMax)) {
      this.maxChanged.emit(newMax);
    }
  }

  onTotalChanged(value: string) {
    const newTotal = Number.parseInt(value);
    if (!isNaN(newTotal)) {
      this.currentChanged.emit(newTotal);
    }
  }

  applyChange(initial: number, modifier: string): number {
    if (modifier.charAt(0) == '+' || modifier.charAt(0) == '-') {
      // A preceding plus sign is parsed into a positive number.
      return initial + Number.parseInt(modifier);
    }
    return Number.parseInt(modifier);
  }
}
