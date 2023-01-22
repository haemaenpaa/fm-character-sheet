import { Sequelize } from "sequelize";
import { AoSelection, AoSelectionDef } from "./ao-selection";
import { Character, CharacterDef } from "./character";

export function initializeSchema(connectionString: string): Sequelize {
  const sequelize = new Sequelize(connectionString);

  const aoSelectionModel = AoSelection.init(AoSelectionDef, {
    sequelize,
    modelName: "AoSelection",
  });

  const characterModel = Character.init(CharacterDef, {
    sequelize,
    modelName: "Character",
  });

  characterModel.hasMany(aoSelectionModel, { as: "selections" });
  aoSelectionModel.belongsTo(characterModel);

  return sequelize;
}
