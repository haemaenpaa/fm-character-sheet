/**
 * An item entry in a character's inventory.
 */
export interface ItemDto {
  /**
   * Identifier.
   */
  id?: number;
  /**
   * Item name
   */
  name?: string;
  /**
   * More detailed description of the item.
   */
  description?: string;
  /**
   *Item weight in grams
   */
  weight?: number;
  /**
   * Quantity of the item in inventory
   */
  quantity?: number;
  /**
   * Attunement status
   */
  attunement?: string;
  /**
   * Equip status
   */
  equipped?: string;
}
/**
 * An inventory container, e.g. a backpack.
 */
export interface InventoryContainerDto {
  id?: number;
  /**
   * Name
   */
  name?: string;
  /**
   * Description of the container.
   */
  description?: string;
  /**
   * Base weight in grams.
   */
  baseWeight?: number;
  /**
   * Weight multiplier, in percent. Magic containers might reduce the weight by up to 100%, and cursed containers might increase it.
   */
  weightMultiplierPercent?: number;
  /**
   * The actual contents of the container.
   */
  contents?: ItemDto[];
}
