import { app, jsonParser, setHeaders } from "../app";
import {
  sequelize,
  spellBookInclude,
  spellInclude,
} from "../sequelize-configuration";
import {
  convertSpellbookDbModel,
  convertSpellbookDto,
  convertSpellDbModel,
  convertSpellDto,
} from "../mapper/spell-mapper";
import {
  CharacterSpellbook,
  Spell,
  SpellDamage,
  SpellResource,
  UpcastDamage,
} from "../model/character-spells";
import { randomId } from "../model/id-generator";
import { SpellDto } from "fm-transfer-model";

export const exists = true;
console.log("Registering spellbook controller.");

app.get("/api/character/:characterId/spellbook", async (req, res) => {
  setHeaders(res);
  const characterId = Number.parseInt(req.params["characterId"]);
  const found = await CharacterSpellbook.findOne({
    where: { spellId: characterId },
    include: spellBookInclude,
  });
  if (!found) {
    res.sendStatus(404);
  } else {
    res.send(convertSpellbookDbModel(found));
  }
});

app.put(
  "/api/character/:characterId/spellbook",
  jsonParser,
  async (req, res) => {
    setHeaders(res);
    const characterId = Number.parseInt(req.params["characterId"]);
    const toModify = convertSpellbookDto(req.body);
    toModify.setDataValue("spellId", characterId);
    const found = await CharacterSpellbook.findOne({
      where: { spellId: characterId },
      include: [CharacterSpellbook.Spells, CharacterSpellbook.Resources],
    });
    if (!found) {
      toModify
        .save()
        .catch((err) => {
          console.error(
            `Could not create spellbook for character ${characterId}`,
            err
          );
          res.send(500);
        })
        .then(async (modified) => {
          if (!modified) {
            return;
          }
          const ret = await CharacterSpellbook.findOne({
            where: { id: modified.getDataValue("id") },
            include: spellBookInclude,
          });
          res.send(convertSpellbookDbModel(ret));
        });
    } else {
      toModify.setDataValue("id", found.getDataValue("id"));
      const transaction = await sequelize.transaction();
      found
        .update(toModify.dataValues)
        .catch((err) => {
          console.error(
            `Could not update spellbook for character ${characterId}`,
            err
          );
          transaction.rollback();
          res.send(500);
        })
        .then(async (modified) => {
          if (!modified) {
            return;
          }

          await SpellResource.destroy({
            where: { SpellbookId: toModify.getDataValue("id") },
          });
          await SpellResource.bulkCreate(
            toModify.getDataValue("resources").map((r) => ({
              ...r.dataValues,
              SpellbookId: toModify.getDataValue("id"),
            }))
          );
          await transaction.commit();
          const ret = await CharacterSpellbook.findOne({
            where: { id: modified.getDataValue("id") },
            include: spellBookInclude,
          });

          res.send(convertSpellbookDbModel(ret));
        });
    }
  }
);

app.get("/api/character/:characterId/spells/:spellId", (req, res) => {
  setHeaders(res);
  const spellId = Number.parseInt(req.params["spellId"]);
  Spell.findOne({ where: { id: spellId }, include: spellInclude })
    .catch((err) => {
      console.error(`Failed to fetch spell by id ${spellId}`, err);
      res.sendStatus(500);
    })
    .then((spell) => {
      if (spell) {
        res.send(convertSpellDbModel(spell));
      }
    });
});

app.post(
  "/api/character/:characterId/spells/",
  jsonParser,
  async (req, res) => {
    setHeaders(res);
    const characterId = Number.parseInt(req.params["characterId"]);
    const spellbook = await CharacterSpellbook.findOne({
      where: { spellId: characterId },
      include: spellBookInclude,
    });
    if (!spellbook) {
      console.error(`Character ${characterId} does not have a spellbook.`);
      res.sendStatus(404);
      return;
    }

    const dto: SpellDto = req.body;
    const spell = convertSpellDto(dto);
    const spellbookId = spellbook.getDataValue("id");
    spell.setDataValue("SpellbookId", spellbookId);
    if (!dto.id) {
      spell.setDataValue("id", randomId());
    }
    const SpellId = spell.getDataValue("id");
    sequelize.transaction().then((transaction) => {
      const promises: Promise<any>[] = [];
      promises.push(spell.save());
      if (dto.damage) {
        dto.damage.map((dmg) => {
          const createPromise = SpellDamage.create({
            id: dmg.id || randomId(),
            SpellId,
            dieCount: dmg.dieCount,
            dieSize: dmg.dieSize,
            type: dmg.type,
          });
          promises.push(createPromise);
        });
      }
      if (dto.upcastDamage) {
        dto.upcastDamage.map((dmg) => {
          const createPromise = UpcastDamage.create({
            id: dmg.id || randomId(),
            SpellId,
            dieCount: dmg.dieCount,
            dieSize: dmg.dieSize,
            type: dmg.type,
          });
          promises.push(createPromise);
        });
      }
      Promise.all(promises)
        .catch((err) => {
          console.error("Error creating spell", err);
          transaction.rollback();
          res.sendStatus(500);
        })
        .then(async (result) => {
          if (result) {
            const ret = await Spell.findOne({
              where: { id: SpellId, SpellbookId: spellbookId },
              include: spellInclude,
            });
            res.send(convertSpellDbModel(ret));
          }
        });
    });
  }
);

app.put(
  "/api/character/:characterId/spells/:spellId",
  jsonParser,
  async (req, res) => {
    setHeaders(res);
    const characterId = Number.parseInt(req.params["characterId"]);
    const spellId = Number.parseInt(req.params["spellId"]);
    const spellbook = await CharacterSpellbook.findOne({
      where: { spellId: characterId },
    });
    if (!spellbook) {
      console.error(`Character ${characterId} does not have a spellbook.`);
      res.sendStatus(404);
      return;
    }
    const dto: SpellDto = req.body;
    const toModify = convertSpellDto(dto);
    const found = await Spell.findOne({
      where: { id: spellId, SpellbookId: spellbook.getDataValue("id") },
    });
    if (!found) {
      console.error(
        `Character ${characterId} does not have a spell by id ${spellId}.`
      );
      res.sendStatus(404);
      return;
    }
    const transaction = await sequelize.transaction();
    found
      .update(toModify.dataValues, { include: spellInclude })
      .catch((err) => {
        console.error(`Failed to update spell ${spellId}`, err);
        transaction.rollback();
        res.sendStatus(500);
      })
      .then(async (result) => {
        if (result) {
          const promises: Promise<any>[] = [];
          await SpellDamage.destroy({ where: { SpellId: spellId } });
          await UpcastDamage.destroy({ where: { SpellId: spellId } });
          if (dto.damage) {
            promises.push(
              SpellDamage.bulkCreate(
                toModify.getDataValue("damage").map((d: SpellDamage) => ({
                  ...d.dataValues,
                  SpellId: spellId,
                }))
              )
            );
          }
          if (dto.upcastDamage) {
            promises.push(
              UpcastDamage.bulkCreate(
                toModify
                  .getDataValue("upcastDamage")
                  .map((d: UpcastDamage) => ({
                    ...d.dataValues,
                    SpellId: spellId,
                  }))
              )
            );
          }
          Promise.all(promises)
            .catch((error) => {
              console.error("Failure updating damages.", error);
              transaction.rollback();
              res.sendStatus(500);
            })
            .then(async (result) => {
              if (result) {
                await transaction.commit();
                const ret = await Spell.findOne({
                  where: { id: spellId },
                  include: spellInclude,
                });
                console.log("Updated: ", ret.dataValues);
                res.send(convertSpellDbModel(ret));
              }
            });
        }
      });
  }
);

app.delete(
  "/api/character/:characterId/spells/:spellId",
  jsonParser,
  async (req, res) => {
    setHeaders(res);
    const characterId = Number.parseInt(req.params["characterId"]);
    const spellId = Number.parseInt(req.params["spellId"]);
    const spellbook = await CharacterSpellbook.findOne({
      where: { spellId: characterId },
      include: spellBookInclude,
    });
    if (!spellbook) {
      console.error(`Character ${characterId} does not have a spellbook.`);
      res.sendStatus(404);
      return;
    }
    const toModify = convertSpellDto(req.body);
    Spell.destroy({
      where: { id: spellId, SpellbookId: spellbook.getDataValue("id") },
    })
      .catch((err) => {
        console.error("Error deleting spell", err);
        res.sendStatus(500);
      })
      .then((count) => {
        if (count >= 0) {
          res.send();
        }
      });
  }
);
