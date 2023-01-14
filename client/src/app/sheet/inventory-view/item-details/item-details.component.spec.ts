import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'src/app/model/item';
import DummyClass from 'src/app/utils/dummy-class';
import { EditableTextComponent } from '../../editable-text/editable-text.component';

import { ItemDetailsComponent } from './item-details.component';

function placeholder(): Item {
  return {
    id: 0,
    name: '',
    description: '',
    weight: 0,
    quantity: 0,
    attunement: 'none',
    equipped: 'none',
  };
}

describe('ItemDetailsComponent', () => {
  let component: ItemDetailsComponent;
  let fixture: ComponentFixture<ItemDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemDetailsComponent, EditableTextComponent],
      providers: [
        { provide: MatDialogRef, useClass: DummyClass },
        { provide: MAT_DIALOG_DATA, useValue: { item: placeholder() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct weight', () => {
    component.item.weight = 1234;
    expect(component.weightInKilos()).toBe('1.23');
  });

  it('should set correct weight', () => {
    component.item.weight = 1234;
    component.setWeightInKilos(23.4567);
    expect(component.item.weight).toBe(23457);
  });
});
