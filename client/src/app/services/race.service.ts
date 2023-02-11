import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RaceDto } from 'fm-transfer-model';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { convertRaceDto, convertRaceModel } from '../mapper/race-mapper';
import { Race } from '../model/race';

@Injectable({
  providedIn: 'root',
})
export class RaceService {
  constructor(private http: HttpClient) {}

  updateRace(race: Race, characterId: number): Promise<Race> {
    return new Promise<Race>((res, rej) => {
      this.http
        .put<RaceDto>(
          `${environment.api.serverUrl}/api/character/${characterId}/race`,
          convertRaceModel(race)
        )
        .pipe(
          retry(3),
          catchError((err) => {
            rej(err);
            return throwError(() => new Error('Failed to update race.'));
          })
        )
        .subscribe((modified) => {
          res(convertRaceDto(modified));
        });
    });
  }
}
