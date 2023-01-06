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
    this.tempChanged.emit(this.applyChange(this.temporary, value));
  }

  onMaxChanged(value: string) {
    this.maxChanged.emit(this.applyChange(this.max, value));
  }

  onTotalChanged(value: string) {
    this.currentChanged.emit(this.applyChange(this.current, value));
  }

  private applyChange(initial: number, modifier: string): number {
    const parsed = Number.parseInt(modifier);
    if (isNaN(parsed)) {
      return initial;
    }
    if (modifier.charAt(0) == '+' || modifier.charAt(0) == '-') {
      // A preceding plus sign is parsed into a positive number.
      return initial + parsed;
    }
    return parsed;
  }
}
