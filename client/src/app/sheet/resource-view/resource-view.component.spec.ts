import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { CharacterBuilder } from 'src/app/model/character-builder';
import { CharacterResource } from 'src/app/model/character-resource';
import { CharacterResourceService } from 'src/app/services/character-resource.service';
import { ResourceSortPipe } from './resource-sort.pipe';

import { ResourceViewComponent } from './resource-view.component';
import { SingleResourceComponent } from './single-resource/single-resource.component';

const dummyService = {
  createResource: (a: CharacterResource) => new Promise((res) => res(a)),
  updateResource: (a: CharacterResource) => new Promise((res) => res(a)),
  deleteResource: () => new Promise((res) => res({})),
};

describe('ResourceViewComponent', () => {
  let component: ResourceViewComponent;
  let fixture: ComponentFixture<ResourceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ResourceViewComponent,
        SingleResourceComponent,
        ResourceSortPipe,
      ],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: CharacterResourceService, useValue: dummyService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceViewComponent);
    component = fixture.componentInstance;
    component.character = new CharacterBuilder().build();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add resource', () => {
    component.character.resources = [];
    component.addResource();
    fixture.detectChanges();

    expect(component.character.resources.length)
      .withContext('Resource should have been added.')
      .toBe(1);
    const added = component.character.resources[0];
    expect(component.hilightId)
      .withContext('New resource should be hilighted.')
      .toBe(added.id);
  });

  it('should unset hilight when hilit resource is edited', () => {
    component.character.resources = [];
    component.addResource();
    fixture.detectChanges();

    const added = component.character.resources[0];
    const edited = { ...added, max: 5 };
    component.resourceChanged(edited);

    expect(component.hilightId)
      .withContext('Hilight ID should have been unset on edit.')
      .toBeUndefined();
  });

  it('should no unset hilight on non-hilight edit', () => {
    const edited = {
      id: 1,
      name: 'edited',
      max: 0,
      current: 0,
      shortRest: false,
    };
    const hilit = {
      id: 2,
      name: 'hilight',
      max: 0,
      current: 0,
      shortRest: false,
    };
    component.character.resources = [edited, hilit];
    component.hilightId = hilit.id;
    fixture.detectChanges();

    component.resourceChanged(edited);

    expect(component.hilightId)
      .withContext('Hilight ID should not have been unset on edit.')
      .toBe(hilit.id);
  });

  it('should unset hilight when hilit resource is deleted', () => {
    component.character.resources = [];
    component.addResource();
    fixture.detectChanges();

    const added = component.character.resources[0];
    component.resourceDeleted(added);

    expect(component.hilightId)
      .withContext('Hilight ID should have been unset on edit.')
      .toBeUndefined();
  });
  it('should no unset hilight on non-hilight delete', () => {
    const deleted = {
      id: 1,
      name: 'edited',
      max: 0,
      current: 0,
      shortRest: false,
    };
    const hilit = {
      id: 2,
      name: 'hilight',
      max: 0,
      current: 0,
      shortRest: false,
    };
    component.character.resources = [deleted, hilit];
    component.hilightId = hilit.id;
    fixture.detectChanges();

    const added = component.character.resources[0];
    component.resourceDeleted(deleted);

    expect(component.hilightId)
      .withContext('Hilight ID should not have been unset on delete.')
      .toBe(hilit.id);
  });

  it('should delete', () => {
    const deleted = {
      id: 1,
      name: 'deleted',
      max: 0,
      current: 0,
      shortRest: false,
    };
    const remaining = {
      id: 0,
      name: 'placeholder',
      max: 0,
      current: 0,
      shortRest: false,
    };
    component.character.resources = [remaining, deleted];
    fixture.detectChanges();

    component.resourceDeleted(deleted);
    fixture.detectChanges();

    expect(component.character.resources.length)
      .withContext('One resource should have been deleted.')
      .toBe(1);
    const found = component.character.resources[0];
    expect(found.id)
      .withContext('The correct resource should have been deleted.')
      .toBe(remaining.id);
  });
});
