import { Sequelize } from "sequelize";
import { AoSelection, AoSelectionDef } from "./ao-selection";
import { Character, CharacterDef } from "./character";
import { CustomSkill, CustomSkillDef } from "./custom-skill";
import { Race, RaceDef, RacialAbility, RacialAbilityDef } from "./race";
import { RacialResistance, Resistance, ResistanceDef } from "./resistance";

export function initializeSchema(connectionString: string): Sequelize {
  const sequelize = new Sequelize(connectionString);

  AoSelection.init(AoSelectionDef, {
    sequelize,
    modelName: "AoSelection",
  });

  Resistance.init(ResistanceDef, {
    sequelize,
    modelName: "Resistance",
  });
  RacialResistance.init(ResistanceDef, {
    sequelize,
    modelName: "RacialResistance",
  });

  Race.init(RaceDef, {
    sequelize,
    modelName: "Race",
  });
  RacialAbility.init(RacialAbilityDef, {
    sequelize,
    modelName: "RacialAbility",
  });

  const skillModel = CustomSkill.init(CustomSkillDef, {
    sequelize,
    modelName: "Skill",
  });

  const characterModel = Character.init(CharacterDef, {
    sequelize,
    modelName: "Character",
  });

  Character.Race = Character.hasOne(Race, { as: "race" });
  Race.Character = Race.belongsTo(Character);

  Race.Resistances = Race.hasMany(RacialResistance, { as: "resistances" });
  Race.Abilities = Race.hasMany(RacialAbility, { as: "abilities" });

  Character.Selections = Character.hasMany(AoSelection, { as: "selections" });
  AoSelection.Character = AoSelection.belongsTo(Character);

  Character.Skills = Character.hasMany(CustomSkill, { as: "customSkills" });
  CustomSkill.Character = CustomSkill.belongsTo(Character);

  Character.Resistances = Character.hasMany(Resistance, { as: "resistances" });

  return sequelize;
}
