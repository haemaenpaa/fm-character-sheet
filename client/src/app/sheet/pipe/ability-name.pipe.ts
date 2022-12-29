import { Pipe, PipeTransform } from '@angular/core';
import { ABILITY_ABBREVIATIONS } from 'src/app/model/constants';

export type NameLength = 'short' | 'long';

const ID_TO_NAME: { [key: string]: string } = {
  br: 'Brawn',
  dex: 'Dexterity',
  vit: 'Vitality',
  int: 'Intelligence',
  cun: 'Cunning',
  res: 'Resolve',
  pre: 'Presence',
  man: 'Manipulation',
  com: 'Composure',
};

/**
 * Converts an ability identifier into a human readable text.
 */
@Pipe({
  name: 'abilityName',
})
export class AbilityNamePipe implements PipeTransform {
  transform(value: string, length: NameLength): String {
    if (!(value in ID_TO_NAME)) {
      //Unknown ability identifier
      return length == 'long' ? '???' : '?';
    }
    const longName = ID_TO_NAME[value];
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
