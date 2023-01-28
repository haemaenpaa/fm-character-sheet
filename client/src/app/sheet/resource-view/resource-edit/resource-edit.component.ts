import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CharacterResource } from 'src/app/model/character-resource';

export interface ResourceEditData {
  resource: CharacterResource;
  colorized?: boolean;
}

@Component({
  selector: 'resource-edit',
  templateUrl: './resource-edit.component.html',
  styleUrls: ['./resource-edit.component.css'],
})
export class ResourceEditComponent {
  resource: CharacterResource;
  colorized: boolean;
  constructor(
    private dialogRef: MatDialogRef<ResourceEditComponent>,
    @Inject(MAT_DIALOG_DATA) data: ResourceEditData
  ) {
    this.resource = data.resource;
    this.colorized = !!data.colorized;
  }
  setShortRest(event: Event) {
    this.resource.shortRest = (event.target as HTMLInputElement).checked;
  }

  save() {
    this.resource.current = Math.min(this.resource.current, this.resource.max);
    this.dialogRef.close(this.resource);
  }
}
