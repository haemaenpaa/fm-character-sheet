/**
 * Abbreviations of ability names, for display purposes.
 */
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

export const SKILL_DEFAULT_ABILITIES: { [key: string]: string[] } = {
  anh: ['cun', 'pre'],
  ath: ['br', 'dex'],
  dec: ['pre', 'man'],
  emp: ['man', 'com'],
  inv: ['cun'],
  lea: ['pre', 'man'],
  med: ['int', 'cun'],
  occ: ['int', 'cun'],
  perc: ['int', 'com'],
  pers: ['pre', 'man'],
  sub: ['dex', 'cun'],
  ste: ['dex', 'cun'],
  sur: ['int', 'cun'],
};
export const SKILL_DEFAULT_NAME: { [key: string]: string } = {
  anh: 'Animal handling',
  ath: 'Athletics',
  dec: 'Deception',
  emp: 'Empathy',
  inv: 'Investigation',
  lea: 'Leadership',
  med: 'Medicine',
  occ: 'Occult',
  perc: 'Perception',
  pers: 'Persuasion',
  sub: 'Subterfuge',
  ste: 'Stealth',
  sur: 'Survival',
};

export const ABILITY_TO_NAME: { [key: string]: string } = {
  br: 'Brawn',
  dex: 'Dexterity',
  vit: 'Vitality',
  int: 'Intelligence',
  cun: 'Cunning',
  res: 'Resolve',
  pre: 'Presence',
  man: 'Manipulation',
  com: 'Composure',
};

/**
 * Mapping from AO name to Hit Dice
 */
export const AO_HIT_DICE: any = {
  Artistry: 8,
  Devotion: 8,
  Discipline: 12,
  'Divine Oath': 10,
  Finesse: 10,
  'Occult Student': 6,
  Pact: 10,
  Power: 12,
  Predator: 10,
  'Soul Oath': 12,
  'Soul Weapon': 10,
  Tactics: 10,
  'Unique Ancestry': 8,
  'World Magic': 8,
};

export const SPELL_ROLL_TITLE = 'spell';
export const SOUL_CHECK_ROLL_TITLE = 'soulcheck';
export const SPELL_ATTACK_ROLL_TITLE = 'spellatk';
export const SPELL_SAVE_ROLL_TITLE = 'spellsave';
export const SPELL_DAMAGE_ROLL_TITLE = 'spelldmg';
