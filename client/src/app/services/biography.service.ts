import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CharacterBiographyDto } from 'fm-transfer-model';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  convertBiographyDto,
  convertBiographyModel,
} from '../mapper/biography-mapper';
import { CharacterBiography } from '../model/character-bio';

@Injectable({
  providedIn: 'root',
})
export class BiographyService {
  constructor(private http: HttpClient) {}

  getCharacterBio(characterId: number): Promise<CharacterBiography> {
    return new Promise<CharacterBiography>((res, rej) => {
      const getRequest = this.http
        .get<CharacterBiographyDto>(
          `${environment.api.serverUrl}/api/character/${characterId}/biography`
        )
        .pipe(
          retry(3),
          catchError((err, caught) => {
            rej(err);
            return throwError(() => new Error('Failed to get character bio.'));
          })
        );
      getRequest.subscribe((result) => {
        const model = convertBiographyDto(result);
        res(model);
      });
    });
  }
  updateCharacerBio(
    characterId: number,
    biography: CharacterBiography
  ): Promise<CharacterBiography> {
    return new Promise<CharacterBiography>((res, rej) => {
      const dto = convertBiographyModel(biography);
      const putRequest = this.http
        .put<CharacterBiographyDto>(
          `${environment.api.serverUrl}/api/character/${characterId}/biography`,
          dto
        )
        .pipe(
          retry(3),
          catchError((err, caught) => {
            rej(err);
            return throwError(
              () => new Error('Failed to update character bio.')
            );
          })
        );
      putRequest.subscribe((result) => {
        const model = convertBiographyDto(result);
        res(model);
      });
    });
  }
}
