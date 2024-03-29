import {
  BelongsTo,
  DataTypes,
  HasMany,
  Model,
  ModelAttributes,
} from "sequelize";

/**
 * The "Spellbook" section of the character.
 */
export class CharacterSpellbook extends Model {
  static Spells: HasMany<CharacterSpellbook, Spell>;
  static Resources: HasMany<CharacterSpellbook, SpellResource>;
}
/**
 * Spell definition.
 */
export class Spell extends Model {
  static Damage: HasMany<Spell, SpellDamage>;
  static UpcastDamage: HasMany<Spell, UpcastDamage>;
}
/**
 * Damage roll for spell.
 */
export class SpellDamage extends Model {}
/**
 * Upcast damage for spell.
 */
export class UpcastDamage extends Model {}

/**
 * The various resources of a given tier. Namely, spells and slots.
 */
export class SpellResource extends Model {}

export const SpellDef: ModelAttributes<Spell> = {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  tier: {
    type: DataTypes.NUMBER,
    defaultValue: 0,
  },
  school: {
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING,
  },
  saveAbility: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
  ritual: {
    type: DataTypes.BOOLEAN,
  },
  attack: {
    type: DataTypes.BOOLEAN,
  },
  soulMastery: {
    type: DataTypes.BOOLEAN,
  },
  castingTime: {
    type: DataTypes.STRING,
  },
  duration: {
    type: DataTypes.STRING,
  },
  range: {
    type: DataTypes.STRING,
  },
  component: {
    type: DataTypes.STRING,
  },
  effect: {
    type: DataTypes.STRING,
  },
  addCastingModifierToDamage: {
    type: DataTypes.BOOLEAN,
  },
};

export const CharacterSpellbookDef: ModelAttributes<CharacterSpellbook> = {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  spellcastingAbility: {
    type: DataTypes.STRING,
  },
  /**
   * Just stringify the JSON object.
   */
  soulFragments: {
    type: DataTypes.TEXT,
  },
};

export const SpellResourceDef: ModelAttributes<SpellResource> = {
  tier: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  spellSlots: {
    type: DataTypes.NUMBER,
    allowNull: true,
  },
  specialSlots: {
    type: DataTypes.NUMBER,
    allowNull: true,
  },
  spellSlotsAvailable: {
    type: DataTypes.NUMBER,
    allowNull: true,
  },
  specialSlotsAvailable: {
    type: DataTypes.NUMBER,
    allowNull: true,
  },
  souls: {
    type: DataTypes.NUMBER,
    allowNull: true,
  },
};
