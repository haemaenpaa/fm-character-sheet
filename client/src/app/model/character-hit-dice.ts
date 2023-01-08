export default interface CharacterHitDice {
  6: number;
  8: number;
  10: number;
  12: number;
}

export function hitDiceSum(input: CharacterHitDice): number {
  var ret = 0;
  for (const key in input) {
    ret += (input as any)[key];
  }
  return ret;
}
