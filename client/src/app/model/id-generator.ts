/**
 * Maximum value for a random numeric identifier.
 */
const IDENTIFIER_MAX = Number.MAX_SAFE_INTEGER;

/**
 *
 * @returns A generated numeric id
 */
export function randomId(): number {
  return Math.floor(Math.random() * IDENTIFIER_MAX);
}

export function randomIdString(): string {
  return `${randomId()}`;
}
