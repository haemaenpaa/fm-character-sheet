export type abilityName =
  | 'Brawn'
  | 'Dexterity'
  | 'Vitality'
  | 'Intelligence'
  | 'Cunning'
  | 'Resolve'
  | 'Presence'
  | 'Manipulation'
  | 'Composure';

export const ABILITY_ABBREVIATIONS: { [key: string]: string } = {
  Brawn: 'Br',
  Dexterity: 'Dex',
  Vitality: 'Vit',
  Intelligence: 'Int',
  Cunning: 'Cun',
  Resolve: 'Res',
  Presence: 'Pre',
  Manipulation: 'Man',
  Composure: 'Com',
};
