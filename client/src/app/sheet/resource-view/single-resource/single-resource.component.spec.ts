import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { CharacterResource } from 'src/app/model/character-resource';

import { SingleResourceComponent } from './single-resource.component';

function placeholder(): CharacterResource {
  return {
    id: 0,
    name: 'placeholder',
    max: 0,
    current: 0,
    shortRest: false,
  };
}

describe('SingleResourceComponent', () => {
  let component: SingleResourceComponent;
  let fixture: ComponentFixture<SingleResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleResourceComponent],
      providers: [{ provide: MatDialog, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleResourceComponent);
    component = fixture.componentInstance;
    component.resource = placeholder();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
