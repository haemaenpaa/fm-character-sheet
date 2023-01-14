import { Component, Input } from '@angular/core';

@Component({
  selector: 'divided-number',
  templateUrl: './divided-number.component.html',
  styleUrls: ['./divided-number.component.css'],
})
export class DividedNumberComponent {
  @Input() value: number = 0;
  @Input() shiftDigits: number = 0;
  @Input() precision: number = 0;

  get displayValue(): string {
    var ret = `${Math.floor(this.value)}`;
    while (ret.length < this.shiftDigits + 1) {
      ret = '0' + ret;
    }
    const pointLoc = ret.length - this.shiftDigits;
    const whole = ret.substring(0, pointLoc);
    const fraction = ret.substring(pointLoc, pointLoc + this.precision);
    if (this.precision && !fraction.match(/^0+$/)) {
      return whole + '.' + fraction;
    } else {
      return whole;
    }
  }
}
