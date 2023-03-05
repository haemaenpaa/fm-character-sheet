import { Pipe, PipeTransform } from '@angular/core';

export type ModifierInclude = 'all' | 'nonzero';

/**
 * Pipe that takes a modifier value and appends + if needed.
 */
@Pipe({
  name: 'modifier',
})
export class ModifierPipe implements PipeTransform {
  transform(value?: number, include: ModifierInclude = 'all'): string {
    if (value == undefined) {
      return '';
    }
    if (value == 0 && include === 'nonzero') {
      return '';
    }
    if (value >= 0) return `+${value}`;
    return `${value}`;
  }
}
