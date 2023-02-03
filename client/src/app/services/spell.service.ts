import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CharacterSpellsDto, SpellDto } from 'fm-transfer-model';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  convertSpellbookDto,
  convertSpellBookModel,
  convertSpellDto,
  convertSpellModel,
} from '../mapper/spell-mapper';
import { CharacterSpells, Spell } from '../model/character-spells';
import { randomId } from '../model/id-generator';

@Injectable({
  providedIn: 'root',
})
export class SpellService {
  constructor(private http: HttpClient) {}

  updateSpellBook(
    toUpdate: CharacterSpells,
    characterId: number
  ): Promise<CharacterSpells> {
    return new Promise((res, rej) => {
      const dto = convertSpellBookModel(toUpdate);
      //Spell handling is done via a different API.
      dto.spells = undefined;
      this.http
        .put<CharacterSpellsDto>(
          `${environment.api.serverUrl}/api/character/${characterId}/spellbook`,
          dto
        )
        .pipe(
          retry(3),
          catchError((err) => {
            rej(err);
            return throwError(
              () => new Error('Failed to update character bio')
            );
          })
        )
        .subscribe((dto) => {
          const updated = convertSpellbookDto(dto);
          updated.spells = toUpdate.spells;
          res(updated);
        });
    });
  }

  addSpell(
    spell: Spell,
    characterId: number,
    spellbookId: number
  ): Promise<Spell> {
    return new Promise<Spell>((res, rej) => {
      const dto = convertSpellModel(spell);
      if (!dto.id) {
        dto.id = randomId();
      }
      this.http
        .post<SpellDto>(
          `${environment.api.serverUrl}/api/character/${characterId}/spellbook/${spellbookId}`,
          dto
        )
        .pipe(
          retry(3),
          catchError((err) => {
            rej(err);
            return throwError(() => new Error('Failed to create a spell.'));
          })
        )
        .subscribe((created) => {
          const ret = convertSpellDto(created);
          res(ret);
        });
    });
  }

  updateSpell(
    spell: Spell,
    characterId: number,
    spellbookId: number
  ): Promise<Spell> {
    return new Promise<Spell>((res, rej) => {
      const dto = convertSpellModel(spell);
      if (!spell.id) {
        rej('No spell id provided.');
        return;
      }
      this.http
        .put<SpellDto>(
          `${environment.api.serverUrl}/api/character/${characterId}/spellbook/${spellbookId}/${spell.id}`,
          dto
        )
        .pipe(
          retry(3),
          catchError((err) => {
            rej(err);
            return throwError(() => new Error('Failed to create a spell.'));
          })
        )
        .subscribe((created) => {
          const ret = convertSpellDto(created);
          res(ret);
        });
    });
  }
}
