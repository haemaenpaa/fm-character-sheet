import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Roll } from 'src/app/model/diceroll';

import { SpellSaveLogComponent } from './spell-save-log.component';

describe('SpellSaveLogComponent', () => {
  let component: SpellSaveLogComponent;
  let fixture: ComponentFixture<SpellSaveLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpellSaveLogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpellSaveLogComponent);
    component = fixture.componentInstance;
    component.roll = new Roll();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
