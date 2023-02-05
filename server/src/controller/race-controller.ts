import { RaceDto } from "fm-transfer-model";
import { app, jsonParser } from "../app";
import { convertRaceDbModel, convertRaceDto } from "../mapper/race-mapper";
import { randomId } from "../model/id-generator";
import { Race, RacialAbility } from "../model/race";
import { RacialResistance } from "../model/resistance";
import { raceInclude, sequelize } from "../sequelize-configuration";

export const exists = true;

app.get("/api/character/:characterId/race", (req, res) => {
  const characterId = Number.parseInt(req.params.characterId);
  Race.findOne({
    where: {
      CharacterId: characterId,
    },
    include: raceInclude,
  }).then(
    (found) => {
      console.log("Found race", found);
      res.send(convertRaceDbModel(found));
    },
    (error) => {
      console.error("Failed to get race", error);
      res.sendStatus(404);
    }
  );
});

app.put("/api/character/:characterId/race", jsonParser, async (req, res) => {
  const characterId = Number.parseInt(req.params.characterId);
  const existing = await Race.findOne({
    where: {
      CharacterId: characterId,
    },
  });

  const dto: RaceDto = req.body;
  const toUpdate = convertRaceDto(dto);
  toUpdate.setDataValue("CharacterId", characterId);
  if (!existing) {
    toUpdate.save().then(
      (created) => {
        res.send(convertRaceDbModel(created));
      },
      (error) => {
        console.error(`Failed to create race`, error);
        res.sendStatus(500);
      }
    );
    return;
  }
  sequelize.transaction().then((transaction) => {
    const raceId = existing.getDataValue("id");
    toUpdate.setDataValue("id", raceId);
    existing
      .update(toUpdate.dataValues)
      .then(async (updated) =>
        Promise.all([
          RacialAbility.destroy({
            where: { RaceId: raceId },
          }),
          RacialResistance.destroy({
            where: { RaceId: raceId },
          }),
        ])
      )
      .then(async (counts) => {
        Promise.all([
          ...toUpdate.getDataValue("abilities").map((ab: RacialAbility) => {
            ab.setDataValue("RaceId", raceId);
            return ab.save();
          }),
          ...toUpdate
            .getDataValue("resistances")
            .map((resistance: RacialResistance) => {
              resistance.setDataValue("RaceId", raceId);
              return resistance.save();
            }),
        ]);
      })
      .then(
        async (result) => {
          if (result !== undefined) {
            transaction.commit();
            const ret = await Race.findOne({
              where: {
                CharacterId: characterId,
              },
              include: raceInclude,
            });
            res.send(convertRaceDbModel(ret));
          }
        },
        (err) => {
          console.error("Failed to update race", err);
          transaction.rollback();
          res.sendStatus(500);
        }
      );
  });
});
