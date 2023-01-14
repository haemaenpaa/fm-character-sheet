import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Item } from 'src/app/model/item';
import DummyClass from 'src/app/utils/dummy-class';
import { DividedNumberComponent } from '../../divided-number/divided-number.component';
import { EditableTextComponent } from '../../editable-text/editable-text.component';

import { ItemViewComponent } from './item-view.component';

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

describe('ItemViewComponent', () => {
  let component: ItemViewComponent;
  let fixture: ComponentFixture<ItemViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ItemViewComponent,
        EditableTextComponent,
        DividedNumberComponent,
      ],
      providers: [{ provide: MatDialog, useClass: DummyClass }],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemViewComponent);
    component = fixture.componentInstance;
    component.item = placeholder();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
