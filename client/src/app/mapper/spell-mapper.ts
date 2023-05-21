import { CharacterSpellsDto, SpellDto } from 'fm-transfer-model';
import { CharacterSpells, Spell } from '../model/character-spells';
import {
  convertDamageRollDto,
  convertDamageRollModel,
} from './damage-roll-mapper';

export function convertSpellBookModel(
  model: CharacterSpells
): CharacterSpellsDto {
  const spells: { [key: number]: SpellDto[] } = {};
  for (const tier in model.spells) {
    spells[tier] = model.spells[tier].map(convertSpellModel);
  }
  return {
    id: model.id,
    spellcastingAbility: model.spellcastingAbility,
    soulFragments: { ...model.soulFragments },
    souls: { ...model.souls },
    spellSlots: { ...model.spellSlots },
    spellSlotsAvailable: { ...model.spellSlotsAvailable },
    specialSlots: { ...model.specialSlots },
    specialSlotsAvailable: { ...model.specialSlotsAvailable },
    spells,
  };
}

export function convertSpellbookDto(dto: CharacterSpellsDto): CharacterSpells {
  const spells: { [key: number]: Spell[] } = {};
  if (dto.spells) {
    for (const tier in dto.spells) {
      spells[tier] = dto.spells[tier].map(convertSpellDto);
    }
  }
  const ret: CharacterSpells = {
    id: dto.id || -1,
    soulFragments: dto.soulFragments ? { ...dto.soulFragments } : {},
    souls: dto.souls || {},
    spellSlots: dto.spellSlots || {},
    spellSlotsAvailable: dto.spellSlotsAvailable || {},
    specialSlots: dto.specialSlots || {},
    specialSlotsAvailable: dto.specialSlotsAvailable || {},
    spells,
  };
  return ret;
}
export function convertSpellModel(model: Spell): SpellDto {
  return {
    id: model.id,
    tier: model.tier,
    school: model.school,
    name: model.name,
    saveAbility: model.saveAbility,
    description: model.description,
    damage: model.damage.map(convertDamageRollModel),
    upcastDamage: model.upcastDamage.map(convertDamageRollModel),
    ritual: model.ritual,
    soulMastery: model.soulMastery,
    concentration: model.concentration,
    attack: model.attack,
    castingTime: model.castingTime,
    duration: model.duration,
    range: model.range,
    components: model.components,
    effect: model.effect,
    addCastingModifierToDamage: model.addCastingModifierToDamage,
  };
}

export function convertSpellDto(model: SpellDto): Spell {
  return {
    id: model.id || -1,
    tier: model.tier || 0,
    school: model.school || '',
    name: model.name || '',
    saveAbility: model.saveAbility,
    description: model.description || '',
    damage: model.damage?.map(convertDamageRollDto) || [],
    upcastDamage: model.upcastDamage?.map(convertDamageRollDto) || [],
    ritual: !!model.ritual,
    soulMastery: !!model.soulMastery,
    concentration: !!model.concentration,
    attack: !!model.attack,
    castingTime: model.castingTime || '',
    duration: model.duration || '',
    range: model.range || '',
    components: model.components || '',
    effect: model.effect || '',
    addCastingModifierToDamage: !!model.addCastingModifierToDamage,
  };
}
