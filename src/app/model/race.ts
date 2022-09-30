export interface Race {
  name: string;
  subrace: string | null;
  abilities: { [key: string]: string };
}
