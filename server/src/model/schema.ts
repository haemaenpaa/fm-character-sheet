import { Sequelize } from "sequelize";
import { AoSelection, AoSelectionDef } from "./ao-selection";
import {
  Attack,
  AttackDamage,
  AttackDef,
  AttackEffect,
  AttackEffectDef,
} from "./attack";
import { Character, CharacterDef } from "./character";
import { CharacterBio, CharacterBioDef } from "./character-bio";
import {
  CharacterSpellbook,
  CharacterSpellbookDef,
  Spell,
  SpellDamage,
  SpellDef,
  SpellResource,
  SpellResourceDef,
  UpcastDamage,
} from "./character-spells";
import { CustomSkill, CustomSkillDef } from "./custom-skill";
import { DamageRollDef } from "./damage-roll";
import { HitDice, HitDiceDef, HitDiceRemaining } from "./hit-dice";
import {
  InventoryContainer,
  InventoryContainerDef,
  Item,
  ItemDef,
} from "./inventory";
import { Race, RaceDef, RacialAbility, RacialAbilityDef } from "./race";
import { RacialResistance, Resistance, ResistanceDef } from "./resistance";
import {
  CharacterResource,
  CharacterResourceRef as CharacterResourceDef,
} from "./resources";

export function initializeSchema(connectionString: string): Sequelize {
  const sequelize = new Sequelize(connectionString);

  initModels(sequelize);

  associateModels();

  return sequelize;
}

function associateModels() {
  associateRace();

  associateSelections();

  associateSkills();

  Character.Resistances = Character.hasMany(Resistance, { as: "resistances" });

  associateSpells();

  associateAttacks();

  associateHitDice();

  associateInventory();

  associateBio();

  associateResources();
}

function associateResources() {
  Character.Resources = Character.hasMany(CharacterResource, {
    as: "resources",
  });
}

function associateBio() {
  CharacterBio.Character = CharacterBio.belongsTo(Character, {
    as: "character",
  });
  Character.Bio = Character.hasOne(CharacterBio, { as: "biography" });
}

function associateInventory() {
  Character.Inventory = Character.hasMany(InventoryContainer, {
    as: "inventory",
  });
  InventoryContainer.Contents = InventoryContainer.hasMany(Item, {
    as: "contents",
  });
  Item.Container = Item.belongsTo(InventoryContainer);
}

function associateHitDice() {
  Character.HitDice = Character.hasMany(HitDice, { as: "hitDice" });
  Character.HitDiceRemaining = Character.hasMany(HitDiceRemaining, {
    as: "hitDiceRemaining",
  });
}

function associateAttacks() {
  Character.Attacks = Character.hasMany(Attack, { as: "attacks" });
  Attack.Damage = Attack.hasMany(AttackDamage, { as: "damage" });
  Attack.Effect = Attack.hasMany(AttackEffect, { as: "effect" });
}

function associateSpells() {
  Character.Spellbook = Character.hasOne(CharacterSpellbook, { as: "spells" });

  CharacterSpellbook.Character = CharacterSpellbook.belongsTo(Character);
  CharacterSpellbook.Spells = CharacterSpellbook.hasMany(Spell, {
    as: "spells",
  });
  CharacterSpellbook.Resources = CharacterSpellbook.hasMany(SpellResource, {
    as: "resources",
  });

  Spell.Damage = Spell.hasMany(SpellDamage, { as: "damage" });
  Spell.UpcastDamage = Spell.hasMany(UpcastDamage, { as: "upcastDamage" });
}

function associateSkills() {
  Character.Skills = Character.hasMany(CustomSkill, { as: "customSkills" });
  CustomSkill.Character = CustomSkill.belongsTo(Character);
}

function associateSelections() {
  Character.Selections = Character.hasMany(AoSelection, { as: "selections" });
  AoSelection.Character = AoSelection.belongsTo(Character);
}

function associateRace() {
  Character.Race = Character.hasOne(Race, { as: "race" });
  Race.Character = Race.belongsTo(Character);

  Race.Resistances = Race.hasMany(RacialResistance, { as: "resistances" });
  Race.Abilities = Race.hasMany(RacialAbility, { as: "abilities" });
}

function initModels(sequelize: Sequelize) {
  AoSelection.init(AoSelectionDef, {
    sequelize,
    modelName: "AoSelection",
  });

  initResistance(sequelize);

  initRace(sequelize);

  initSkills(sequelize);

  initSpellBook(sequelize);

  initAttacks(sequelize);

  initHitDice(sequelize);

  initInventory(sequelize);

  initBio(sequelize);

  initResource(sequelize);

  Character.init(CharacterDef, {
    sequelize,
    modelName: "Character",
  });
}

function initResource(sequelize: Sequelize) {
  CharacterResource.init(CharacterResourceDef, {
    sequelize,
    modelName: "CharacterResource",
  });
}

function initSkills(sequelize: Sequelize) {
  CustomSkill.init(CustomSkillDef, {
    sequelize,
    modelName: "Skill",
  });
}

function initBio(sequelize: Sequelize) {
  CharacterBio.init(CharacterBioDef, {
    sequelize,
    modelName: "CharacterBio",
  });
}

function initInventory(sequelize: Sequelize) {
  InventoryContainer.init(InventoryContainerDef, {
    sequelize,
    modelName: "InventoryContainer",
  });
  Item.init(ItemDef, {
    sequelize,
    modelName: "Item",
  });
}

function initHitDice(sequelize: Sequelize) {
  HitDice.init(HitDiceDef, { sequelize, modelName: "HitDice" });
  HitDiceRemaining.init(HitDiceDef, {
    sequelize,
    modelName: "HitDiceRemaining",
  });
}

function initAttacks(sequelize: Sequelize) {
  Attack.init(AttackDef, {
    sequelize,
    modelName: "Attack",
  });
  AttackDamage.init(DamageRollDef, {
    sequelize,
    modelName: "AttackDamage",
  });
  AttackEffect.init(AttackEffectDef, {
    sequelize,
    modelName: "AttackEffect",
  });
}

function initSpellBook(sequelize: Sequelize) {
  CharacterSpellbook.init(CharacterSpellbookDef, {
    sequelize,
    modelName: "Spellbook",
  });
  Spell.init(SpellDef, {
    sequelize,
    modelName: "Spell",
  });
  SpellDamage.init(DamageRollDef, {
    sequelize,
    modelName: "SpellDamage",
  });
  UpcastDamage.init(DamageRollDef, {
    sequelize,
    modelName: "UpcastDamage",
  });
  SpellResource.init(SpellResourceDef, {
    sequelize,
    modelName: "SpellResource",
  });
}

function initRace(sequelize: Sequelize) {
  Race.init(RaceDef, {
    sequelize,
    modelName: "Race",
  });
  RacialAbility.init(RacialAbilityDef, {
    sequelize,
    modelName: "RacialAbility",
  });
}

function initResistance(sequelize: Sequelize) {
  Resistance.init(ResistanceDef, {
    sequelize,
    modelName: "Resistance",
  });
  RacialResistance.init(ResistanceDef, {
    sequelize,
    modelName: "RacialResistance",
  });
}
