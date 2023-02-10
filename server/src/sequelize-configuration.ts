import { Order, OrderItem } from "sequelize";
import { Attack } from "./model/attack";
import { Character } from "./model/character";
import { CharacterSpellbook, Spell } from "./model/character-spells";
import { InventoryContainer } from "./model/inventory";
import { Race } from "./model/race";
import { initializeSchema } from "./model/schema";

const newLocal = process.env.CONNECTION_STRING || "sqlite:dev-db.db";
export const sequelize = initializeSchema(newLocal);
sequelize.sync();

export const spellInclude = [Spell.Damage, Spell.UpcastDamage];
export const spellBookInclude = [
  { association: CharacterSpellbook.Spells, include: spellInclude },
  CharacterSpellbook.Resources,
];
export const attackInclude = [
  { association: Attack.Damage },
  { association: Attack.Effect },
];
export const inventoryContainerInclude = [InventoryContainer.Contents];

export const raceInclude = [Race.Abilities, Race.Resistances];

export const characterInclude = [
  {
    association: Character.Race,
    include: raceInclude,
  },
  Character.Resistances,
  Character.Selections,
  Character.HitDice,
  Character.HitDiceRemaining,
  {
    association: Character.Spellbook,
    include: spellBookInclude,
  },
  {
    association: Character.Attacks,
    include: attackInclude,
  },
  {
    association: Character.Inventory,
    include: inventoryContainerInclude,
  },
  Character.Bio,
  Character.Resources,
];

export const inventoryContainerOrder: OrderItem = [
  InventoryContainer.Contents,
  "idx",
  "ASC",
];

export const inventoryOrder: OrderItem = [Character.Inventory, "idx", "ASC"];

export const characterOrder: Order = [
  inventoryOrder,
  [Character.Inventory, ...inventoryContainerOrder],
];
