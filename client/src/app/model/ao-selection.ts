/**
 * A single Ability Origin selection. This indicates a level gained, and the ability gained from the level.
 */
export interface AoSelection {
  id: number;
  /**
   * Name of the ability origin.
   */
  abilityOrigin: string;
  /**
   * Level of the AO this selection is from.
   */
  level: number;
  /**
   * Name of the selection
   */
  name: string;
  /**
   * Detailed description of the selection
   */
  description: string;
  /**
   * A hilight color for the selection, for accessibility.
   */
  hilightColor?: string;
  /**
   * Is this a primary selection. Secondary selections don't count towards total level.
   */
  isPrimary: boolean;
  /**
   * Character level this selection was taken on.
   */
  takenAtLevel: number;
}
