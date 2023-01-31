export interface CharacterBiography {
  /**
   * Identifier.
   */
  id: number;
  /**
   * A short blurb describing the character concept.
   */
  concept?: string;
  /**
   * Character's physical appearance
   */
  appearance: string;
  /**
   * Description of the character's soul mark, if any
   */
  soulMarkDescription?: string;
  /**
   * Biography of the character
   */
  characterBiography: string;
  /**
   * Connections of the character; friends, enemies, organizations
   */
  characterConnections: string;
  /**
   * Character height in cm
   */
  height: number;
  /**
   * Character weight in kg
   */
  weight: number;
}
