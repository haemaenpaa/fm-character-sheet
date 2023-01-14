import { DragDropModule } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { CharacterBuilder } from 'src/app/model/character-builder';
import { Item } from 'src/app/model/item';
import DummyClass from 'src/app/utils/dummy-class';
import { DividedNumberComponent } from '../divided-number/divided-number.component';
import { EditableTextComponent } from '../editable-text/editable-text.component';
import { ContainerViewComponent } from './container-view/container-view.component';

import { InventoryViewComponent } from './inventory-view.component';
import { ItemViewComponent } from './item-view/item-view.component';

describe('InventoryViewComponent', () => {
  let component: InventoryViewComponent;
  let fixture: ComponentFixture<InventoryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        InventoryViewComponent,
        EditableTextComponent,
        DividedNumberComponent,
        ContainerViewComponent,
        ItemViewComponent,
      ],
      imports: [DragDropModule],
      providers: [{ provide: MatDialog, useClass: DummyClass }],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryViewComponent);
    component = fixture.componentInstance;
    component.character = new CharacterBuilder().build();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should move contents of deleted container to first', () => {
    const deletedItem: Item = {
      id: 432189,
      name: 'Item from deleted container',
      description: '',
      weight: 0,
      quantity: 0,
      attunement: 'none',
      equipped: 'none',
    };
    const firstContainer = {
      id: 0,
      name: 'First container',
      description: '',
      baseWeight: 0,
      weightMultiplierPercent: 0,
      contents: [] as Item[],
    };
    const deletedContainer = {
      id: 1,
      name: 'Deleted container',
      description: '',
      baseWeight: 0,
      weightMultiplierPercent: 0,
      contents: [deletedItem],
    };
    component.character.inventory = [firstContainer, deletedContainer];

    component.onContainerDelete(deletedContainer);

    expect(firstContainer.contents.length).toBe(1);
    expect(firstContainer.contents[0].id).toBe(deletedItem.id);
  });

  it('should compute encumberance', () => {
    const item: Item = {
      id: 432189,
      name: 'Item',
      description: '',
      weight: 1000,
      quantity: 1,
      attunement: 'none',
      equipped: 'none',
    };
    const firstContainer = {
      id: 0,
      name: 'First container',
      description: '',
      baseWeight: 0,
      weightMultiplierPercent: 100,
      contents: [item],
    };
    component.character.inventory = [firstContainer];

    expect(component.encumbered).toBeUndefined();
    item.quantity = 51;
    console.log(component.totalWeight, component.carryWeight);
    expect(component.encumbered).toBe('Encumbered');
    item.quantity = 101;
    expect(component.encumbered).toBe('Heavily encumbered');
  });
});
