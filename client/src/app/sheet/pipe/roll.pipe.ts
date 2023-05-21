import { Pipe, PipeTransform } from '@angular/core';
import { RollComponent } from 'src/app/model/diceroll';
import { toModifier } from 'src/app/utils/modifier-utils';

/**
 * A pipe that converts from a RollComponent into a textual representation of the roll.
 */
@Pipe({
  name: 'roll',
})
export class RollPipe implements PipeTransform {
  transform(value: RollComponent): string {
    if (value.keep == value.dice) {
      return `${value.dice}d${value.sides}${toModifier(value.bonus)}`;
    }
    switch (value.keepMode) {
      case 'HIGHEST':
        return (
          `${value.dice}d${value.sides}kh${value.keep}` +
          toModifier(value.bonus)
        );
      case 'LOWEST':
        return (
          `${value.dice}d${value.sides}kl${value.keep}` +
          toModifier(value.bonus)
        );
    }
  }
}
