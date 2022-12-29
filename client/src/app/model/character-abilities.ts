import { Ability } from './ability';

class AbilityImpl implements Ability {
  identifier: string;
  score: number;

  constructor(name: string, score: number) {
    this.identifier = name;
    this.score = score;
  }
  get modifier(): number {
    return Math.floor((this.score - 10) / 2);
  }
}
/**
 * Data structure to contain a character's abilities.
 */
export default class CharacterAbilities {
  br: Ability = new AbilityImpl('br', 10);
  dex: Ability = new AbilityImpl('dex', 10);
  vit: Ability = new AbilityImpl('vit', 10);
  int: Ability = new AbilityImpl('int', 10);
  cun: Ability = new AbilityImpl('cun', 10);
  res: Ability = new AbilityImpl('res', 10);
  pre: Ability = new AbilityImpl('pre', 10);
  man: Ability = new AbilityImpl('man', 10);
  com: Ability = new AbilityImpl('com', 10);

  setBr(value: number) {
    this.br = new AbilityImpl('br', value);
  }
  setDex(value: number) {
    this.dex = new AbilityImpl('dex', value);
  }
  setVit(value: number) {
    this.vit = new AbilityImpl('vit', value);
  }
  setInt(value: number) {
    this.int = new AbilityImpl('int', value);
  }
  setCun(value: number) {
    this.cun = new AbilityImpl('cun', value);
  }
  setRes(value: number) {
    this.res = new AbilityImpl('res', value);
  }
  setPre(value: number) {
    this.pre = new AbilityImpl('pre', value);
  }
  setMan(value: number) {
    this.man = new AbilityImpl('man', value);
  }
  setCom(value: number) {
    this.com = new AbilityImpl('com', value);
  }
}
