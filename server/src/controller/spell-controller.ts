import { app, jsonParser, setHeaders } from "../app";
import { sequelize } from "../sequelize-configuration";
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
  UpcastDamage,
} from "../model/character-spells";
import { randomId } from "../model/id-generator";
import { DamageRollDto, SpellDto } from "fm-transfer-model";
import { DamageRollDef } from "../model/damage-roll";

export const exists = true;
console.log("Registering spellbook controller.");

const spellInclude = [Spell.Damage, Spell.UpcastDamage];
const spellBookInclude = [
  { association: CharacterSpellbook.Spells, include: spellInclude },
  CharacterSpellbook.Resources,
];

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
    const found = await CharacterSpellbook.findOne({
      where: { spellbookId: characterId },
      include: [CharacterSpellbook.Spells, CharacterSpellbook.Resources],
    });
    if (!found) {
      toModify.setDataValue("spellId", characterId);
      toModify
        .save()
        .catch((err) => {
          console.error(err);
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
              where: { id: SpellId, SpellbookId: spellBookInclude },
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
      include: spellBookInclude,
    });
    if (!spellbook) {
      console.error(`Character ${characterId} does not have a spellbook.`);
      res.sendStatus(404);
      return;
    }
    const toModify = convertSpellDto(req.body);
    const found = await Spell.findOne({
      where: { spellId, SpellbookId: spellbook.getDataValue("id") },
    });
    if (!found) {
      console.error(
        `Character ${characterId} does not have a spell by id ${spellId}.`
      );
      res.sendStatus(404);
      return;
    }
    found
      .update(toModify.dataValues, { include: spellInclude })
      .catch((err) => {
        console.log(`Failed to update spell ${spellId}`, err);
        res.sendStatus(500);
      })
      .then((result) => {
        if (result) {
          res.send(convertSpellDbModel(result));
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
      where: { spellId, SpellbookId: spellbook.getDataValue("id") },
    })
      .catch((err) => {
        console.error("Error deleting spell", err);
        res.sendStatus(500);
      })
      .then((_) => {
        res.sendStatus(200);
      });
  }
);

app.put(
  "/api/character/:characterId/spells/:spellId/:damageCategory",
  jsonParser,
  async (req, res) => {
    const category = req.params["damageCategory"];
    if (category !== "damage" && category !== "upcastDamage") {
      console.error(`No damage category ${category} exists for spells.`);
      res.send(400);
      return;
    }
    setHeaders(res);
    const characterId = Number.parseInt(req.params["characterId"]);
    const spellId = Number.parseInt(req.params["spellId"]);

    const damageDto: DamageRollDto = req.body;
    const damageId = damageDto.id;

    const spellbook = await CharacterSpellbook.findOne({
      where: { spellId: characterId },
      include: spellBookInclude,
    });
    if (!spellbook) {
      console.error(`Character ${characterId} does not have a spellbook.`);
      res.sendStatus(404);
      return;
    }
    const spellbookId = spellbook.getDataValue("id");
    const spell = Spell.findOne({
      where: {
        id: spellId,
        SpellbookId: spellbookId,
      },
    });
    if (!spell) {
      console.error(`No spell ${spellId} in spellbook ${spellbookId}`);
      res.sendStatus(404);
      return;
    }
    const damageModel =
      category === "upcastDamage" ? UpcastDamage : SpellDamage;

    const existing = await damageModel.findOne({
      where: {
        id: damageId,
        SpellId: spellId,
      },
    });
    if (!existing) {
      damageModel
        .create({
          id: damageDto.id,
          SpellId: spellId,
          dieSize: damageDto.dieSize,
          dieCount: damageDto.dieCount,
          type: damageDto.type,
        })
        .catch((err) => {
          console.error("Failed to create spell damage:", err);
          res.sendStatus(500);
        })
        .then((created) => {
          if (created) {
            const returnDto: DamageRollDto = convertDamageDto(created);
            res.send(returnDto);
          }
        });
    } else {
      existing
        .update({
          dieCount: damageDto.dieCount,
          dieSize: damageDto.dieSize,
          type: damageDto.type,
        })
        .catch((err) => {
          console.error("Failed to create spell damage:", err);
          res.sendStatus(500);
        })
        .then((updated) => {
          if (updated) {
            const returnDto = convertDamageDto(updated);
            res.send(returnDto);
          }
        });
    }
  }
);

app.delete(
  "/api/character/:characterId/spells/:spellId/:damageCategory",
  jsonParser,
  async (req, res) => {
    const category = req.params["damageCategory"];
    if (category !== "damage" && category !== "upcastDamage") {
      console.error(`No damage category ${category} exists for spells.`);
      res.send(400);
      return;
    }
    setHeaders(res);
    const characterId = Number.parseInt(req.params["characterId"]);
    const spellId = Number.parseInt(req.params["spellId"]);

    const damageDto: DamageRollDto = req.body;
    const damageId = damageDto.id;

    const spellbook = await CharacterSpellbook.findOne({
      where: { spellId: characterId },
      include: spellBookInclude,
    });
    if (!spellbook) {
      console.error(`Character ${characterId} does not have a spellbook.`);
      res.sendStatus(404);
      return;
    }
    const spellbookId = spellbook.getDataValue("id");
    const spell = Spell.findOne({
      where: {
        id: spellId,
        SpellbookId: spellbookId,
      },
    });
    if (!spell) {
      console.error(`No spell ${spellId} in spellbook ${spellbookId}`);
      res.sendStatus(404);
      return;
    }
    const damageModel =
      category === "upcastDamage" ? UpcastDamage : SpellDamage;
    damageModel
      .destroy({
        where: {
          id: damageId,
          SpellId: spellId,
        },
      })
      .catch((err) => {
        console.log("Failed to delete spell damage", err);
        res.send(500);
      })
      .then((count) => {
        if (count) {
          res.sendStatus(200);
        }
      });
  }
);
function convertDamageDto(created: UpcastDamage | SpellDamage): DamageRollDto {
  return {
    id: created.getDataValue("id"),
    dieCount: created.getDataValue("dieCount"),
    dieSize: created.getDataValue("dieSize"),
    type: created.getDataValue("type"),
  };
}
