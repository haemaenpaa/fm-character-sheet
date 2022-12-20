/**
 * Type of resistance; 'resistance' means half damage or advantage, 'immunity' means no damage or effect.
 */
export type ResistanceType = 'resistance' | 'immunity';
/**
 * A structure for damage or effect resistance.
 */
export default interface Resistance {
  type: ResistanceType;
  value: string;
}
