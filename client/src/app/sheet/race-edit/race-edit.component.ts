import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Race } from 'src/app/model/race';
import Resistance from 'src/app/model/resistance';
import { AbilityModifiedEvent } from '../racial-abilities/racial-abilities.component';
import { ResistanceModifyEvent } from '../resistances/resistances.component';

type resistanceVariety = 'damage' | 'status';

@Component({
  selector: 'race-edit',
  templateUrl: './race-edit.component.html',
  styleUrls: ['./race-edit.component.css'],
})
export class RaceEditComponent {
  race: Race;
  colorized: boolean;
  constructor(
    private dialogRef: MatDialogRef<RaceEditComponent>,
    private changeDetector: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    { race, colorized }: { race: Race; colorized: boolean }
  ) {
    this.race = race;
    this.colorized = colorized;
  }

  setSubrace(subrace: string) {
    const trimmed = subrace.trim();
    if (trimmed.length == 0) {
      this.race.subrace = null;
    } else {
      this.race.subrace = trimmed;
    }
  }

  onSubmit() {
    this.dialogRef.close(this.race);
  }
  onResistanceInserted(variety: resistanceVariety, value: string) {
    const resistance: Resistance = {
      type: 'resistance',
      value,
    };
    if (variety === 'damage') {
      console.log('Inserting', value, this.race.damageResistances);
      this.race.damageResistances = [
        ...this.race.damageResistances,
        resistance,
      ];
    }
    if (variety === 'status') {
      this.race.statusResistances = [
        ...this.race.statusResistances,
        resistance,
      ];
    }
    this.changeDetector.detectChanges();
  }
  onResistanceDeleted(variety: resistanceVariety, deleted: Resistance) {
    const deletionFilter = (r: Resistance) => r.value !== deleted.value;
    if (variety === 'damage') {
      this.race.damageResistances =
        this.race.damageResistances.filter(deletionFilter);
    }
    if (variety === 'status') {
      this.race.statusResistances =
        this.race.statusResistances.filter(deletionFilter);
    }
  }

  onResistanceModified(
    variety: resistanceVariety,
    event: ResistanceModifyEvent
  ) {
    const mapper = (r: Resistance) =>
      r.value === event.old.value ? event.new : r;
    switch (variety) {
      case 'damage':
        this.race.damageResistances = this.race.damageResistances.map(mapper);
        break;
      case 'status':
        this.race.statusResistances = this.race.statusResistances.map(mapper);
        break;
    }
  }
  onAbilityChanged(event: AbilityModifiedEvent) {
    console.log('ability changed', event);
    if (event.newName !== null) {
      this.race.abilities = {
        ...this.race.abilities,
        [event.newName]: event.description!,
      };
    } else {
      const newAbilities = { ...this.race.abilities };
      delete newAbilities[event.oldName!];
      this.race.abilities = newAbilities;
    }
    this.changeDetector.detectChanges();
  }

  togglePowerfulBuild(event: Event) {
    this.race.powerfulBuild = (event.target as HTMLInputElement).checked;
  }
}
