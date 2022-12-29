import { Injectable, NgZone } from '@angular/core';
import { Roll } from '../model/diceroll';
import { ActionDispatchService } from './action-dispatch.service';

/**
 * Service that maintains a log of called rolls.
 */
@Injectable({
  providedIn: 'root',
})
export class RollLogService {
  private _rolls: Roll[] = [];
  constructor(
    private actionDispatchService: ActionDispatchService,
    zone: NgZone
  ) {
    actionDispatchService.rolls().subscribe((r) => {
      zone.run(() => {
        this._rolls.push(r);
      });
    });
  }

  /**
   * Resets the rolls log.
   */
  reset(): void {
    this._rolls = [];
  }

  get rolls(): Roll[] {
    return this._rolls;
  }
}
