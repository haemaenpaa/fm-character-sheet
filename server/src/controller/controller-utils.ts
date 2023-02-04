import { Character } from "../model/character";

/**
 * Function to fetch a character without association. Useful for checking for a character's existence.
 * @param characterId
 * @returns
 */
export function fetchBasicCharacter(characterId: number): Promise<Character> {
  return Character.findOne({
    where: { id: characterId },
  });
}
