import { Pipe, PipeTransform } from '@angular/core';
import { Skill } from 'src/app/model/skill';
const SKILL_DEFAULT_NAME: { [key: string]: string } = {
  anh: 'Animal handling',
  ath: 'Athletics',
  dec: 'Deception',
  emp: 'Empathy',
  inv: 'Investigation',
  lea: 'Leadership',
  med: 'Medicine',
  occ: 'Occult',
  perc: 'Perception',
  pers: 'Persuasion',
  sub: 'Subterfuge',
  ste: 'Stealth',
  sur: 'Survival',
};
@Pipe({
  name: 'skillName',
})
export class SkillNamePipe implements PipeTransform {
  transform(skill: Skill): unknown {
    if (skill.identifier in SKILL_DEFAULT_NAME) {
      return SKILL_DEFAULT_NAME[skill.identifier];
    }
    if (skill.name) {
      return skill.name;
    }
    return 'UNKNOWN SKILL';
  }
}
