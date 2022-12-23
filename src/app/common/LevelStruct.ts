import Character from '../model/character';

/**
 * Structure for AO level display.
 */
export interface LevelStruct {
  abilityOrigin: string;
  level: number;
}

/**
 * Gets the level structs of a character. These are easier to display.
 * @param character character whose levels to parse.
 * @returns
 */
export function levelStructs(character: Character | null) {
  if (!character) {
    return [];
  }
  var ret: LevelStruct[] = [];
  const aoLevels = character.getAoLevels();
  for (let ao in aoLevels) {
    ret.push({ abilityOrigin: ao, level: aoLevels[ao] });
  }
  return ret;
}
