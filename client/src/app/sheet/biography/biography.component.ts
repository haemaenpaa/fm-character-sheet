import { Component, EventEmitter, Input, Output } from '@angular/core';
import Character from 'src/app/model/character';
import { BiographyService } from 'src/app/services/biography.service';

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

  constructor(private bioService: BiographyService) {}

  onSectionChange(
    section: 'characterBiography' | 'characterConnections',
    value: string
  ) {
    const toModify = {
      ...this.character.biography,
      [section]: value,
    };
    this.bioService
      .updateCharacerBio(this.character.id!, toModify)
      .then((modified) => {
        this.character.biography = modified;
        this.characterChanged.emit();
      });
  }
}
