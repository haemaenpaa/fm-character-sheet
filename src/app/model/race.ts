/**
 * Model for a race. Races will have a name, subrace, and zero or more named abilities.
 */
export interface Race {
  name: string;
  subrace: string | null;
  abilities: { [key: string]: string };
}
