import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SkillDto } from 'fm-transfer-model';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { convertSkillDto, convertSkillModel } from '../mapper/skill-mapper';
import { CharacterBiography } from '../model/character-bio';
import { Skill } from '../model/skill';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  constructor(private http: HttpClient) {}

  /**
   * Updates the default skills of the character.
   * @param values identifier-to-rank struct.
   * @param characterId Character Id.
   * @returns Promise of an identifier-to-rank struct.
   */
  updateDefaultSkills(values: object, characterId: number): Promise<object> {
    return new Promise<object>((res, rej) => {
      this.http
        .put<object>(
          `${environment.api.serverUrl}/api/character/${characterId}/defaultSkills`,
          values
        )
        .pipe(
          retry(3),
          catchError((error) => {
            rej(error);
            return throwError(
              () => new Error('Could not update default skills.')
            );
          })
        )
        .subscribe((ret) => {
          res(ret);
        });
    });
  }

  createSkill(skill: Skill, characterId: number): Promise<Skill> {
    return new Promise<Skill>((res, rej) => {
      this.http
        .post<SkillDto>(
          `${environment.api.serverUrl}/api/character/${characterId}/skills`,
          convertSkillModel(skill)
        )
        .pipe(
          retry(3),
          catchError((error) => {
            rej(error);
            return throwError(
              () => new Error('Could not create custom skill.')
            );
          })
        )
        .subscribe((dto) => {
          res(convertSkillDto(dto));
        });
    });
  }
  updateSkill(skill: Skill, characterId: number): Promise<Skill> {
    return new Promise<Skill>((res, rej) => {
      this.http
        .put<SkillDto>(
          `${environment.api.serverUrl}/api/character/${characterId}/skills/${skill.identifier}`,
          convertSkillModel(skill)
        )
        .pipe(
          retry(3),
          catchError((error) => {
            rej(error);
            return throwError(
              () => new Error('Could not update custom skill.')
            );
          })
        )
        .subscribe((dto) => {
          res(convertSkillDto(dto));
        });
    });
  }

  deleteSkill(skillId: string, characterId: number): Promise<void> {
    return new Promise<void>((res, rej) => {
      this.http
        .delete<SkillDto>(
          `${environment.api.serverUrl}/api/character/${characterId}/skills/${skillId}`
        )
        .pipe(
          retry(3),
          catchError((error) => {
            rej(error);
            return throwError(
              () => new Error('Could not delete custom skill.')
            );
          })
        )
        .subscribe((_) => {
          res();
        });
    });
  }
}
