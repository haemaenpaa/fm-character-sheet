import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiativeLogComponent } from './initiative-log.component';
import { SimpleRoll } from 'src/app/model/diceroll';

describe('InitiativeLogComponent', () => {
  let component: InitiativeLogComponent;
  let fixture: ComponentFixture<InitiativeLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InitiativeLogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InitiativeLogComponent);
    component = fixture.componentInstance;
    component.roll = new SimpleRoll();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
