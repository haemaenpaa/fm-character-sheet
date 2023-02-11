import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css'],
})
export class ColorPickerComponent {
  constructor(private dialogRef: MatDialogRef<ColorPickerComponent, string>) {}
  chooseColor(hue: number, saturation: number, lightness: number) {
    console.log('Color:' + HSLToRGB(hue, saturation / 100, lightness / 100));
    this.dialogRef.close(HSLToRGB(hue, saturation / 100, lightness / 100));
  }
  unset() {
    this.dialogRef.close('');
  }
}

function HSLToRGB(h: number, s: number, l: number): string {
  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;
  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function componentToHex(r: number): string {
  return r < 16 ? `0${r.toString(16)}` : r.toString(16);
}
