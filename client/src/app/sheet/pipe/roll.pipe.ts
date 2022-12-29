import { Pipe, PipeTransform } from '@angular/core';
import { RollComponent } from 'src/app/model/diceroll';

/**
 * A pipe that converts from a RollComponent into a textual representation of the roll.
 */
@Pipe({
  name: 'roll',
})
export class RollPipe implements PipeTransform {
  transform(value: RollComponent): string {
    if (value.keep == value.dice) {
      return `${value.dice}d${value.sides}`;
    }
    switch (value.keepMode) {
      case 'HIGHEST':
        return `${value.dice}d${value.sides}kh${value.keep}`;
      case 'LOWEST':
        return `${value.dice}d${value.sides}kl${value.keep}`;
    }
    return '';
  }
}
