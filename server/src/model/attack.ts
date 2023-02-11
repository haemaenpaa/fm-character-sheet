import { DataTypes, HasMany, Model, ModelAttributes } from "sequelize";

export class Attack extends Model {
  static Damage: HasMany<Attack, AttackDamage>;
  static Effect: HasMany<Attack, AttackEffect>;
}
export class AttackDamage extends Model {}
export class AttackEffect extends Model {}

export const AttackDef: ModelAttributes<Attack> = {
  id: { type: DataTypes.BIGINT, primaryKey: true },
  name: { type: DataTypes.STRING },
  range: { type: DataTypes.STRING },
  /**
   * Comma separated list
   */
  abilities: { type: DataTypes.STRING },
  proficient: { type: DataTypes.BOOLEAN },
  attackBonus: { type: DataTypes.NUMBER },
  offhand: { type: DataTypes.BOOLEAN },
};
export const AttackEffectDef: ModelAttributes<AttackEffect> = {
  id: { type: DataTypes.NUMBER, primaryKey: true },
  saveAbility: { type: DataTypes.STRING },
  dv: { type: DataTypes.NUMBER },
  description: { type: DataTypes.TEXT },
};
