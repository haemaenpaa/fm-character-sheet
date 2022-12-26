import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe that takes a modifier value and appends + if needed.
 */
@Pipe({
  name: 'modifier',
})
export class ModifierPipe implements PipeTransform {
  transform(value: number): string {
    if (value >= 0) return `+${value}`;
    return `${value}`;
  }
}
