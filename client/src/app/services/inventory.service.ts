import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemDto } from 'fm-transfer-model';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  convertInventoryContainerDto,
  convertInventoryContainerModel,
  convertItemDto,
  convertItemModel,
} from '../mapper/inventory-mapper';
import { InventoryContainer, Item } from '../model/item';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  constructor(private http: HttpClient) {}

  createContainer(
    container: InventoryContainer,
    characterId: number
  ): Promise<InventoryContainer> {
    return new Promise<InventoryContainer>((res, rej) => {
      this.http
        .post<InventoryContainer>(
          `${environment.api.serverUrl}/api/character/${characterId}/inventory`,
          convertInventoryContainerModel(container)
        )
        .pipe(
          retry(3),
          catchError((error) => {
            rej(error);
            return throwError(() => new Error('Failed to create container'));
          })
        )
        .subscribe((result) => {
          const ret = convertInventoryContainerDto(result);
          res(ret);
        });
    });
  }

  updateContainer(
    container: InventoryContainer,
    characterId: number
  ): Promise<InventoryContainer> {
    return new Promise<InventoryContainer>((res, rej) => {
      this.http
        .put<InventoryContainer>(
          `${environment.api.serverUrl}/api/character/${characterId}/inventory/${container.id}`,
          convertInventoryContainerModel(container)
        )
        .pipe(
          retry(3),
          catchError((error) => {
            rej(error);
            return throwError(() => new Error('Failed to update container'));
          })
        )
        .subscribe((result) => {
          const ret = convertInventoryContainerDto(result);
          res(ret);
        });
    });
  }

  deleteContainer(containerId: number, characterId: number): Promise<void> {
    return new Promise<void>((res, rej) => {
      this.http
        .delete<InventoryContainer>(
          `${environment.api.serverUrl}/api/character/${characterId}/inventory/${containerId}`
        )
        .pipe(
          retry(3),
          catchError((error) => {
            rej(error);
            return throwError(() => new Error('Failed to create container'));
          })
        )
        .subscribe((_) => {
          res();
        });
    });
  }

  createItem(item: Item, containerId: number, characterId: number) {
    return new Promise<Item>((res, rej) => {
      this.http
        .post<ItemDto>(
          `${environment.api.serverUrl}/api/character/${characterId}/inventory/${containerId}/item`,
          convertItemModel(item)
        )
        .pipe(
          retry(3),
          catchError((error) => {
            rej(error);
            return throwError(() => new Error('Failed to create item.'));
          })
        )
        .subscribe((updated) => {
          res(convertItemDto(updated));
        });
    });
  }

  updateItem(
    item: Item,
    containerId: number,
    characterId: number
  ): Promise<Item> {
    return new Promise<Item>((res, rej) => {
      this.http
        .put<ItemDto>(
          `${environment.api.serverUrl}/api/character/${characterId}/inventory/${containerId}/item/${item.id}`,
          convertItemModel(item)
        )
        .pipe(
          retry(3),
          catchError((error) => {
            rej(error);
            return throwError(() => new Error('Failed to update item.'));
          })
        )
        .subscribe((updated) => {
          res(convertItemDto(updated));
        });
    });
  }
  deleteItem(
    itemId: number,
    containerId: number,
    characterId: number
  ): Promise<void> {
    return new Promise<void>((res, rej) => {
      this.http
        .delete<ItemDto>(
          `${environment.api.serverUrl}/api/character/${characterId}/inventory/${containerId}/item/${itemId}`
        )
        .pipe(
          retry(3),
          catchError((error) => {
            rej(error);
            return throwError(() => new Error('Failed to delete item.'));
          })
        )
        .subscribe((_) => {
          res();
        });
    });
  }
  /**
   * Bulk moves items from one container to another.
   * @param originId Origin container id
   * @param destinationId destination container id
   * @param characterId
   * @returns
   */
  bulkMoveItems(
    originId: number,
    destinationId: number,
    characterId: number
  ): Promise<Item[]> {
    return new Promise<Item[]>((res, rej) => {
      this.http
        .post<ItemDto[]>(
          `${environment.api.serverUrl}/api/character/${characterId}/inventory/bulkMove/${originId}`,
          {},
          { params: { to: destinationId } }
        )
        .pipe(
          retry(3),
          catchError((error) => {
            rej(error);
            return throwError(() => new Error('Failed to move container'));
          })
        )
        .subscribe((updated) => {
          res(updated.map(convertItemDto));
        });
    });
  }

  /**
   * Moves one item to the target container.
   * @param itemId  Item id
   * @param destinationId  destination container id.
   * @param characterId Character
   * @returns
   */
  moveItem(
    itemId: number,
    destinationId: number,
    characterId: number
  ): Promise<Item> {
    return new Promise<Item>((res, rej) => {
      this.http
        .post<ItemDto>(
          `${environment.api.serverUrl}/api/character/${characterId}/moveItem/${itemId}`,
          {},
          { params: { to: destinationId } }
        )
        .pipe(
          retry(3),
          catchError((error) => {
            rej(error);
            return throwError(() => new Error('Failed to move container'));
          })
        )
        .subscribe((updated) => {
          res(convertItemDto(updated));
        });
    });
  }
}
