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

@Pipe({
  name: 'abilityName',
})
export class AbilityNamePipe implements PipeTransform {
  transform(value: string, length: NameLength): String {
    if (!(value in ID_TO_NAME)) {
      return length == 'long' ? '???' : '?';
    }
    const longName = ID_TO_NAME[value];
    if (length == 'long') {
      return longName;
    }
    if (!(longName in ABILITY_ABBREVIATIONS)) {
      return '?';
    }
    return ABILITY_ABBREVIATIONS[longName];
  }
}
