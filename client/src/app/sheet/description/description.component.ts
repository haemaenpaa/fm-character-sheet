import { Component, EventEmitter, Input, Output } from '@angular/core';
import Character from 'src/app/model/character';

@Component({
  selector: 'description',
  templateUrl: './description.component.html',
  styleUrls: [
    './description.component.css',
    './description.component.accessibility.css',
  ],
})
export class DescriptionComponent {
  @Input() character!: Character;
  @Input() colorized: boolean = false;
  @Output() characterChanged: EventEmitter<void> = new EventEmitter();

  onSectionChange(
    section: 'concept' | 'appearance' | 'soulMarkDescription',
    value: string
  ) {
    this.character.biography[section] = value;
    this.characterChanged.emit();
  }

  onNumberChange(section: 'height' | 'weight', value: number) {
    this.character.biography[section] = value;
    this.characterChanged.emit();
  }
}
