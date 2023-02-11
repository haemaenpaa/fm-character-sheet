import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CharacterAbilitiesDto } from 'fm-transfer-model';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ability } from '../model/ability';
import CharacterAbilities, { AbilityImpl } from '../model/character-abilities';

@Injectable({
  providedIn: 'root',
})
export class AbilityService {
  constructor(private http: HttpClient) {}

  updateCharacterAbility(
    ability: Ability,
    characterId: number
  ): Promise<Ability> {
    return new Promise<Ability>((res, rej) => {
      this.http
        .put<CharacterAbilitiesDto>(
          `${environment.api.serverUrl}/api/character/${characterId}/abilities`,
          {
            [ability.identifier]: ability.score,
          }
        )
        .pipe(
          retry(3),
          catchError((error) => {
            rej(error);
            return throwError(() => new Error('Could not set ability'));
          })
        )
        .subscribe((dto) => {
          const ret: Ability = new AbilityImpl(
            ability.identifier,
            (dto as any)[ability.identifier] as number
          );
          res(ret);
        });
    });
  }
}
