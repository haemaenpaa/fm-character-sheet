import { CharacterAttackDto } from "fm-transfer-model";
import { app, jsonParser } from "../app";
import {
  convertAttackDbModel,
  convertAttackDto,
} from "../mapper/attack-mapper";
import { Attack, AttackDamage, AttackEffect } from "../model/attack";
import { attackInclude, sequelize } from "../sequelize-configuration";
import { fetchBasicCharacter } from "./controller-utils";

export const exists = true;

app.get("/api/character/:characterId/attacks", async (req, res) => {
  const characterId = Number.parseInt(req.params.characterId);
  const result = await Attack.findAll({
    where: {
      CharacterId: characterId,
    },
  });
  res.send(result.map(convertAttackDbModel));
});

app.post(
  "/api/character/:characterId/attacks",
  jsonParser,
  async (req, res) => {
    const characterId = Number.parseInt(req.params.characterId);

    const character = await fetchBasicCharacter(characterId);
    if (!character) {
      console.error(`Character ${characterId} not found`);
      res.sendStatus(404);
      return;
    }

    const dto: CharacterAttackDto = req.body;
    const toCreate: Attack = convertAttackDto(dto);
    toCreate.setDataValue("CharacterId", characterId);
    toCreate
      .getDataValue("damage")
      .forEach((d: AttackDamage) => d.setDataValue("AttackId", dto.id!));
    toCreate
      .getDataValue("effect")
      .forEach((d: AttackEffect) => d.setDataValue("AttackId", dto.id!));
    Attack.create(toCreate.dataValues, { include: attackInclude })
      .catch((error) => {
        console.error("Could not create attack", error);
        res.sendStatus(500);
      })
      .then((created) => {
        if (created) {
          res.send(convertAttackDbModel(created));
        }
      });
  }
);

app.put(
  "/api/character/:characterId/attacks/:attackId",
  jsonParser,
  async (req, res) => {
    const characterId = Number.parseInt(req.params.characterId);

    const character = await fetchBasicCharacter(characterId);
    if (!character) {
      console.error(`Character ${characterId} not found`);
      res.sendStatus(404);
      return;
    }
    const attackId = Number.parseInt(req.params.attackId);

    const existing = await Attack.findOne({
      where: { id: attackId, CharacterId: characterId },
    });
    if (!existing) {
      console.error(`Character ${characterId} has no attack ${attackId}`);
      res.sendStatus(404);
      return;
    }
    const dto: CharacterAttackDto = req.body;
    const toUpdate: Attack = convertAttackDto(dto);
    toUpdate.setDataValue("CharacterId", characterId);
    toUpdate.setDataValue("id", attackId);
    sequelize.transaction().then(async (transaction) => {
      const updated = await existing
        .update(toUpdate.dataValues)
        .catch((error) => {
          transaction.rollback();
          console.error("Could not create attack", error);
          res.sendStatus(500);
        });
      if (!updated) {
        return;
      }
      const promises: Promise<any>[] = [];
      const damageClear = AttackDamage.destroy({
        where: { AttackId: attackId },
      });
      const effectsClear = AttackEffect.destroy({
        where: { AttackId: attackId },
      });
      if (dto.damage) {
        promises.push(
          damageClear.then((_) =>
            AttackDamage.bulkCreate(
              toUpdate.getDataValue("damage").map((d: AttackDamage) => ({
                ...d.dataValues,
                AttackId: attackId,
              }))
            )
          )
        );
      } else {
        promises.push(damageClear);
      }
      if (dto.effects) {
        promises.push(
          effectsClear.then((_) =>
            AttackEffect.bulkCreate(
              toUpdate.getDataValue("effect").map((d: AttackEffect) => ({
                ...d.dataValues,
                AttackId: attackId,
              }))
            )
          )
        );
      } else {
        promises.push(effectsClear);
      }
      Promise.all(promises)
        .catch((err) => {
          console.error("Failed to update effects or damage", err);
          transaction.rollback();
          res.sendStatus(500);
        })
        .then(async (result) => {
          if (result) {
            await transaction.commit();
            const ret = await Attack.findOne({
              where: { id: attackId },
              include: attackInclude,
            });
            res.send(convertAttackDbModel(ret));
          }
        });
    });
  }
);

app.delete(
  "/api/character/:characterId/attacks/:attackId",
  async (req, res) => {
    const characterId = Number.parseInt(req.params.characterId);

    const character = await fetchBasicCharacter(characterId);
    if (!character) {
      console.error(`Character ${characterId} not found`);
      res.sendStatus(404);
      return;
    }
    const attackId = Number.parseInt(req.params.attackId);

    const existing = await Attack.findOne({
      where: { id: attackId, CharacterId: characterId },
    });
    if (!existing) {
      console.error(`Character ${characterId} has no attack ${attackId}`);
      res.sendStatus(404);
      return;
    }
    await existing.destroy();
    res.status(200).send();
  }
);
