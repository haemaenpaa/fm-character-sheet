import { Injectable, ɵAPP_ID_RANDOM_PROVIDER } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { KeepMode, Roll, RollComponent } from '../model/diceroll';
import {
  Advantage,
  CheckParams,
  GameAction,
  SaveParams,
  SkillParams,
  SpellAttackParams,
  SpellParams,
} from '../model/game-action';
import { Ability } from '../model/ability';
import { CharacterService } from './character.service';
import { Spell } from '../model/character-spells';
import { randomId } from '../model/id-generator';

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

  private sendRoll(roll: Roll) {
    if (!roll.id) {
      roll.id = randomId();
    }
    this._rolls.next(roll);
  }
}
