import { Pipe, PipeTransform } from '@angular/core';
import { SKILL_DEFAULT_NAME } from 'src/app/model/constants';
import { Skill } from 'src/app/model/skill';

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
