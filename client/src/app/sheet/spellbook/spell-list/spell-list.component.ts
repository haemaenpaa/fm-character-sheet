import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Spell } from 'src/app/model/character-spells';
import { randomId } from 'src/app/model/id-generator';
import { SpellEditComponent } from '../spell-edit/spell-edit.component';

export interface ResourceChangeEvent {
  specialSlotsAvailable: number;
  slotsAvailable: number;
  souls: number;
}

export interface SpellChangeEvent {
  old: Spell;
  new: Spell | null;
}

@Component({
  selector: 'spell-list',
  templateUrl: './spell-list.component.html',
  styleUrls: ['./spell-list.component.css', '../../common.css'],
})
export class SpellListComponent {
  @Input() tier: number = 0;
  @Input() souls: number = 0;
  @Input() slots: number = 0;
  @Input() slotsAvailable: number = 0;
  @Input() specialSlots: number = 0;
  @Input() specialSlotsAvailable: number = 0;
  @Input() spells: Spell[] = [];

  @Output() resourcesChanged: EventEmitter<ResourceChangeEvent> =
    new EventEmitter();
  @Output() spellAdded: EventEmitter<Spell> = new EventEmitter();
  @Output() spellChanged: EventEmitter<SpellChangeEvent> = new EventEmitter();

  hoveredId: number | null = null;
  constructor(private dialog: MatDialog) {}

  addSpell() {
    const newSpell: Spell = {
      id: randomId(),
      tier: this.tier,
      school: 'Abjuration',
      name: 'New Spell',
      saveAbility: null,
      description: '',
      damage: [],
      upcastDamage: [],
      ritual: false,
      soulMastery: false,
      concentration: false,
      attack: false,
      castingTime: '1 Action',
      duration: 'Instant',
    };
    this.spellAdded.emit(newSpell);
  }

  adjustAvailable(amount: number) {
    const newValue = Math.min(
      this.slots,
      Math.max(0, this.slotsAvailable + amount)
    );
    this.resourcesChanged.emit({
      specialSlotsAvailable: this.specialSlotsAvailable,
      slotsAvailable: newValue,
      souls: this.souls,
    });
  }
  adjustSpecialAvailable(amount: number) {
    const newValue = Math.min(
      this.specialSlots,
      Math.max(0, this.specialSlotsAvailable + amount)
    );
    this.resourcesChanged.emit({
      specialSlotsAvailable: newValue,
      slotsAvailable: this.slotsAvailable,
      souls: this.souls,
    });
  }
  soulsChanged(strValue: string) {
    if (strValue.trim().length === 0) {
      this.resourcesChanged.emit({
        souls: 0,
        specialSlotsAvailable: this.specialSlotsAvailable,
        slotsAvailable: this.slots,
      });
      return;
    }
    const newValue = Number.parseInt(strValue);
    this.resourcesChanged.emit({
      souls: Math.max(0, newValue),
      specialSlotsAvailable: this.specialSlotsAvailable,
      slotsAvailable: this.slots,
    });
  }

  editSpell(spell: Spell) {
    const editDialog = this.dialog.open(SpellEditComponent, {
      data: {
        spell: { ...spell },
      },
    });

    editDialog.afterClosed().subscribe((edited) => {
      if (edited) {
        this.spellChanged.emit({
          old: spell,
          new: edited,
        });
      }
    });
  }

  deleteSpell(spell: Spell) {
    this.spellChanged.emit({
      old: spell,
      new: null,
    });
  }
}
