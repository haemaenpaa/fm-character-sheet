import { DataTypes, HasMany, HasOne, Model, ModelAttributes } from "sequelize";
import { AoSelection } from "./ao-selection";
import { Attack } from "./attack";
import { CharacterBio } from "./character-bio";
import { CharacterSpellbook } from "./character-spells";
import { CustomSkill } from "./custom-skill";
import { HitDice, HitDiceRemaining } from "./hit-dice";
import { InventoryContainer } from "./inventory";
import { Race } from "./race";
import { Resistance } from "./resistance";

export class Character extends Model {
  static Race: HasOne<Character, Race>;
  static Resistances: HasMany<Character, Resistance>;
  static Skills: HasMany<Character, CustomSkill>;
  static Selections: HasMany<Character, AoSelection>;
  static Spellbook: HasOne<CharacterSpellbook>;
  static Attacks: HasMany<Character, Attack>;
  static HitDice: HasOne<Character, HitDice>;
  static HitDiceRemaining: HasOne<Character, HitDiceRemaining>;
  static Inventory: HasMany<Character, InventoryContainer>;
  static Bio: HasOne<Character, CharacterBio>;
}

export const CharacterDef: ModelAttributes<Character> = {
  id: {
    type: DataTypes.NUMBER,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hitPointTotal: {
    type: DataTypes.NUMBER,
    allowNull: false,
    defaultValue: 0,
  },
  hitPointMaximum: {
    type: DataTypes.NUMBER,
    allowNull: false,
    defaultValue: 0,
  },
  tempHitPoints: {
    type: DataTypes.NUMBER,
    allowNull: false,
    defaultValue: 0,
  },
  br: { type: DataTypes.SMALLINT, defaultValue: 10 },
  dex: { type: DataTypes.SMALLINT, defaultValue: 10 },
  vit: { type: DataTypes.SMALLINT, defaultValue: 10 },
  int: { type: DataTypes.SMALLINT, defaultValue: 10 },
  cun: { type: DataTypes.SMALLINT, defaultValue: 10 },
  res: { type: DataTypes.SMALLINT, defaultValue: 10 },
  pre: { type: DataTypes.SMALLINT, defaultValue: 10 },
  man: { type: DataTypes.SMALLINT, defaultValue: 10 },
  com: { type: DataTypes.SMALLINT, defaultValue: 10 },
  anh: { type: DataTypes.SMALLINT, defaultValue: 0 },
  ath: { type: DataTypes.SMALLINT, defaultValue: 0 },
  dec: { type: DataTypes.SMALLINT, defaultValue: 0 },
  emp: { type: DataTypes.SMALLINT, defaultValue: 0 },
  inv: { type: DataTypes.SMALLINT, defaultValue: 0 },
  lea: { type: DataTypes.SMALLINT, defaultValue: 0 },
  med: { type: DataTypes.SMALLINT, defaultValue: 0 },
  occ: { type: DataTypes.SMALLINT, defaultValue: 0 },
  perc: { type: DataTypes.SMALLINT, defaultValue: 0 },
  pers: { type: DataTypes.SMALLINT, defaultValue: 0 },
  sub: { type: DataTypes.SMALLINT, defaultValue: 0 },
  ste: { type: DataTypes.SMALLINT, defaultValue: 0 },
  sur: { type: DataTypes.SMALLINT, defaultValue: 0 },
  savingThrows: { type: DataTypes.STRING, defaultValue: "" },
};
