import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiativeButtonComponent } from './initiative-button.component';
import { CharacterBuilder } from 'src/app/model/character-builder';
import {
  Advantage,
  GameAction,
  InitiativeParams,
} from 'src/app/model/game-action';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';
import { of } from 'rxjs';
import { AdvantageResolverService } from 'src/app/services/advantage-resolver.service';
import { ModifierPipe } from '../pipe/modifier.pipe';

describe('InitiativeButtonComponent', () => {
  let component: InitiativeButtonComponent;
  let fixture: ComponentFixture<InitiativeButtonComponent>;
  let dispatched: GameAction[];
  let expectedAdvantage: Advantage = 'none';

  beforeEach(async () => {
    dispatched = [];
    const dummyActionService = {
      dispatch: (action: GameAction) => dispatched.push(action),
    };
    const dummyResolver = {
      resolveForEvent: (_: any) => {
        return expectedAdvantage;
      },
    };

    await TestBed.configureTestingModule({
      declarations: [InitiativeButtonComponent, ModifierPipe],
      providers: [
        { provide: ActionDispatchService, useValue: dummyActionService },
        { provide: AdvantageResolverService, useValue: dummyResolver },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InitiativeButtonComponent);
    component = fixture.componentInstance;
    component.character = new CharacterBuilder().build();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  for (const advantage of ['none', 'advantage', 'disadvantage']) {
    it(`should call roll with ${advantage}`, () => {
      expectedAdvantage = advantage as Advantage;
      const id = 123;
      component.character!.id = id;
      component.callRoll({} as unknown as Event);
      expect(dispatched.length).toBe(1);
      const actualAction = dispatched[0];
      const actualParams = actualAction.params as InitiativeParams;
      expect(actualAction.type).toBe('initiative');
      expect(actualParams.characterId).toBe(id);
      expect(actualParams.advantage).toBe(expectedAdvantage);
    });
  }
});
