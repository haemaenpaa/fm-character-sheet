/**
 * Model for a character resource, e.g. Rage or Artistic Inspiration.
 */
export interface CharacterResource {
  /**
   * Identifier.
   */
  id: number;
  /**
   * Name of the resource.
   */
  name: string;
  /**
   * Current value of the resource.
   */
  current: number;
  /**
   * Maximum of the resource.
   */
  max: number;
  /**
   * Is this resource restored on a short rest.
   */
  shortRest: boolean;
}
