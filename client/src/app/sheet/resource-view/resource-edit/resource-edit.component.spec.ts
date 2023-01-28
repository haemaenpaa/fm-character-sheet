import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CharacterResource } from 'src/app/model/character-resource';
import { EditableTextComponent } from '../../editable-text/editable-text.component';

import {
  ResourceEditComponent,
  ResourceEditData,
} from './resource-edit.component';

function placeholder(): ResourceEditData {
  const ret: ResourceEditData = {
    resource: {
      id: 0,
      name: 'placeholder',
      current: 0,
      max: 0,
      shortRest: false,
    },
  };
  return ret;
}

describe('ResourceEditComponent', () => {
  let component: ResourceEditComponent;
  let fixture: ComponentFixture<ResourceEditComponent>;
  let result: CharacterResource;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResourceEditComponent, EditableTextComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: (r: CharacterResource) => {
              result = r;
            },
          },
        },
        { provide: MAT_DIALOG_DATA, useFactory: placeholder },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should restrict total to maximum', () => {
    component.resource.current = 10;
    component.resource.max = 10;
    fixture.detectChanges();
    component.resource.max = 5;
    component.save();
    expect(result).not.toBeUndefined();
    expect(result.current).toBe(result.max);
  });

  it('should not modify total if maximum is greater', () => {
    component.resource.current = 3;
    component.resource.max = 5;
    fixture.detectChanges();
    component.resource.max = 10;
    component.save();
    expect(result).not.toBeUndefined();
    expect(result.current).toBe(3);
  });
});
