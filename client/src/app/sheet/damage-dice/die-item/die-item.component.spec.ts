import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Roll, RollComponent } from 'src/app/model/diceroll';
import { EditableTextComponent } from '../../editable-text/editable-text.component';

import { DieItemComponent } from './die-item.component';

describe('DieItemComponent', () => {
  let component: DieItemComponent;
  let fixture: ComponentFixture<DieItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DieItemComponent, EditableTextComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DieItemComponent);
    component = fixture.componentInstance;
    component.roll = { id: 0, roll: new RollComponent(6), type: 'test' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
