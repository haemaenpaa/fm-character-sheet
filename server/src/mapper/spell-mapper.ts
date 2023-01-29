import { CharacterSpellsDto, SpellDto } from "fm-transfer-model";
import {
  CharacterSpellbook,
  Spell,
  SpellDamage,
  SpellResource,
  UpcastDamage,
} from "../model/character-spells";

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
  return CharacterSpellbook.build({
    spellcastingAbility: dto.spellcastingAbility,
    soulFragments: dto.soulFragments ? JSON.stringify(dto.soulFragments) : "{}",
    resources,
    spells,
  });
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
  return Spell.build({
    id: dto.id!,
    tier: dto.tier || 0,
    school: dto.school,
    name: dto.name,
    saveAbility: dto.saveAbility,
    description: dto.description,
    ritual: !!dto.ritual,
    attack: !!dto.attack,
    castingTime: dto.castingTime,
    duration: dto.duration,
    range: dto.range,
    components: dto.components,
    effect: dto.effect,
    damage,
    upcastDamage,
  });
}

function convertSpellSlotResources(
  dto: CharacterSpellsDto,
  spellResources: { [key: string]: SpellResource }
) {
  convertField(dto, "spellSlots", spellResources);
  convertField(dto, "specialSlots", spellResources);
  convertField(dto, "spellSlotsAvailable", spellResources);
  convertField(dto, "specialSlotsAvailable", spellResources);
}
function convertField(
  dto: CharacterSpellsDto,
  field: string,
  spellResources: { [key: string]: SpellResource }
) {
  if (dto[field]) {
    for (const tier in dto[field]) {
      ensureTierPresent(tier, spellResources);
      spellResources[tier].setDataValue(field, dto[field][tier]);
    }
  }
}

function ensureTierPresent(
  tier: string,
  spellResources: { [key: string]: SpellResource }
) {
  if (!(tier in spellResources)) {
    spellResources[tier] = SpellResource.build({
      tier: Number.parseInt(tier),
    });
  }
}
