import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AoSelection } from 'src/app/model/ao-selection';

@Component({
  selector: 'ao-selection-item',
  templateUrl: './ao-selection-item.component.html',
  styleUrls: ['./ao-selection-item.component.css', '../common.css'],
})
export class AoSelectionItemComponent {
  @Input() selection!: AoSelection;
  @Output() selectionChanged: EventEmitter<AoSelection> = new EventEmitter();
  @Output() selectionDeleted: EventEmitter<AoSelection> = new EventEmitter();
  hovered: boolean = false;
  onFieldChanged(name: string, value: string) {
    const newSelection: AoSelection = { ...this.selection, [name]: value };
    console.log(`Field ${name} changed to ${value}`, newSelection);
    this.selectionChanged.emit(newSelection);
  }
  onLevelChanged(value: string) {
    const level = Number.parseInt(value);
    const isPrimary = level > 3 ? true : this.selection.isPrimary;
    if (!isNaN(level)) {
      this.selectionChanged.emit({ ...this.selection, level, isPrimary });
    }
  }
  onPrimaryToggle(event: Event) {
    const element = event.target as HTMLInputElement;
    this.selectionChanged.emit({
      ...this.selection,
      isPrimary: element.checked,
    });
  }
  onDelete() {
    this.selectionDeleted.emit(this.selection);
  }
  onHover() {
    this.hovered = true;
  }
  onHoverEnd() {
    this.hovered = false;
  }
}
