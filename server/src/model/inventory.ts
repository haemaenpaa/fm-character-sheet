import {
  BelongsTo,
  DataTypes,
  HasMany,
  Model,
  ModelAttributes,
} from "sequelize";

export class Item extends Model {
  static Container: BelongsTo<Item, InventoryContainer>;
}
export class InventoryContainer extends Model {
  static Contents: HasMany<InventoryContainer, Item>;
}

export const ItemDef: ModelAttributes<Item> = {
  id: { type: DataTypes.BIGINT, primaryKey: true },
  name: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  weight: { type: DataTypes.NUMBER },
  quantity: { type: DataTypes.NUMBER },
  attunement: { type: DataTypes.STRING },
  equipped: { type: DataTypes.STRING },
  idx: { type: DataTypes.SMALLINT },
};

export const InventoryContainerDef: ModelAttributes<InventoryContainer> = {
  id: { type: DataTypes.BIGINT, primaryKey: true },
  name: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  baseWeight: { type: DataTypes.NUMBER },
  weightMultiplierPercent: { type: DataTypes.NUMBER, defaultValue: 100 },
  idx: { type: DataTypes.SMALLINT },
};
