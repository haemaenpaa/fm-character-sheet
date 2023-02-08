import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResistanceDto } from 'fm-transfer-model';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { convertRaceDto } from '../mapper/race-mapper';
import {
  convertResistanceDto,
  convertResistanceModel,
} from '../mapper/resistance-mapper';
import Resistance from '../model/resistance';

@Injectable({
  providedIn: 'root',
})
export class ResistanceService {
  constructor(private http: HttpClient) {}

  /**
   * Creates or updates a damage resistance of the character
   * @param resistance Resistance
   * @param characterId character ID
   * @returns
   */
  updateDamageResistance(
    resistance: Resistance,
    characterId: number
  ): Promise<Resistance> {
    return this.updateResistance(characterId, 'damage', resistance);
  }
  /**
   * Creates or updates a status resistance of the character
   * @param resistance Resistance
   * @param characterId character ID
   * @returns
   */
  updateStatusResistance(
    resistance: Resistance,
    characterId: number
  ): Promise<Resistance> {
    return this.updateResistance(characterId, 'status', resistance);
  }

  deleteDamageResistance(
    resistanceValue: string,
    characterId: number
  ): Promise<void> {
    return this.deleteResistance(characterId, 'damage', resistanceValue);
  }

  deleteStatusResistance(
    resistanceValue: string,
    characterId: number
  ): Promise<void> {
    return this.deleteResistance(characterId, 'status', resistanceValue);
  }

  private updateResistance(
    characterId: number,
    category: string,
    resistance: Resistance
  ): Promise<Resistance> {
    return new Promise<Resistance>((res, rej) => {
      this.http
        .post<ResistanceDto>(
          `${environment.api.serverUrl}/api/character/${characterId}/resistances/${category}`,
          convertResistanceModel(resistance)
        )
        .pipe(
          retry(3),
          catchError((error) => {
            rej(error);
            return throwError(() => new Error('Failed to set resistance.'));
          })
        )
        .subscribe((dto) => {
          res(convertResistanceDto(dto));
        });
    });
  }
  private deleteResistance(
    characterId: number,
    category: string,
    resistance: string
  ): Promise<void> {
    return new Promise<void>((res, rej) => {
      this.http
        .delete(
          `${environment.api.serverUrl}/api/character/${characterId}/resistances/${category}/${resistance}`
        )
        .pipe(
          retry(3),
          catchError((error) => {
            rej(error);
            return throwError(() => new Error('Failed to set resistance.'));
          })
        )
        .subscribe((_) => {
          res();
        });
    });
  }
}
