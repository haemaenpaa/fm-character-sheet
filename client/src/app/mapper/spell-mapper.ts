import { CharacterSpellsDto, SpellDto } from 'fm-transfer-model';
import { CharacterSpells, Spell } from '../model/character-spells';
import { convertDamageRollModel } from './damage-roll-mapper';

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
  };
}
