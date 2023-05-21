import { Injectable, ɵAPP_ID_RANDOM_PROVIDER } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  KeepMode,
  MultiRoll,
  Roll,
  RollComponent,
  SimpleRoll,
} from '../model/diceroll';
import {
  Advantage,
  AttackParams,
  CheckParams,
  GameAction,
  HitDieParams,
  InitiativeParams,
  SaveParams,
  SkillParams,
  SpellAttackParams,
  SpellParams,
} from '../model/game-action';
import { Ability } from '../model/ability';
import { CharacterService } from './character.service';
import { Spell } from '../model/character-spells';
import { randomId } from '../model/id-generator';
import CharacterAttack, { AttackEffect } from '../model/character-attack';
import Character from '../model/character';
import { __values } from 'tslib';
import {
  AO_HIT_DICE,
  SOUL_CHECK_ROLL_TITLE,
  SPELL_ATTACK_ROLL_TITLE,
  SPELL_DAMAGE_ROLL_TITLE,
  SPELL_ROLL_TITLE,
  SPELL_SAVE_ROLL_TITLE,
} from '../model/constants';

/**
 * A service to dispatch game actions that call for a roll.
 */
@Injectable({
  providedIn: 'root',
})
export class ActionDispatchService {
  private readonly _rolls: Subject<Roll> = new Subject();
  constructor(private characterService: CharacterService) {}

  public rolls(): Observable<Roll> {
    return this._rolls.asObservable();
  }

  public dispatch(action: GameAction) {
    const params = action.params;
    switch (action.type) {
      case 'ability-check':
        const checkParams = params as CheckParams;
        this.dispatchAbilityCheck(
          checkParams.characterName,
          checkParams.ability,
          checkParams.advantage
        );
        break;
      case 'ability-save':
        const saveParams = params as SaveParams;
        this.dispatchSavingThrow(
          saveParams.characterName,
          saveParams.ability,
          saveParams.abilities,
          saveParams.proficiency,
          saveParams.advantage
        );
        break;
      case 'skill-check':
        const skillParams = params as SkillParams;
        this.dispatchSkillCheck(
          skillParams.characterName,
          skillParams.abilityIdentifier,
          skillParams.skillIdentifier,
          skillParams.abilityModifier,
          skillParams.skillModifier,
          skillParams.advantage
        );
        break;
      case 'spell-attack':
        const spellAttackParams = params as SpellAttackParams;
        this.dispatchSpellAttack(
          spellAttackParams.characterName,
          spellAttackParams.spellAttackBonus,
          spellAttackParams.advantage
        );
        break;
      case 'spell':
        const spellParams = params as SpellParams;
        this.dispatchSpell(spellParams);
        break;
      case 'attack':
        const attackParams = params as AttackParams;
        this.dispatchAttack(attackParams);
        break;
      case 'hit-die':
        this.dispatchHitDice(params as HitDieParams);
        break;
      case 'health-roll':
        this.dispatchHealthRoll(params as HitDieParams);
        break;
      case 'initiative':
        this.dispatchInitiative(params as InitiativeParams);
        break;
    }
  }

  private dispatchAbilityCheck(
    name: string,
    ability: Ability,
    advantage: Advantage
  ) {
    const roll: Roll = new SimpleRoll();
    roll.title = ability.identifier;
    roll.character = name;

    const dieCheckRoll = this.getD20Check(advantage);
    roll.addDie(dieCheckRoll);
    roll.addModifier({ name: ability.identifier, value: ability.modifier });

    this.sendRoll(roll);
  }
  private dispatchSavingThrow(
    name: string,
    ability: Ability,
    abilities: string[],
    proficiency: number | null,
    advantage: Advantage
  ) {
    const roll: Roll = new SimpleRoll();
    roll.title = abilities.join('/') + '_save';
    roll.character = name;

    const dieCheckRoll = this.getD20Check(advantage);
    roll.addDie(dieCheckRoll);
    roll.addModifier({
      name: ability.identifier,
      value: ability.modifier,
    });
    if (proficiency) {
      roll.addModifier({
        name: 'proficiency',
        value: proficiency,
      });
    }

    this.sendRoll(roll);
  }

  private getD20Check(advantage: string, modifier: number = 0) {
    const diceCount = advantage === 'none' ? 1 : 2;
    const keep = 1;
    const keepMode: KeepMode = advantage === 'advantage' ? 'HIGHEST' : 'LOWEST';
    const d20Check = new RollComponent(20, diceCount, keepMode, keep);
    d20Check.bonus = modifier;
    return d20Check;
  }

  private dispatchSkillCheck(
    name: string,
    ability: string,
    skill: string,
    abilityModifier: number,
    skillModifier: number,
    advantage: Advantage
  ) {
    const roll: Roll = new SimpleRoll();
    roll.title = `skill_${skill}_${ability}`;
    roll.character = name;
    const dieCheckRoll = this.getD20Check(advantage);

    roll.addDie(dieCheckRoll);
    roll.addModifier({ name: ability, value: abilityModifier });
    roll.addModifier({ name: skill, value: skillModifier });
    this.sendRoll(roll);
  }

  private dispatchSpellAttack(
    name: string,
    modifier: number,
    advantage: Advantage,
    spellName: string | null = null
  ) {
    const roll: Roll = this.constructSpellAttack(
      name,
      spellName,
      advantage,
      modifier
    );

    this.sendRoll(roll);
  }

  private constructSpellAttack(
    name: string,
    spellName: string | null,
    advantage: string,
    modifier: number
  ) {
    const roll: Roll = new SimpleRoll();
    roll.title = SPELL_ATTACK_ROLL_TITLE;
    roll.character = name;
    if (spellName) {
      roll.name = spellName;
    }

    const dieCheckRoll = this.getD20Check(advantage);
    roll.addDie(dieCheckRoll);
    roll.addModifier({ name: 'Spell attack', value: modifier });
    return roll;
  }

  private dispatchSpell(params: SpellParams) {
    this.characterService
      .getCachedCharacterById(params.characterId)
      .then((character) => {
        const characterName = character.name;
        const spell = character.spells.spells[params.spellTier].find(
          (s) => s.id === params.spellId
        );
        if (!spell) {
          console.error(
            `No spell of id ${params.spellId} of tier ${params.spellTier}`
          );
          return;
        }
        const spellRoll: MultiRoll = { title: SPELL_ROLL_TITLE, rolls: [] };

        if (params.castingTier > 0 && params.soulCheck) {
          const soulCheck = new SimpleRoll();
          soulCheck.character = character.name;
          soulCheck.title = SOUL_CHECK_ROLL_TITLE;
          soulCheck.target = 12 + params.castingTier;
          soulCheck.name = spell.name;
          soulCheck.addDie(this.getD20Check(params.advantage.soulCheck));
          soulCheck.addModifier({
            name: 'Spell attack modifier',
            value: character.spellAttack,
          });
          spellRoll.rolls.push(soulCheck);
        }
        if (spell.attack) {
          const attack = this.constructSpellAttack(
            character.name,
            spell.name,
            params.advantage.attack,
            character.spellAttack
          );
          spellRoll.rolls.push(attack);
        }
        if (spell.saveAbility) {
          const spellSave = new SimpleRoll();
          spellSave.title = SPELL_SAVE_ROLL_TITLE;
          spellSave.character = character.name;
          spellSave.name = spell.name;
          spellSave.addModifier({
            name: spell.saveAbility,
            value: character.spellSave,
          });
          spellRoll.rolls.push(spellSave);
        }
        if (
          spell.damage.length + spell.upcastDamage.length > 0 ||
          spell.addCastingModifierToDamage
        ) {
          const spellDamage = this.constructSpellDamage(
            spell,
            params.castingTier,
            character
          );
          spellRoll.rolls.push(spellDamage);
        }

        this.sendRoll(spellRoll);
      });
  }
  private constructSpellDamage(
    spell: Spell,
    castTier: number,
    character: Character
  ) {
    const damageRoll: Roll = new SimpleRoll();

    damageRoll.character = character.name;
    damageRoll.title = SPELL_DAMAGE_ROLL_TITLE;
    const upcast = castTier - spell.tier;
    damageRoll.name = spell.name + (upcast > 0 ? ` (tier ${spell.tier})` : '');

    const damageTotals: { [key: string]: RollComponent } = {};
    for (const damage of spell.damage) {
      damageTotals[damage.type] = { ...damage.roll };
      damageTotals[damage.type].name = damage.type;
    }

    if (spell.addCastingModifierToDamage && character.castingAbility) {
      const bonus = damageTotals[Object.keys(damageTotals)[0]].bonus || 0;
      damageTotals[Object.keys(damageTotals)[0]].bonus =
        bonus + character.castingAbility.modifier;
    }
    if (upcast > 0) {
      for (const damage of spell.upcastDamage) {
        if (!(damage.type in damageTotals)) {
          damageTotals[damage.type] = { ...damage.roll };
          damageTotals[damage.type].name;
          damageTotals[damage.type].dice *= upcast;
          damageTotals[damage.type].keep *= upcast;
        } else if (damageTotals[damage.type].sides !== damage.roll.sides) {
          const upcastComponent =
            damageTotals[damage.type + ' upcast'] ||
            new RollComponent(damage.roll.sides, 0, 'HIGHEST', 0, damage.type);
          upcastComponent.dice += upcast * damage.roll.dice;
          upcastComponent.keep += upcast * damage.roll.dice;
          damageTotals[damage.type + ' upcast'] = upcastComponent;
        } else {
          damageTotals[damage.type].dice += upcast * damage.roll.dice;
          damageTotals[damage.type].keep += upcast * damage.roll.dice;
        }
      }
    }
    for (const key in damageTotals) {
      damageRoll.addDie(damageTotals[key]);
    }
    return damageRoll;
  }

  private dispatchAttack(params: AttackParams) {
    this.characterService
      .getCachedCharacterById(params.characterId)
      .then((character) => {
        const attack = character.attacks.find((a) => a.id === params.attackId);
        if (!attack) {
          console.error(
            `Character id ${character.id} did not have attack id ${params.attackId}`
          );
          return;
        }
        const attackRoll: MultiRoll = {
          title: 'attack',
          rolls: [],
        };
        var toHit = this.composeToHit(attack, character, params.advantage);
        attackRoll.rolls.push(toHit);

        var damage = this.composeDamage(attack, character);
        attackRoll.rolls.push(damage);

        attack.effects.forEach((ef) => {
          const effectRoll = this.composeEffect(ef, attack, character);
          attackRoll.rolls.push(effectRoll);
        });
        this.sendRoll(attackRoll);
      });
  }

  private composeEffect(
    effect: AttackEffect,
    attack: CharacterAttack,
    character: Character
  ): SimpleRoll {
    const effectRoll = new SimpleRoll();
    effectRoll.title = 'attackeffect';
    effectRoll.name = attack.name;
    effectRoll.character = character.name;
    if (effect.save) {
      effectRoll.addModifier({ name: effect.save, value: effect.dv! });
    }
    effectRoll.description = effect.description;
    return effectRoll;
  }

  private composeToHit(
    attack: CharacterAttack,
    character: Character,
    advantage: Advantage
  ): SimpleRoll {
    const attackRoll = new SimpleRoll();
    attackRoll.title = 'attack';
    attackRoll.character = character.name;
    attackRoll.name = attack.name;
    attackRoll.addDie(this.getD20Check(advantage));
    attackRoll.addModifier({ name: 'Base bonus', value: attack.attackBonus });
    if (attack.proficient) {
      attackRoll.addModifier({
        name: 'Proficiency',
        value: character.proficiency,
      });
    }
    attack.abilities.forEach((ab) => {
      attackRoll.addModifier({
        name: ab,
        value: (character.abilities as any)[ab].modifier,
      });
    });
    return attackRoll;
  }

  private composeDamage(
    attack: CharacterAttack,
    character: Character
  ): SimpleRoll {
    const damageRoll = new SimpleRoll();
    damageRoll.title = 'attackdmg';
    damageRoll.character = character.name;
    damageRoll.name = attack.name;
    attack.damage.forEach((dmg) => {
      damageRoll.addDie({ ...dmg.roll, name: dmg.type });
    });
    if (damageRoll.dice.length > 0) {
      const rollBonus = damageRoll.dice[0].bonus;
      const abilityBonus = this.damageBonus(attack, character);
      damageRoll.dice[0].bonus = rollBonus
        ? rollBonus + abilityBonus
        : abilityBonus;
    } else {
      attack.abilities.forEach((ab) => {
        const ability: Ability = (character.abilities as any)[ab];
        damageRoll.addModifier({
          name: ability.identifier,
          value: attack.offhand
            ? Math.min(ability.modifier, 0)
            : ability.modifier,
        });
      });
    }
    console.log('damage roll', damageRoll);
    return damageRoll;
  }
  private damageBonus(attack: CharacterAttack, character: Character): number {
    if (attack.offhand) {
      return attack.abilities
        .map((ab) => (character.abilities as any)[ab])
        .filter((ab: Ability) => ab.modifier < 0)
        .reduce((sum: number, ab: Ability) => sum + ab.modifier, 0);
    } else {
      return attack.abilities
        .map((ab) => (character.abilities as any)[ab])
        .reduce((sum: number, ab: Ability) => sum + ab.modifier, 0);
    }
  }

  private dispatchHitDice(params: HitDieParams) {
    this.characterService
      .getCachedCharacterById(params.characterId)
      .then((character) => {
        const roll: Roll = new SimpleRoll();
        roll.character = character.name;
        roll.name = 'Hit dice';
        roll.title = 'hit-dice';

        var total = 0;
        for (const size of [6, 8, 10, 12]) {
          const number = (params as any)[size];
          if (number > 0) {
            roll.addDie(new RollComponent(size, number));
            total += number;
          }
        }
        roll.addModifier({
          value: total * character.abilities.vit.modifier,
          name: 'vitality',
        });

        this.sendRoll(roll);
      });
  }
  private dispatchHealthRoll(params: HitDieParams) {
    this.characterService
      .getCachedCharacterById(params.characterId)
      .then((character) => {
        const roll: Roll = new SimpleRoll();
        roll.character = character.name;
        roll.name = 'Hit points';
        roll.title = 'hit-points';
        var constantHealth = 0;

        const firstAo = character.selections.find(
          (sel) => sel.isPrimary && sel.takenAtLevel === 1
        );
        if (firstAo && firstAo.abilityOrigin in AO_HIT_DICE) {
          (params as any)[AO_HIT_DICE[firstAo.abilityOrigin]] -= 1;
          constantHealth = AO_HIT_DICE[firstAo.abilityOrigin];
        }

        for (const size of [6, 8, 10, 12]) {
          const number = (params as any)[size];
          if (number > 0) {
            const actualSize = Math.floor(size / 2);
            const component: RollComponent = new RollComponent(
              actualSize,
              number
            );
            constantHealth += actualSize;
            roll.addDie(component);
          }
        }
        roll.addModifier({ name: 'baseline', value: constantHealth });
        this.sendRoll(roll);
      });
  }

  private dispatchInitiative(params: InitiativeParams) {
    this.characterService
      .getCachedCharacterById(params.characterId)
      .then((character) => {
        const modifier = character.abilities.dex.modifier;
        const roll = new SimpleRoll();
        roll.title = 'initiative';
        roll.addDie(this.getD20Check(params.advantage, modifier));
        roll.character = character.name;
        this.sendRoll(roll);
      });
  }

  private sendRoll(roll: Roll) {
    if (roll instanceof SimpleRoll && !roll.id) {
      roll.id = randomId();
    }
    this._rolls.next(roll);
  }
}
