export function toModifier(modifier: number | undefined): string {
  if (!modifier) {
    return '';
  }
  if (modifier < 0) {
    return `${modifier}`;
  }
  return `+${modifier}`;
}
