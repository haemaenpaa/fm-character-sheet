import { Component, EventEmitter, Input, Output } from '@angular/core';
import Character from 'src/app/model/character';
import { CharacterResource } from 'src/app/model/character-resource';
import { randomId } from 'src/app/model/id-generator';

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

  addResource() {
    const added: CharacterResource = {
      id: randomId(),
      name: 'New resource',
      current: 0,
      max: 0,
      shortRest: false,
    };
    this.character.resources.push(added);
    this.hilightId = added.id;
    this.characterChanged.emit();
  }
  resourceChanged(resource: CharacterResource) {
    this.character.resources = this.character.resources.map((r) =>
      r.id === resource.id ? resource : r
    );
    if (resource.id === this.hilightId) {
      this.hilightId = undefined;
    }
    this.characterChanged.emit();
  }
  resourceDeleted(resource: CharacterResource) {
    this.character.resources = this.character.resources.filter(
      (r) => r.id !== resource.id
    );
    if (resource.id === this.hilightId) {
      this.hilightId = undefined;
    }
    this.characterChanged.emit();
  }
}
