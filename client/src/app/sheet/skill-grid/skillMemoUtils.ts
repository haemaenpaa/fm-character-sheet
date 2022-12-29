import Character from 'src/app/model/character';
import { Skill } from 'src/app/model/skill';

function stringHash(val: string) {
  const prime = 31;
  const split: string[] = [...val];
  return split.reduce(
    (acc: number, current: string) => acc * prime + current.charCodeAt(0),
    0
  );
}

export function skillHash(character: Character): number {
  var ret = 0;
  const prime = 31;
  for (const key in character.defaultSkills) {
    ret +=
      prime * ret +
      prime * stringHash(key) +
      (character.defaultSkills as any)[key];
  }

  return ret;
}

function stringArrayEquals(a: string[], b: string[]): boolean {
  if (a.length != b.length) {
    return false;
  }
  return !a.find((s: string, index: number) => s !== b[index]);
}

function skillsEqual(current: Skill, other: Skill): boolean {
  if (other.identifier !== current.identifier) {
    return false;
  }
  if (other.rank !== current.rank) {
    return false;
  }
  if (other.name !== current.name) {
    return false;
  }
  if (!stringArrayEquals(current.defaultAbilities, other.defaultAbilities)) {
    return false;
  }
  return true;
}

export function skillsArrayEqual(a: Skill[], b: Skill[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return (
    a.reduce(
      (equal: boolean, current: Skill, index: number) =>
        equal && skillsEqual(current, b[index]),
      true
    ) || false
  );
}
