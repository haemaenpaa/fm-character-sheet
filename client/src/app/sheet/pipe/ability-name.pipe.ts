import { Pipe, PipeTransform } from '@angular/core';
import {
  ABILITY_ABBREVIATIONS,
  ABILITY_TO_NAME,
} from 'src/app/model/constants';

export type NameLength = 'short' | 'long';

/**
 * Converts an ability identifier into a human readable text.
 */
@Pipe({
  name: 'abilityName',
})
export class AbilityNamePipe implements PipeTransform {
  transform(value: string, length: NameLength): String {
    if (!(value in ABILITY_TO_NAME)) {
      //Unknown ability identifier
      return length == 'long' ? '???' : '?';
    }
    const longName = ABILITY_TO_NAME[value];
    if (length == 'long') {
      //The long name of the ability.
      return longName;
    }
    if (!(longName in ABILITY_ABBREVIATIONS)) {
      // No abbreviation known
      return '?';
    }
    //Return the abbreviation.
    return ABILITY_ABBREVIATIONS[longName];
  }
}
