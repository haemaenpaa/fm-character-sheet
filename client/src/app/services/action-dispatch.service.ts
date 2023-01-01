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
} from '../model/game-action';
import { Ability } from '../model/ability';

function rollId() {
  const idNumber = Math.floor(Math.random() * 2 ** 32);
  var rootStr = idNumber.toString(16);
  while (rootStr.length < 8) {
    rootStr = '0' + rootStr;
  }
  return rootStr;
}
/**
 * A service to dispatch game actions that call for a roll.
 */
@Injectable({
  providedIn: 'root',
})
export class ActionDispatchService {
  private readonly _rolls: Subject<Roll> = new Subject();
  constructor() {}

  public rolls(): Observable<Roll> {
    return this._rolls.asObservable();
  }

  public dispatch(action: GameAction) {
    const params = action.params;
    switch (action.type) {
      case 'ability-check':
        this.dispatchAbilityCheck(
          params.characterName,
          (params as CheckParams).ability,
          params.advantage
        );
        break;
      case 'ability-save':
        this.dispatchSavingThrow(
          params.characterName,
          (params as CheckParams).ability,
          (params as SaveParams).abilities,
          (params as SaveParams).proficiency,
          params.advantage
        );
        break;
      case 'skill-check':
        const skillParams = params as SkillParams;
        this.dispatchSkillCheck(
          params.characterName,
          skillParams.abilityIdentifier,
          skillParams.skillIdentifier,
          skillParams.abilityModifier,
          skillParams.skillModifier,
          skillParams.advantage
        );
        break;
      case 'spell-attack':
        const spellParams = params as SpellAttackParams;
        this.dispatchSpellAttack(
          spellParams.characterName,
          spellParams.abilityIdentifier,
          spellParams.spellAttackBonus,
          spellParams.advantage
        );
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
    ability: string,
    modifier: number,
    advantage: Advantage
  ) {
    const roll: Roll = new Roll();
    roll.title = 'spell_' + ability;
    roll.character = name;

    const dieCheckRoll = this.getD20Check(advantage);
    roll.addDie(dieCheckRoll);
    roll.addModifier({ name: 'Spell attack', value: modifier });

    this.sendRoll(roll);
  }

  private sendRoll(roll: Roll) {
    if (!roll.id) {
      roll.id = rollId();
    }
    this._rolls.next(roll);
  }
}
