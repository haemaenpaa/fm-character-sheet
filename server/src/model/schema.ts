import { Sequelize } from "sequelize";
import { AoSelection, AoSelectionDef } from "./ao-selection";
import { Character, CharacterDef } from "./character";
import { Race, RaceDef } from "./race";
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

  const raceModel = Race.init(RaceDef, {
    sequelize,
    modelName: "Race",
  });

  const characterModel = Character.init(CharacterDef, {
    sequelize,
    modelName: "Character",
  });

  characterModel.hasOne(raceModel);
  raceModel.belongsTo(characterModel);

  raceModel.hasMany(resistanceModel);

  characterModel.hasMany(aoSelectionModel, { as: "selections" });
  aoSelectionModel.belongsTo(characterModel);

  characterModel.hasMany(resistanceModel, { as: "resistances" });
  characterModel.sync();

  return sequelize;
}
