import { Component, EventEmitter, Input, Output } from '@angular/core';
import Character from 'src/app/model/character';

@Component({
  selector: 'biography',
  templateUrl: './biography.component.html',
  styleUrls: [
    './biography.component.css',
    './biography.component.accessibility.css',
  ],
})
export class BiographyComponent {
  @Input() character!: Character;
  @Input() colorized: boolean = false;
  @Output() characterChanged: EventEmitter<void> = new EventEmitter();

  onSectionChange(
    section: 'characterBiography' | 'characterConnections',
    value: string
  ) {
    this.character.biography[section] = value;
    this.characterChanged.emit();
  }
}
