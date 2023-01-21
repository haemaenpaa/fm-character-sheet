import { Pipe, PipeTransform } from '@angular/core';
import { AoSelection } from 'src/app/model/ao-selection';

const precalculatedHues: { [key: string]: number } = {};

export type AoSelectionSort =
  | 'character-level'
  | 'ao-level'
  | 'ao-name'
  | 'name'
  | 'hilight-color';

@Pipe({
  name: 'sortSelections',
})
export class SortSelectionsPipe implements PipeTransform {
  transform(value: AoSelection[], ...args: AoSelectionSort[]): AoSelection[] {
    const fields = args.length == 0 ? ['takenAtLevel'] : args;
    return value.sort((a, b) => {
      for (const field of args) {
        const aVal = extractValue(field, a);
        const bVal = extractValue(field, b);
        if (aVal !== bVal) {
          if (aVal === null) {
            return 1;
          }
          return aVal < bVal ? -1 : 1;
        }
      }
      if (a.id !== b.id) {
        return a.id < b.id ? -1 : 1;
      }

      return 0;
    });
  }
}

function extractValue(
  field: AoSelectionSort,
  selection: AoSelection
): number | string {
  switch (field) {
    case 'character-level':
      return selection.takenAtLevel || 0;
    case 'name':
      return selection.name;
    case 'ao-name':
      return selection.abilityOrigin;
    case 'ao-level':
      return selection.level;
    case 'hilight-color':
      return RGBToHue(selection.hilightColor);
  }
  return Number.POSITIVE_INFINITY;
}

function RGBToHue(colorString: string | undefined): number {
  if (!colorString || colorString.length === 0) {
    return Number.POSITIVE_INFINITY;
  }
  if (colorString in precalculatedHues) {
    return precalculatedHues[colorString];
  }
  var r, g, b;
  if (!colorString.match(/#[0-9a-fA-F]{6}/)) {
    const fakeDiv = document.createElement('div');
    fakeDiv.style.color = colorString;
    document.body.appendChild(fakeDiv);
    const cs = window.getComputedStyle(fakeDiv);

    const pv = cs.getPropertyValue('color');
    document.body.removeChild(fakeDiv);
    const rgbStrs = pv.substring(4).split(')')[0].split(',');
    r = Number.parseInt(rgbStrs[0]);
    g = Number.parseInt(rgbStrs[1]);
    b = Number.parseInt(rgbStrs[2]);
  } else {
    r = Number.parseInt(colorString.substring(1, 3), 16);
    g = Number.parseInt(colorString.substring(3, 5), 16);
    b = Number.parseInt(colorString.substring(5, 7), 16);
  }

  // Make r, g, and b fractions of 1
  r /= 255;
  g /= 255;
  b /= 255;

  // Find greatest and smallest channel values
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta == 0) return 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;
  precalculatedHues[colorString] = h;

  console.log('Precalculated hues:', precalculatedHues);
  return h;
}
