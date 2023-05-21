import { Injectable } from '@angular/core';
import {
  MultiRoll,
  Roll,
  SimpleRoll,
  toCheckArithmetic,
} from '../model/diceroll';
import { article } from 'src/app/utils/grammar-utils';
import { toModifier } from 'src/app/utils/modifier-utils';
import {
  ABILITY_TO_NAME,
  SKILL_DEFAULT_NAME,
  SOUL_CHECK_ROLL_TITLE,
  SPELL_ATTACK_ROLL_TITLE,
  SPELL_DAMAGE_ROLL_TITLE,
  SPELL_SAVE_ROLL_TITLE,
} from 'src/app/model/constants';

import {
  ABILITY_CHECK_PATTERN,
  ABILITY_SAVE_PATTERN,
  SKILL_CHECK_PATTERN,
  SPELL_ATTACK_PATTERN,
  ATTACK_PATTERN,
  HIT_DICE_PATTERN,
  HIT_POINTS_PATTERN,
} from '../model/roll-pattern-constants';

@Injectable({
  providedIn: 'root',
})
export class Roll20MacroService {
  constructor() {}

  getDiceAlgebra(roll: Roll): string {
    if (roll.title?.match(ABILITY_CHECK_PATTERN)?.length) {
      return simpleCheckMacro(roll as SimpleRoll);
    }
    if (roll.title?.match(ABILITY_SAVE_PATTERN)?.length) {
      return savingThrowMacro(roll as SimpleRoll);
    }
    if (roll.title?.match(SKILL_CHECK_PATTERN)) {
      return skillCheckMacro(roll as SimpleRoll);
    }
    if (roll.title?.match(SPELL_ATTACK_PATTERN)) {
      spellAttackMacro(roll as SimpleRoll);
    }
    if (roll.title === 'spell') {
      return spellMacro(roll as MultiRoll);
    }
    if (roll.title?.match(ATTACK_PATTERN)) {
      return attackMacro(roll as MultiRoll);
    }
    if (roll.title?.match(HIT_DICE_PATTERN)) {
      return hitDiceMacro(roll as SimpleRoll);
    }
    if (roll.title?.match(HIT_POINTS_PATTERN)) {
      return healthRollMacro(roll as SimpleRoll);
    }
    if (roll.title === 'initiative') {
      return initiativeMacro(roll as SimpleRoll);
    }
    return 'Unknown roll type ' + roll.title;
  }
}

function simpleCheckMacro(roll: SimpleRoll): string {
  const abilityName = ABILITY_TO_NAME[roll.title!];
  const rolls = roll.dice.map(toCheckArithmetic).join('+');
  const mods = roll.modifiers.map((m) => `${toModifier(m.value)}`).join('');

  const englishArticle = article(abilityName);
  return `/me makes ${englishArticle} ${abilityName} check : [[${rolls}${mods}]]`;
}

function saveAbilities(roll: SimpleRoll): string[] {
  if (!roll.title) {
    return [];
  }
  return roll.title.split('_')[0].split('/');
}

function savingThrowMacro(roll: SimpleRoll) {
  const abilityName = saveAbilities(roll)
    .map((ab) => ABILITY_TO_NAME[ab])
    .join('/');
  const rolls = roll.dice.map(toCheckArithmetic).join('+');
  const mods = roll.modifiers.map((m) => `${toModifier(m.value)}`).join('');
  return `/me makes a ${abilityName} save : [[${rolls}${mods}]]`;
}

function rollSkillName(roll: SimpleRoll): string {
  if (!roll.title) {
    return 'UNKNOWN';
  }
  const skillId = roll.title?.split('_')[1];
  if (skillId in SKILL_DEFAULT_NAME) {
    return SKILL_DEFAULT_NAME[skillId];
  }
  return skillId;
}

function skillCheckMacro(roll: SimpleRoll): string {
  const abl = roll.title!.split('_')[2];
  const rolls = roll.dice.map((d) => `${d.dice}d${d.sides}`).join('+');
  const mods = roll.modifiers.map((m) => `${toModifier(m.value)}`).join('');
  const skillName = rollSkillName(roll);
  const englishArticle = article(skillName);

  return `/me makes ${englishArticle} ${skillName} (${ABILITY_TO_NAME[abl]}) check : [[${rolls}${mods}]]`;
}

function spellAttackMacro(roll: SimpleRoll) {
  const rolls = roll.dice.map((d) => `${d.dice}d${d.sides}`).join('+');
  const mods = roll.modifiers.map((m) => `${toModifier(m.value)}`).join('');
  return `/me makes a spell attack: [[${rolls}${mods}]]`;
}
function spellSaveAbilities(saveVal: string): string[] {
  return saveVal.split('/');
}
function spellMacro(roll: MultiRoll) {
  const spellName = roll.rolls
    .filter((r) => r.name)
    .map((r) => r.name!)
    .find((n) => !!n);
  const soulCheck = roll.rolls.find((r) => r.title === SOUL_CHECK_ROLL_TITLE);
  const spellAttack = roll.rolls.find(
    (r) => r.title === SPELL_ATTACK_ROLL_TITLE
  );
  const spellDamage = roll.rolls.find(
    (r) => r.title === SPELL_DAMAGE_ROLL_TITLE
  );
  const spellSave = roll.rolls.find((r) => r.title === SPELL_SAVE_ROLL_TITLE);

  var macro = `&{template:default}{{name=${spellName}}}`;
  if (soulCheck) {
    const soulDice = soulCheck.dice[0];
    const soulMod = soulCheck.modifiers
      .map((mod) => toModifier(mod.value))
      .join('');
    macro += `{{Soul check = [[{${toCheckArithmetic(soulDice)}${soulMod}}>${
      soulCheck!.target
    }]] success}}`;
  }
  const hasAttack = !!spellAttack;
  if (spellAttack) {
    const attackDice = spellAttack.dice[0];
    const mods = spellAttack.modifiers
      .map((m) => `${toModifier(m.value)}`)
      .join('');
    macro += `{{ To hit = [[${toCheckArithmetic(attackDice)}${mods}]] }}`;
  }
  if (spellSave) {
    macro += spellSave.modifiers
      .map((mod) => {
        const saveNames = spellSaveAbilities(mod.name)
          .map((n) => ABILITY_TO_NAME[n])
          .join('/');
        return `{{ ${saveNames} DV = ${mod.value} }}`;
      })
      .join('');
  }
  if (spellDamage) {
    macro += spellDamage.dice
      .map((damageDice) => {
        const critDamage = hasAttack
          ? `on crit: ${damageDice.dice * damageDice.sides}`
          : '';
        return `{{${damageDice.name} = [[${damageDice.dice}d${
          damageDice.sides
        }${toModifier(damageDice.bonus)}]] ${critDamage}}}`;
      })
      .join('');
  }

  return macro;
}

function attackMacro(roll: MultiRoll) {
  const toHit = roll.rolls.find((sr) => sr.title === 'attack');
  const damage = roll.rolls.find((sr) => sr.title === 'attackdmg');
  const effects = roll.rolls.filter((sr) => sr.title === 'attackeffect');

  var roll20Macro = '&{template:default}';
  if (toHit) {
    roll20Macro += `{{name=${toHit.name}}}`;

    const dice = toHit.dice[0];
    var rollArithmetic = toCheckArithmetic(dice);
    rollArithmetic += toModifier(dice.bonus);

    const mods = toHit.modifiers.map((mod) => toModifier(mod.value)).join('');

    roll20Macro += `{{To Hit=[[${rollArithmetic}${mods}]]}}`;
  }
  if (damage) {
    roll20Macro += damage.dice
      .map((r) => {
        return `{{${r.name} = [[${r.dice}d${r.sides}${toModifier(
          r.bonus
        )}]], crit damage ${r.dice * r.sides}}}`;
      })
      .join('');
  }
  roll20Macro += effects
    .map((effect) => {
      var dv = '';
      if (effect.modifiers.length > 0) {
        dv =
          effect.modifiers
            .map((mod) => {
              const saves = mod.name
                .split('/')
                .map((n) => ABILITY_TO_NAME[n])
                .join('/');
              return `DV ${mod.value} ${saves}`;
            })
            .join() + ' or ';
      }
      return `{{Effect = ${dv}${effect.description}}}`;
    })
    .join('');
  return roll20Macro;
}

function hitDiceMacro(roll: SimpleRoll) {
  const dieCount = roll.dice.reduce((count, d) => count + d.dice, 0);
  const rolls = roll.dice.map(toCheckArithmetic).join('+');
  const mods = roll.modifiers.map((m) => `${toModifier(m.value)}`).join('');
  return `/me rolls ${dieCount} hit dice: [[${rolls}${mods}]]`;
}

function healthRollMacro(roll: SimpleRoll) {
  const rolls = roll.dice.map((d) => `${d.dice}d${d.sides}`).join('+');
  const mods = roll.modifiers.map((m) => `${toModifier(m.value)}`).join('');
  return `Health: [[${rolls}${mods}]]`;
}

function initiativeMacro(roll: SimpleRoll) {
  const rolls = roll.dice.map(toCheckArithmetic).join('+');
  return `&{template:default}{{name=Initiative}}{{Initiative=[[[${rolls}{&{tracker:+}}]]}`;
}
