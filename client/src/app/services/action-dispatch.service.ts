import { Injectable, ɵAPP_ID_RANDOM_PROVIDER } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { KeepMode, Roll, RollComponent } from '../model/diceroll';
import {
  Advantage,
  AttackParams,
  CheckParams,
  GameAction,
  HitDieParams,
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
import { AO_HIT_DICE } from '../model/constants';

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
    }
  }

  private dispatchAbilityCheck(
    name: string,
    ability: Ability,
    advantage: Advantage
  ) {
    const roll: Roll = new Roll();
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
    const roll: Roll = new Roll();
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

  private getD20Check(advantage: string) {
    const diceCount = advantage === 'none' ? 1 : 2;
    const keep = 1;
    const keepMode: KeepMode = advantage === 'advantage' ? 'HIGHEST' : 'LOWEST';
    const newLocal = new RollComponent(20, diceCount, keepMode, keep);
    return newLocal;
  }

  private dispatchSkillCheck(
    name: string,
    ability: string,
    skill: string,
    abilityModifier: number,
    skillModifier: number,
    advantage: Advantage
  ) {
    const roll: Roll = new Roll();
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
    const roll: Roll = new Roll();
    roll.title = 'spellatk';
    roll.character = name;
    if (spellName) {
      roll.name = spellName;
    }

    const dieCheckRoll = this.getD20Check(advantage);
    roll.addDie(dieCheckRoll);
    roll.addModifier({ name: 'Spell attack', value: modifier });

    this.sendRoll(roll);
  }

  private dispatchSpell(params: SpellParams) {
    this.characterService
      .getCharacterById(params.characterId)
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
        if (params.castingTier > 0 && params.soulCheck) {
          const soulCheck = new Roll();
          soulCheck.character = character.name;
          soulCheck.title = 'soulcheck';
          soulCheck.target = 12 + params.castingTier;
          soulCheck.name = spell.name;
          soulCheck.addDie(this.getD20Check(params.advantage.soulCheck));
          soulCheck.addModifier({
            name: 'Spell attack',
            value: character.spellAttack,
          });
          this.sendRoll(soulCheck);
        }
        if (spell.attack) {
          this.dispatchSpellAttack(
            character.name,
            character.spellAttack,
            params.advantage.attack,
            spell.name
          );
        }
        if (spell.saveAbility) {
          const spellSave = new Roll();
          spellSave.title = 'spellsave';
          spellSave.character = character.name;
          spellSave.name = spell.name;
          spellSave.addModifier({
            name: spell.saveAbility,
            value: character.spellSave,
          });
          this.sendRoll(spellSave);
        }
        if (spell.damage.length + spell.upcastDamage.length > 0) {
          const spellDamage = this.constructSpellDamage(
            spell,
            params.castingTier,
            character.name
          );
          this.sendRoll(spellDamage);
        }
      });
  }
  private constructSpellDamage(
    spell: Spell,
    castTier: number,
    character: string
  ) {
    const damageRoll: Roll = new Roll();

    damageRoll.character = character;
    damageRoll.title = `spelldmg`;

    const upcast = castTier - spell.tier;
    damageRoll.name = spell.name + (upcast > 0 ? ` (tier ${spell.tier})` : '');

    const damageTotals: { [key: string]: RollComponent } = {};
    for (const damage of spell.damage) {
      damageTotals[damage.type] = { ...damage.roll };
      damageTotals[damage.type].name = damage.type;
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
      .getCharacterById(params.characterId)
      .then((character) => {
        const attack = character.attacks.find((a) => a.id === params.attackId);
        if (!attack) {
          console.error(
            `Character id ${character.id} did not have attack id ${params.attackId}`
          );
          return;
        }

        var toHit = this.composeToHit(attack, character, params.advantage);
        this.sendRoll(toHit);
        var damage = this.composeDamage(attack, character);
        this.sendRoll(damage);
        attack.effects.forEach((ef) => {
          const effectRoll = this.composeEffect(ef, attack, character);
          this.sendRoll(effectRoll);
        });
      });
  }

  private composeEffect(
    effect: AttackEffect,
    attack: CharacterAttack,
    character: Character
  ): Roll {
    const effectRoll = new Roll();
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
  ): Roll {
    const attackRoll = new Roll();
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

  private composeDamage(attack: CharacterAttack, character: Character): Roll {
    const damageRoll = new Roll();
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
  private damageBonus(attack: CharacterAttack, character: Character) {
    if (attack.offhand) {
      return attack.abilities
        .map((ab) => (character.abilities as any)[ab])
        .filter((ab: Ability) => ab.modifier < 0)
        .reduce((sum: number, ab: Ability) => sum + ab.modifier);
    } else {
      return attack.abilities
        .map((ab) => (character.abilities as any)[ab])
        .reduce((sum: number, ab: Ability) => sum + ab.modifier);
    }
  }

  private dispatchHitDice(params: HitDieParams) {
    this.characterService
      .getCharacterById(params.characterId)
      .then((character) => {
        const roll: Roll = new Roll();
        roll.character = character.name;
        roll.name = 'Hit dice';
        roll.title = 'hit-dice';

        for (const size of [6, 8, 10, 12]) {
          const number = (params as any)[size];
          if (number > 0) {
            roll.addDie(new RollComponent(size, number));
          }
        }
        this.sendRoll(roll);
      });
  }
  private dispatchHealthRoll(params: HitDieParams) {
    this.characterService
      .getCharacterById(params.characterId)
      .then((character) => {
        const roll: Roll = new Roll();
        roll.character = character.name;
        roll.name = 'Hit points';
        roll.title = 'hit-points';
        var constantHealth = 0;

        const firstAo = character.selections
          .filter((sel) => sel.isPrimary && sel.takenAtLevel)
          .reduce((a, b) => (a.takenAtLevel! < b.takenAtLevel! ? a : b));
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

  private sendRoll(roll: Roll) {
    if (!roll.id) {
      roll.id = randomId();
    }
    this._rolls.next(roll);
  }
}
