import { Pipe, PipeTransform } from '@angular/core';
import { AoSelection } from 'src/app/model/ao-selection';

@Pipe({
  name: 'sortSelections',
})
export class SortSelectionsPipe implements PipeTransform {
  transform(value: AoSelection[], ...args: unknown[]): AoSelection[] {
    return value.sort((a, b) => {
      if (a.takenAtLevel != b.takenAtLevel) {
        if (!!a.takenAtLevel != !!b.takenAtLevel) {
          return a.takenAtLevel ? -1 : 1;
        }
      }
      if (a.isPrimary != b.isPrimary) {
        return a.isPrimary ? -1 : 1;
      }
      if (a.abilityOrigin !== b.abilityOrigin) {
        return a.abilityOrigin < b.abilityOrigin ? -1 : 1;
      }
      if (a.id !== b.id) {
        return a.id < b.id ? -1 : 1;
      }

      return 0;
    });
  }
}
