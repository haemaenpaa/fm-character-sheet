import Character from 'src/app/model/character';
import { Skill } from 'src/app/model/skill';

const skillOrder = (x: Skill, y: Skill): number =>
  Number.parseInt(x.identifier) - Number.parseInt(y.identifier);
function stringHash(val?: string): number {
  if (!val) {
    return 0;
  }
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
    ret =
      prime * ret +
      prime * stringHash(key) +
      (character.defaultSkills as any)[key];
  }

  return ret;
}

export function customSkillHash(character: Character): number {
  var ret = 0;
  const prime = 31;
  const maximum = 2 ** 32;
  for (const skill of character.customSkills.sort(skillOrder)) {
    var individualHash =
      Number.parseInt(skill.identifier) +
      stringHash(skill.name) +
      skill.rank +
      skill.defaultAbilities.reduce((h, abl) => h * prime + stringHash(abl), 0);
    ret = (prime * ret + individualHash) % maximum;
  }
  return ret;
}

function stringArrayEquals(a: string[], b: string[]): boolean {
  if (a.length != b.length) {
    return false;
  }
  return a.reduce((eq, aVal, idx) => eq && aVal === b[idx], true);
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
    console.log(current.defaultAbilities, other.defaultAbilities);
    return false;
  }
  return true;
}

export function skillsArrayEqual(a: Skill[], b: Skill[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  const sortedA = a.sort(skillOrder);
  const sortedB = b.sort(skillOrder);
  for (const idx in sortedA) {
    if (!skillsEqual(sortedA[idx], sortedB[idx])) {
      return false;
    }
  }
  return true;
}
