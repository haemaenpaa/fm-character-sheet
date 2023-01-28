import { Pipe, PipeTransform } from '@angular/core';
import { last } from 'rxjs';
import { CharacterResource } from 'src/app/model/character-resource';

/**
 * Sorting pipe for character resources
 */
@Pipe({
  name: 'resourceSort',
})
export class ResourceSortPipe implements PipeTransform {
  /**
   * Sorts the input array.
   * @param value Array to be sorted.
   * @param lastId  ID of element to be sorted last.
   * @returns the sorted array.
   */
  transform(value: CharacterResource[], lastId?: number): CharacterResource[] {
    return value.sort((a, b) => {
      if (lastId && (a.id === lastId || b.id === lastId)) {
        if (a.id === lastId) {
          return b.id === lastId ? 0 : 1;
        }
        return -1;
      }
      if (a.name === b.name) {
        return 0;
      }
      return a.name < b.name ? -1 : 1;
    });
  }
}
