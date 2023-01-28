import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OutletContext } from '@angular/router';
import { Hoverable } from 'src/app/common/hoverable';
import { CharacterResource } from 'src/app/model/character-resource';
import {
  ResourceEditComponent,
  ResourceEditData,
} from '../resource-edit/resource-edit.component';

@Component({
  selector: 'single-resource',
  templateUrl: './single-resource.component.html',
  styleUrls: ['./single-resource.component.css', '../../common.css'],
})
export class SingleResourceComponent extends Hoverable {
  @Input() resource!: CharacterResource;
  @Input() colorized: boolean = false;
  @Output() resourceChanged: EventEmitter<CharacterResource> =
    new EventEmitter();
  @Output() resourceDeleted: EventEmitter<CharacterResource> =
    new EventEmitter();

  constructor(private dialog: MatDialog) {
    super();
  }

  adjustAvailable(adjustBy: number) {
    const newValue = Math.min(
      this.resource.max,
      Math.max(0, this.resource.current + adjustBy)
    );
    this.resourceChanged.emit({ ...this.resource, current: newValue });
  }

  edit() {
    const data: ResourceEditData = {
      resource: { ...this.resource },
      colorized: this.colorized,
    };
    const dialogRef = this.dialog.open(ResourceEditComponent, { data });
    dialogRef.afterClosed().subscribe((r) => {
      if (r) {
        this.resourceChanged.emit(r);
      }
    });
  }

  delete() {
    this.resourceDeleted.emit(this.resource);
  }
}
