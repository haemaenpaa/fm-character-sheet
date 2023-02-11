import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';

import { RollLogComponent } from './roll-log.component';
const dummyActionDispatchService = {
  rolls: () => ({
    subscribe: () => {},
  }),
};

describe('RollLogComponent', () => {
  let component: RollLogComponent;
  let fixture: ComponentFixture<RollLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RollLogComponent],
      providers: [
        { provide: RollLogComponent, useValue: {} },
        {
          provide: ActionDispatchService,
          useValue: dummyActionDispatchService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RollLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
