import { Attack } from "./model/attack";
import { Character } from "./model/character";
import { CharacterSpellbook, Spell } from "./model/character-spells";
import { InventoryContainer } from "./model/inventory";
import { Race } from "./model/race";
import { initializeSchema } from "./model/schema";

export const sequelize = initializeSchema("sqlite:dev-db.db");
sequelize.sync();

export const spellInclude = [Spell.Damage, Spell.UpcastDamage];
export const spellBookInclude = [
  { association: CharacterSpellbook.Spells, include: spellInclude },
  CharacterSpellbook.Resources,
];
export const attackInclude = [
  { association: Attack.Damage, as: "damage" },
  { association: Attack.Effect, as: "effect" },
];
export const characterInclude = [
  {
    association: Character.Race,
    include: [Race.Abilities, Race.Resistances],
  },
  Character.Resistances,
  Character.Selections,
  Character.HitDice,
  Character.HitDiceRemaining,
  {
    association: Character.Spellbook,
    include: [
      {
        association: CharacterSpellbook.Spells,
        include: [Spell.Damage, Spell.UpcastDamage],
      },
    ],
  },
  {
    association: Character.Attacks,
    include: attackInclude,
  },
  {
    association: Character.Inventory,
    include: [InventoryContainer.Contents],
  },
  Character.Bio,
  Character.Resources,
];
