import Resistance from './resistance';

/**
 * Model for a race. Races will have a name, subrace, and zero or more named abilities. They may also have resistances.
 */
export interface Race {
  name: string;
  subrace: string | null;
  abilities: { [key: string]: string };
  damageResistances: Resistance[];
  statusResistances: Resistance[];
  powerfulBuild?: boolean;
}
