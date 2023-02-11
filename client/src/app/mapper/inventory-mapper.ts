import { InventoryContainerDto, ItemDto } from 'fm-transfer-model';
import { randomId } from '../model/id-generator';
import {
  AttunementStatus,
  EquipStatus,
  InventoryContainer,
  Item,
} from '../model/item';

export function convertInventoryContainerDto(
  dto: InventoryContainerDto
): InventoryContainer {
  return {
    id: dto.id || randomId(),
    name: dto.name || '',
    description: dto.description || '',
    baseWeight: dto.baseWeight || 0,
    weightMultiplierPercent: dto.weightMultiplierPercent || 100,
    contents: dto.contents?.map(convertItemDto) || [],
  };
}
export function convertInventoryContainerModel(
  model: InventoryContainer
): InventoryContainerDto {
  return {
    id: model.id,
    name: model.name,
    description: model.description,
    baseWeight: model.baseWeight,
    weightMultiplierPercent: model.weightMultiplierPercent,
    contents: model.contents?.map(convertItemModel),
  };
}
export function convertItemDto(dto: ItemDto): Item {
  return {
    id: dto.id || randomId(),
    name: dto.name || '',
    description: dto.description || '',
    weight: dto.weight || 0,
    quantity: dto.quantity || 1,
    attunement: (dto.attunement as AttunementStatus) || 'none',
    equipped: (dto.equipped as EquipStatus) || 'unequipped',
  };
}
export function convertItemModel(model: Item): ItemDto {
  return {
    id: model.id,
    name: model.name,
    description: model.description,
    weight: model.weight,
    quantity: model.quantity,
    attunement: model.attunement,
    equipped: model.equipped,
  };
}
