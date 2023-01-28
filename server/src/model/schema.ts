import { Sequelize } from "sequelize";
import { AoSelection, AoSelectionDef } from "./ao-selection";
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

  Character.init(CharacterDef, {
    sequelize,
    modelName: "Character",
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
