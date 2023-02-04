import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CharacterAttackDto } from 'fm-transfer-model';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { convertAttackDto, convertAttackModel } from '../mapper/attack-mapper';
import CharacterAttack from '../model/character-attack';

@Injectable({
  providedIn: 'root',
})
export class CharacterAttackService {
  constructor(private http: HttpClient) {}

  createAttack(
    attack: CharacterAttack,
    characterId: number
  ): Promise<CharacterAttack> {
    return new Promise((res, rej) => {
      this.http
        .post<CharacterAttackDto>(
          `${environment.api.serverUrl}/api/character/${characterId}/attacks`,
          convertAttackModel(attack)
        )
        .pipe(
          retry(3),
          catchError((err) => {
            rej(err);
            return throwError(
              () => new Error('Failed to create character attack.')
            );
          })
        )
        .subscribe((response) => {
          res(convertAttackDto(response));
        });
    });
  }

  updateAttack(
    attack: CharacterAttack,
    characterId: number
  ): Promise<CharacterAttack> {
    return new Promise((res, rej) => {
      this.http
        .put<CharacterAttackDto>(
          `${environment.api.serverUrl}/api/character/${characterId}/attacks/${attack.id}`,
          convertAttackModel(attack)
        )
        .pipe(
          retry(3),
          catchError((err) => {
            rej(err);
            return throwError(
              () => new Error('Failed to update character attack.')
            );
          })
        )
        .subscribe((response) => {
          res(convertAttackDto(response));
        });
    });
  }

  deleteAttack(attackId: number, characterId: number): Promise<void> {
    return new Promise((res, rej) => {
      this.http
        .delete<CharacterAttackDto>(
          `${environment.api.serverUrl}/api/character/${characterId}/attacks/${attackId}`
        )
        .pipe(
          retry(3),
          catchError((err) => {
            rej(err);
            return throwError(
              () => new Error('Failed to create character attack.')
            );
          })
        )
        .subscribe((_) => {
          res();
        });
    });
  }
}
