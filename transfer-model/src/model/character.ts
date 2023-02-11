import { AoSelectionDto } from "./ao-selection";
import { CharacterAbilitiesDto } from "./character-abilities";
import { CharacterAttackDto } from "./character-attack";
import { CharacterSpellsDto as CharacterSpellsDto } from "./character-spells";
import { RaceDto } from "./race";
import { ResistanceDto } from "./resistance";
import { SkillDto } from "./skill";
import { CharacterHitDiceDto } from "./character-hit-dice";
import { InventoryContainerDto as InventoryContainerDto } from "./item";
import { CharacterBiographyDto as CharacterBiographyDto } from "./character-bio";
import { CharacterResourceDto } from "./character-resource";

export interface DefaultSkillsDto {
  anh?: number;
  ath?: number;
  dec?: number;
  emp?: number;
  inv?: number;
  lea?: number;
  med?: number;
  occ?: number;
  perc?: number;
  pers?: number;
  sub?: number;
  ste?: number;
  sur?: number;
}

/**
 * A single character model, that encapsulates everything contained in a character sheet.
 *
 */
export class CharacterDto {
  id?: number;
  /**
   * Abilities; brawn, dexterity etc.
   */
  abilities?: CharacterAbilitiesDto;
  /**
   * The default skills, always displayed on the character sheet.
   */
  defaultSkills?: DefaultSkillsDto;

  /**
   * Current hit point total.
   */
  hitPointTotal?: number;
  /**
   * Temporary hit points.
   */
  tempHitPoints?: number;
  /**
   * Currently available hit dice.
   */
  hitDiceRemaining?: CharacterHitDiceDto;

  speed?: number;

  public selections?: AoSelectionDto[];
  public customSkills?: SkillDto[];
  public savingThrows?: string[];
  public armorValue?: number;
  public hitPointMaximum?: number;
  public damageResistances?: ResistanceDto[];
  public statusResistances?: ResistanceDto[];
  public spells?: CharacterSpellsDto;
  public attacks?: CharacterAttackDto[];
  public hitDice?: CharacterHitDiceDto;
  public inventory?: InventoryContainerDto[];
  public biography?: CharacterBiographyDto;
  public resources?: CharacterResourceDto[];

  public name?: string;
  public race?: RaceDto;
}
