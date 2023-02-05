import { Component, EventEmitter, Input, Output } from '@angular/core';
import Character from 'src/app/model/character';
import { CharacterResource } from 'src/app/model/character-resource';
import { randomId } from 'src/app/model/id-generator';
import { CharacterResourceService } from 'src/app/services/character-resource.service';

@Component({
  selector: 'resource-view',
  templateUrl: './resource-view.component.html',
  styleUrls: ['./resource-view.component.css'],
})
export class ResourceViewComponent {
  @Input() character!: Character;
  @Input() colorized: boolean = false;
  @Output() characterChanged: EventEmitter<void> = new EventEmitter();
  hilightId?: number;
  constructor(private resourceService: CharacterResourceService) {}

  addResource() {
    const oldResources = [...this.character.resources];
    const added: CharacterResource = {
      id: randomId(),
      name: 'New resource',
      current: 0,
      max: 0,
      shortRest: false,
    };
    this.character.resources.push(added);
    this.hilightId = added.id;
    this.resourceService.createResource(added, this.character.id!).then(
      (_) => {
        this.characterChanged.emit();
      },
      (error) => {
        console.error('Failed to create resource', error);
        this.character.resources = oldResources;
      }
    );
  }

  resourceChanged(resource: CharacterResource) {
    const oldResources = [...this.character.resources];
    this.character.resources = this.character.resources.map((r) =>
      r.id === resource.id ? resource : r
    );
    if (resource.id === this.hilightId) {
      this.hilightId = undefined;
    }
    this.resourceService.updateResource(resource, this.character.id!).then(
      (_) => {
        this.characterChanged.emit();
      },
      (error) => {
        console.error('Failed to update resource', error);
        this.character.resources = oldResources;
      }
    );
  }
  resourceDeleted(resource: CharacterResource) {
    const oldResources = [...this.character.resources];
    this.character.resources = this.character.resources.filter(
      (r) => r.id !== resource.id
    );
    if (resource.id === this.hilightId) {
      this.hilightId = undefined;
    }
    this.resourceService.deleteResource(resource.id, this.character.id!).then(
      () => {
        this.characterChanged.emit();
      },
      (error) => {
        console.error('Failed to delete resource', error);
        this.character.resources = oldResources;
      }
    );
  }
}
