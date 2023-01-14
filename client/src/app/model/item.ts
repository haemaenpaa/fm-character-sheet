export type AttunementStatus = 'none' | 'unattuned' | 'attuned';
export type EquipStatus = 'none' | 'unequipped' | 'equipped';
/**
 * An item entry in a character's inventory.
 */
export interface Item {
  /**
   * Identifier.
   */
  id: number;
  /**
   * Item name
   */
  name: string;
  /**
   * More detailed description of the item.
   */
  description: string;
  /**
   *Item weight in grams
   */
  weight: number;
  /**
   * Quantity of the item in inventory
   */
  quantity: number;
  /**
   * Attunement status
   */
  attunement: AttunementStatus;
  /**
   * Equip status
   */
  equipped: EquipStatus;
}
/**
 * An inventory container, e.g. a backpack.
 */
export interface InventoryContainer {
  id: number;
  /**
   * Name
   */
  name: string;
  /**
   * Description of the container.
   */
  description: string;
  /**
   * Base weight in grams.
   */
  baseWeight: number;
  /**
   * Weight multiplier, in percent. Magic containers might reduce the weight by up to 100%, and cursed containers might increase it.
   */
  weightMultiplierPercent: number;
  /**
   * The actual contents of the container.
   */
  contents: Item[];
}

export function containerWeight(container: InventoryContainer): number {
  var ret = container.baseWeight;
  for (const item of container.contents) {
    ret +=
      (item.weight * item.quantity * container.weightMultiplierPercent) / 100.0;
  }
  return Math.round(ret);
}
