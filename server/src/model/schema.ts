import { Sequelize } from "sequelize";
import { AoSelection, AoSelectionDef } from "./ao-selection";
import { Character, CharacterDef } from "./character";
import { Resistance, ResistanceDef } from "./resistance";

export function initializeSchema(connectionString: string): Sequelize {
  const sequelize = new Sequelize(connectionString);

  const aoSelectionModel = AoSelection.init(AoSelectionDef, {
    sequelize,
    modelName: "AoSelection",
  });

  const resistanceModel = Resistance.init(ResistanceDef, {
    sequelize,
    modelName: "Resistance",
  });

  const characterModel = Character.init(CharacterDef, {
    sequelize,
    modelName: "Character",
  });

  characterModel.hasMany(aoSelectionModel, { as: "selections" });
  aoSelectionModel.belongsTo(characterModel);

  characterModel.hasMany(resistanceModel, { as: "resistances" });

  return sequelize;
}
