import { Pipe, PipeTransform } from '@angular/core';
import Resistance from 'src/app/model/resistance';

@Pipe({
  name: 'resistanceSort',
})
export class ResistanceSortPipe implements PipeTransform {
  transform(value: Resistance[]): Resistance[] {
    return value.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'immunity' ? -1 : 1;
      }
      return a.value.localeCompare(b.value);
    });
  }
}
