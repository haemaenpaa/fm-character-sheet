import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryContainer, Item } from 'src/app/model/item';
import { DividedNumberComponent } from '../../divided-number/divided-number.component';
import { EditableTextComponent } from '../../editable-text/editable-text.component';

import { ContainerViewComponent } from './container-view.component';

function newItem(): Item {
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

function placeholder(): InventoryContainer {
  return {
    id: 0,
    name: '',
    description: '',
    baseWeight: 0,
    weightMultiplierPercent: 0,
    contents: [],
  };
}

describe('ContainerViewComponent', () => {
  let component: ContainerViewComponent;
  let fixture: ComponentFixture<ContainerViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ContainerViewComponent,
        EditableTextComponent,
        DividedNumberComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContainerViewComponent);
    component = fixture.componentInstance;
    component.container = placeholder();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
