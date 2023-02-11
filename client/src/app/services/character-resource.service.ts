import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CharacterResourceDto } from 'fm-transfer-model';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  convertResourceDto,
  convertResourceModel,
} from '../mapper/resource-mapper';
import { CharacterResource } from '../model/character-resource';

@Injectable({
  providedIn: 'root',
})
export class CharacterResourceService {
  constructor(private http: HttpClient) {}

  createResource(
    resource: CharacterResource,
    characterId: number
  ): Promise<CharacterResource> {
    return new Promise((res, rej) => {
      this.http
        .post<CharacterResourceDto>(
          `${environment.api.serverUrl}/api/character/${characterId}/resources`,
          convertResourceModel(resource)
        )
        .pipe(
          retry(3),
          catchError((error) => {
            rej(error);
            return throwError(() => new Error('Could not create resource'));
          })
        )
        .subscribe((dto) => {
          res(convertResourceDto(dto));
        });
    });
  }
  updateResource(
    resource: CharacterResource,
    characterId: number
  ): Promise<CharacterResource> {
    return new Promise((res, rej) => {
      this.http
        .put<CharacterResourceDto>(
          `${environment.api.serverUrl}/api/character/${characterId}/resources/${resource.id}`,
          convertResourceModel(resource)
        )
        .pipe(
          retry(3),
          catchError((error) => {
            rej(error);
            return throwError(() => new Error('Could not delete resource'));
          })
        )
        .subscribe((dto) => {
          res(convertResourceDto(dto));
        });
    });
  }
  deleteResource(resourceId: number, characterId: number): Promise<void> {
    return new Promise<void>((res, rej) => {
      this.http
        .delete<CharacterResourceDto>(
          `${environment.api.serverUrl}/api/character/${characterId}/resources/${resourceId}`
        )
        .pipe(
          retry(3),
          catchError((error) => {
            rej(error);
            return throwError(() => new Error('Could not delete resource'));
          })
        )
        .subscribe((_) => {
          res();
        });
    });
  }
}
