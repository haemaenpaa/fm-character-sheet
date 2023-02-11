import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AoSelectionDto } from 'fm-transfer-model';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  convertAoSelectionDto,
  convertAoSelectionModel,
} from '../mapper/selection-mapper';
import { AoSelection } from '../model/ao-selection';

@Injectable({
  providedIn: 'root',
})
export class AoSelectionService {
  constructor(private http: HttpClient) {}

  createSelection(
    selection: AoSelection,
    characterId: number
  ): Promise<AoSelection> {
    return new Promise<AoSelection>((res, rej) => {
      this.http
        .post<AoSelectionDto>(
          `${environment.api.serverUrl}/api/character/${characterId}/selections`,
          convertAoSelectionModel(selection)
        )
        .pipe(
          retry(3),
          catchError((err) => {
            rej(err);
            return throwError(() => new Error('Failed to create selection.'));
          })
        )
        .subscribe((dto) => {
          if (dto) {
            res(convertAoSelectionDto(dto));
          }
        });
    });
  }

  updateSelection(
    selection: AoSelection,
    characterId: number
  ): Promise<AoSelection> {
    return new Promise<AoSelection>((res, rej) => {
      this.http
        .put<AoSelectionDto>(
          `${environment.api.serverUrl}/api/character/${characterId}/selections/${selection.id}`,
          convertAoSelectionModel(selection)
        )
        .pipe(
          retry(3),
          catchError((err) => {
            rej(err);
            return throwError(() => new Error('Failed to update selection.'));
          })
        )
        .subscribe((dto) => {
          if (dto) {
            res(convertAoSelectionDto(dto));
          }
        });
    });
  }
  deleteSelection(selectionId: number, characterId: number): Promise<void> {
    return new Promise<void>((res, rej) => {
      this.http
        .delete<void>(
          `${environment.api.serverUrl}/api/character/${characterId}/selections/${selectionId}`
        )
        .pipe(
          retry(3),
          catchError((err) => {
            rej(err);
            return throwError(() => new Error('Failed to delete selection.'));
          })
        )
        .subscribe((_) => {
          console.log('Deleted.');
          res();
        });
    });
  }
}
