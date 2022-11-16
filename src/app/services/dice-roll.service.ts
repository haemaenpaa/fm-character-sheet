import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Roll } from '../model/diceroll';

@Injectable({
  providedIn: 'root',
})
export class DiceRollService {
  private readonly _rolls: Subject<Roll> = new Subject();
  constructor() {}

  public rolls(): Observable<Roll> {
    return this._rolls.asObservable();
  }

  public sendRoll(roll: Roll) {
    this._rolls.next(roll);
  }
}
