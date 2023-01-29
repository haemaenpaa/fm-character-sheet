import { InventoryContainerDto, ItemDto } from "fm-transfer-model";
import { InventoryContainer, Item } from "../model/inventory";

export function convertInventoryContainerDto(
  dto: InventoryContainerDto
): InventoryContainer {
  return InventoryContainer.build({
    id: dto.id,
    name: dto.name,
    description: dto.description,
    baseWeight: dto.baseWeight,
    weightMultiplierPercent: dto.weightMultiplierPercent,
    contents: dto.contents?.map(convertItemDto),
  });
}

export function convertItemDto(dto: ItemDto): Item {
  return Item.build({
    id: dto.id,
    name: dto.name,
    description: dto.description,
    weight: dto.weight,
    quantity: dto.quantity,
    attunement: dto.attunement,
    equipped: dto.equipped,
  });
}

export function convertInventoryContainerDbModel(
  model: InventoryContainer
): InventoryContainerDto {
  return {
    id: model.getDataValue("id"),
    name: model.getDataValue("name"),
    description: model.getDataValue("description"),
    baseWeight: model.getDataValue("baseWeight"),
    weightMultiplierPercent: model.getDataValue("weightMultiplierPercent"),
    contents: model.getDataValue("contents")?.map(convertItemDbModel),
  };
}

export function convertItemDbModel(model: Item): ItemDto {
  return {
    id: model.getDataValue("id"),
    name: model.getDataValue("name"),
    description: model.getDataValue("description"),
    weight: model.getDataValue("weight"),
    quantity: model.getDataValue("quantity"),
    attunement: model.getDataValue("attunement"),
    equipped: model.getDataValue("equipped"),
  };
}
