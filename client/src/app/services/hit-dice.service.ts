import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CharacterHitDiceDto } from 'fm-transfer-model';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  convertHitDiceDto,
  convertHitDiceModel,
} from '../mapper/hit-dice-mapper';
import CharacterHitDice from '../model/character-hit-dice';

@Injectable({
  providedIn: 'root',
})
export class HitDiceService {
  constructor(private http: HttpClient) {}

  updateHitDiceRemaining(
    hitDice: CharacterHitDice,
    characterId: number
  ): Promise<CharacterHitDice> {
    const url = `${environment.api.serverUrl}/api/character/${characterId}/hitdice/remaining`;
    return this.updateInBackend(url, hitDice);
  }

  updateHitDice(
    hitDice: CharacterHitDice,
    characterId: number
  ): Promise<CharacterHitDice> {
    const url = `${environment.api.serverUrl}/api/character/${characterId}/hitdice/maximum`;
    return this.updateInBackend(url, hitDice);
  }

  private updateInBackend(url: string, hitDice: CharacterHitDice) {
    return new Promise<CharacterHitDice>((res, rej) => {
      this.http
        .put<CharacterHitDiceDto>(url, convertHitDiceModel(hitDice))
        .pipe(
          retry(3),
          catchError((err) => {
            rej(err);
            return throwError(() => new Error('Failed to update hit dice'));
          })
        )
        .subscribe((response) => {
          if (response) {
            res(convertHitDiceDto(response));
          }
        });
    });
  }
}
