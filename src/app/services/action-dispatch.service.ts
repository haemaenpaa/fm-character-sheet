import { Injectable, ɵAPP_ID_RANDOM_PROVIDER } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { KeepMode, Roll, RollComponent } from '../model/diceroll';
import { Advantage, GameAction } from '../model/game-action';
import { Ability } from '../model/ability';

function rollId() {
  const idNumber = Math.floor(Math.random() * 2 ** 32);
  var rootStr = idNumber.toString(16);
  while (rootStr.length < 8) {
    rootStr = '0' + rootStr;
  }
  return rootStr;
}
@Injectable({
  providedIn: 'root',
})
export class ActionDispatchService {
  private readonly _rolls: Subject<Roll> = new Subject();
  constructor() {}

  public rolls(): Observable<Roll> {
    return this._rolls.asObservable();
  }

  public dispatch(action: GameAction) {
    const params = action.params;
    switch (action.type) {
      case 'ability-check':
        this.dispatchAbilityCheck(
          params.characterName,
          params.ability,
          params.advantage
        );
        break;
    }
  }

  private dispatchAbilityCheck(
    name: string,
    ability: Ability,
    advantage: Advantage
  ) {
    const roll: Roll = new Roll();
    roll.title = ability.identifier;
    roll.character = name;

    const diceCount = advantage === 'none' ? 1 : 2;
    const keep = 1;
    const keepMode: KeepMode = advantage === 'advantage' ? 'HIGHEST' : 'LOWEST';
    roll.addDie(new RollComponent(20, diceCount, keepMode, keep));
    roll.addModifier({ name: ability.identifier, value: ability.modifier });

    this.sendRoll(roll);
  }

  private sendRoll(roll: Roll) {
    if (!roll.id) {
      roll.id = rollId();
    }
    this._rolls.next(roll);
  }
}
