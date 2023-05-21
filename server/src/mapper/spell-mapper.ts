import { CharacterSpellsDto, DamageRollDto, SpellDto } from "fm-transfer-model";
import {
  CharacterSpellbook,
  Spell,
  SpellDamage,
  SpellResource,
  UpcastDamage,
} from "../model/character-spells";
import { randomId } from "../model/id-generator";
import { spellInclude } from "../sequelize-configuration";

export function convertSpellbookDto(
  dto: CharacterSpellsDto
): CharacterSpellbook {
  const spellResources: { [key: string]: SpellResource } = {};
  convertSpellSlotResources(dto, spellResources);
  const resources = Object.keys(spellResources).map((k) => spellResources[k]);

  const spells = !dto.spells
    ? []
    : Object.keys(dto.spells)
        .map((k) => convertSpellDto(dto.spells[k]))
        .reduce((out, cur) => out.concat(cur), []);

  return CharacterSpellbook.build(
    {
      id: dto.id,
      spellcastingAbility: dto.spellcastingAbility,
      soulFragments: dto.soulFragments
        ? JSON.stringify(dto.soulFragments)
        : "{}",
      resources,
      spells,
    },
    { include: [CharacterSpellbook.Resources, CharacterSpellbook.Spells] }
  );
}
export function convertSpellbookDbModel(
  model?: CharacterSpellbook
): CharacterSpellsDto | undefined {
  if (!model) {
    return undefined;
  }
  const modelFragments = model.getDataValue("soulFragments");
  const soulFragments = modelFragments ? JSON.parse(modelFragments) : {};
  const souls: { [key: number]: number } = {};
  const spellSlots: { [key: number]: number } = {};
  const specialSlots: { [key: number]: number } = {};
  const spellSlotsAvailable: { [key: number]: number } = {};
  const specialSlotsAvailable: { [key: number]: number } = {};

  const modelResources = model.getDataValue("resources") as SpellResource[];
  if (modelResources) {
    modelResources.forEach((res) => {
      const tier: number = res.getDataValue("tier");
      souls[tier] = res.getDataValue("souls");
      spellSlots[tier] = res.getDataValue("spellSlots");
      specialSlots[tier] = res.getDataValue("specialSlots");
      spellSlotsAvailable[tier] = res.getDataValue("spellSlotsAvailable");
      specialSlotsAvailable[tier] = res.getDataValue("specialSlotsAvailable");
    });
  }
  const modelSpells = model.getDataValue("spells") as Spell[];
  const spells: { [key: number]: SpellDto[] } = {};
  if (modelSpells) {
    modelSpells.forEach((spell) => {
      const tier: number = spell.getDataValue("tier");
      if (!(tier in spells)) {
        spells[tier] = [];
      }
      spells[tier].push(convertSpellDbModel(spell));
    });
  }
  const ret = {
    spellcastingAbility: model.getDataValue("spellcastingAbility"),
    soulFragments,
    souls,
    spellSlots,
    specialSlots,
    spellSlotsAvailable,
    specialSlotsAvailable,
    spells,
  };
  return ret;
}
export function convertSpellDto(dto: SpellDto): Spell {
  const damage: SpellDamage[] = [];
  if (dto.damage) {
    for (const roll of dto.damage) {
      damage.push(
        SpellDamage.build({
          id: roll.id,
          dieCount: roll.dieCount,
          dieSize: roll.dieSize,
          type: roll.type,
        })
      );
    }
  }
  const upcastDamage: UpcastDamage[] = [];
  if (dto.upcastDamage) {
    for (const roll of dto.upcastDamage) {
      upcastDamage.push(
        UpcastDamage.build({
          id: roll.id,
          dieCount: roll.dieCount,
          dieSize: roll.dieSize,
          type: roll.type,
        })
      );
    }
  }
  return Spell.build(
    {
      id: dto.id!,
      tier: dto.tier || 0,
      school: dto.school,
      name: dto.name,
      saveAbility: dto.saveAbility,
      description: dto.description,
      ritual: !!dto.ritual,
      attack: !!dto.attack,
      soulMastery: !!dto.soulMastery,
      castingTime: dto.castingTime,
      duration: dto.duration,
      range: dto.range,
      components: dto.components,
      effect: dto.effect,
      damage,
      upcastDamage,
      addCastingModifierToDamage: !!dto.addCastingModifierToDamage,
    },
    {
      include: spellInclude,
    }
  );
}
export function convertSpellDbModel(model: Spell): SpellDto {
  var damage: DamageRollDto[] = [];
  var upcastDamage: DamageRollDto[] = [];
  const modelDamage = model.getDataValue("damage") as SpellDamage[];
  const modelUpcastDamage = model.getDataValue("upcastDamage") as SpellDamage[];
  if (modelDamage) {
    damage = modelDamage.map((dmg) => ({
      id: dmg.getDataValue("id"),
      dieCount: dmg.getDataValue("dieCount"),
      dieSize: dmg.getDataValue("dieSize"),
      type: dmg.getDataValue("type"),
    }));
  }
  if (modelUpcastDamage) {
    upcastDamage = modelUpcastDamage.map((dmg) => ({
      id: dmg.getDataValue("id"),
      dieCount: dmg.getDataValue("dieCount"),
      dieSize: dmg.getDataValue("dieSize"),
      type: dmg.getDataValue("type"),
    }));
  }

  return {
    id: model.getDataValue("id"),
    tier: model.getDataValue("tier"),
    school: model.getDataValue("school"),
    name: model.getDataValue("name"),
    saveAbility: model.getDataValue("saveAbility"),
    description: model.getDataValue("description"),
    ritual: model.getDataValue("ritual"),
    attack: model.getDataValue("attack"),
    castingTime: model.getDataValue("castingTime"),
    duration: model.getDataValue("duration"),
    range: model.getDataValue("range"),
    components: model.getDataValue("components"),
    damage,
    upcastDamage,
    addCastingModifierToDamage: model.getDataValue(
      "addCastingModifierToDamage"
    ),
  };
}
function convertSpellSlotResources(
  dto: CharacterSpellsDto,
  spellResources: { [key: string]: SpellResource }
) {
  convertField(dto, "spellSlots", spellResources);
  convertField(dto, "specialSlots", spellResources);
  convertField(dto, "spellSlotsAvailable", spellResources);
  convertField(dto, "specialSlotsAvailable", spellResources);
  convertField(dto, "souls", spellResources);
}
function convertField(
  dto: CharacterSpellsDto,
  field: string,
  spellResources: { [key: string]: SpellResource }
) {
  if (dto[field]) {
    for (const tier in dto[field]) {
      ensureTierPresent(dto, tier, spellResources);
      spellResources[tier].setDataValue(field, dto[field][tier]);
    }
  }
}

function ensureTierPresent(
  dto: CharacterSpellsDto,
  tier: string,
  spellResources: { [key: string]: SpellResource }
) {
  if (!(tier in spellResources)) {
    spellResources[tier] = SpellResource.build({
      id: randomId(),
      tier: Number.parseInt(tier),
      SpellbookId: dto.id,
    });
  }
}
