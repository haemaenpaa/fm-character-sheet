import { Sequelize } from "sequelize";
import { AoSelection, AoSelectionDef } from "./ao-selection";
import {
  Attack,
  AttackDamage,
  AttackDef,
  AttackEffect,
  AttackEffectDef,
} from "./attack";
import { Character, CharacterDef } from "./character";
import {
  CharacterSpellbook,
  CharacterSpellbookDef,
  Spell,
  SpellDamage,
  SpellDef,
  SpellResource,
  SpellResourceDef,
  UpcastDamage,
} from "./character-spells";
import { CustomSkill, CustomSkillDef } from "./custom-skill";
import { DamageRollDef } from "./damage-roll";
import { Race, RaceDef, RacialAbility, RacialAbilityDef } from "./race";
import { RacialResistance, Resistance, ResistanceDef } from "./resistance";

export function initializeSchema(connectionString: string): Sequelize {
  const sequelize = new Sequelize(connectionString);

  initModels(sequelize);

  Character.Race = Character.hasOne(Race, { as: "race" });
  Race.Character = Race.belongsTo(Character);

  Race.Resistances = Race.hasMany(RacialResistance, { as: "resistances" });
  Race.Abilities = Race.hasMany(RacialAbility, { as: "abilities" });

  Character.Selections = Character.hasMany(AoSelection, { as: "selections" });
  AoSelection.Character = AoSelection.belongsTo(Character);

  Character.Skills = Character.hasMany(CustomSkill, { as: "customSkills" });
  CustomSkill.Character = CustomSkill.belongsTo(Character);

  Character.Resistances = Character.hasMany(Resistance, { as: "resistances" });

  Character.Spellbook = Character.hasOne(CharacterSpellbook, { as: "spells" });

  CharacterSpellbook.Character = CharacterSpellbook.belongsTo(Character);
  CharacterSpellbook.Spells = CharacterSpellbook.hasMany(Spell, {
    as: "spells",
  });
  CharacterSpellbook.Resources = CharacterSpellbook.hasMany(SpellResource, {
    as: "resources",
  });

  Spell.Damage = Spell.hasMany(SpellDamage, { as: "damage" });
  Spell.UpcastDamage = Spell.hasMany(UpcastDamage, { as: "upcastDamage" });

  Character.Attacks = Character.hasMany(Attack, { as: "attacks" });
  Attack.Damage = Attack.hasMany(AttackDamage, { as: "damage" });
  Attack.Effect = Attack.hasMany(AttackEffect, { as: "effect" });

  return sequelize;
}

function initModels(sequelize: Sequelize) {
  AoSelection.init(AoSelectionDef, {
    sequelize,
    modelName: "AoSelection",
  });

  initResistance(sequelize);

  initRace(sequelize);

  CustomSkill.init(CustomSkillDef, {
    sequelize,
    modelName: "Skill",
  });

  initSpellBook(sequelize);

  initAttacks(sequelize);

  Character.init(CharacterDef, {
    sequelize,
    modelName: "Character",
  });
}

function initAttacks(sequelize: Sequelize) {
  Attack.init(AttackDef, {
    sequelize,
    modelName: "Attack",
  });
  AttackDamage.init(DamageRollDef, {
    sequelize,
    modelName: "AttackDamage",
  });
  AttackEffect.init(AttackEffectDef, {
    sequelize,
    modelName: "AttackEffect",
  });
}

function initSpellBook(sequelize: Sequelize) {
  CharacterSpellbook.init(CharacterSpellbookDef, {
    sequelize,
    modelName: "Spellbook",
  });
  Spell.init(SpellDef, {
    sequelize,
    modelName: "Spell",
  });
  SpellDamage.init(DamageRollDef, {
    sequelize,
    modelName: "SpellDamage",
  });
  UpcastDamage.init(DamageRollDef, {
    sequelize,
    modelName: "UpcastDamage",
  });
  SpellResource.init(SpellResourceDef, {
    sequelize,
    modelName: "SpellResource",
  });
}

function initRace(sequelize: Sequelize) {
  Race.init(RaceDef, {
    sequelize,
    modelName: "Race",
  });
  RacialAbility.init(RacialAbilityDef, {
    sequelize,
    modelName: "RacialAbility",
  });
}

function initResistance(sequelize: Sequelize) {
  Resistance.init(ResistanceDef, {
    sequelize,
    modelName: "Resistance",
  });
  RacialResistance.init(ResistanceDef, {
    sequelize,
    modelName: "RacialResistance",
  });
}
