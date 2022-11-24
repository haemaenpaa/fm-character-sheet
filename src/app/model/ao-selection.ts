/**
 * A single Ability Origin selection. This indicates a level gained, and the ability gained from the level.
 */
export class AoSelection {
  /**
   * Name of the ability origin.
   */
  abilityOrigin: string = '';
  /**
   * Level of the AO this selection is from.
   */
  level: number = 0;
  /**
   * Name of the selection
   */
  name: string = '';
  /**
   * Detailed description of the selection
   */
  description: string = '';
  /**
   * A hilight color for the selection, for accessibility.
   */
  hilightColor: string | null = null;
  /**
   * Is this a primary selection. Secondary selections don't count towards total level.
   */
  isPrimary: boolean = true;
}
