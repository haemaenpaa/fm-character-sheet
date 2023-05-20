import { Injectable } from '@angular/core';
import { Advantage } from '../model/game-action';

@Injectable({
  providedIn: 'root',
})
export class AdvantageResolverService {
  constructor() {}

  resolveForEvent(event: Event): Advantage {
    if ('shiftKey' in event && (event as any)['shiftKey']) {
      return 'advantage';
    }
    if ('ctrlKey' in event && (event as any)['ctrlKey']) {
      return 'disadvantage';
    }
    return 'none';
  }
}
