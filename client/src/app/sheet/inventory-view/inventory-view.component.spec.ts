import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterBuilder } from 'src/app/model/character-builder';
import { DividedNumberComponent } from '../divided-number/divided-number.component';
import { EditableTextComponent } from '../editable-text/editable-text.component';
import { ContainerViewComponent } from './container-view/container-view.component';

import { InventoryViewComponent } from './inventory-view.component';

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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryViewComponent);
    component = fixture.componentInstance;
    component.character = new CharacterBuilder().build();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
