import { CharacterHitDiceDto } from "fm-transfer-model";
import { app, jsonParser } from "../app";
import { convertHitDiceDbModel } from "../mapper/hit-die-mapper";
import { HitDice, HitDiceRemaining } from "../model/hit-dice";

export const exists = true;

app.get("/api/character/:characterId/hitdice/:selector", (req, res) => {
  const characterId = Number.parseInt(req.params.characterId);
  const hitDiceDto: CharacterHitDiceDto = req.body;

  const selector = req.params.selector;
  var model;
  var foreignKey;
  var convert;
  switch (selector) {
    case "remaining":
      model = HitDiceRemaining;
      foreignKey = "hitDiceRemainingId";
      break;
    case "maximum":
      model = HitDice;
      foreignKey = "hitDiceId";
      break;
    default:
      console.warn(`Attempt to access hitdice/${selector}`);
      res.sendStatus(404);
      return;
  }

  model
    .findOrCreate({
      where: { [foreignKey]: characterId },
    })
    .catch((err) => {
      console.error(
        `Find or create hit dice for character ${characterId} failed.`,
        err
      );
      res.sendStatus(404); //Presume it means character is not present
    })
    .then((result) => {
      if (!result) {
        return;
      }
      if (result[1]) {
        console.warn(`Character ${characterId} did not have hit dice.`);
      }
      const existing = result[0];
      existing
        .update({
          d6: hitDiceDto[6],
          d8: hitDiceDto[8],
          d10: hitDiceDto[10],
          d12: hitDiceDto[12],
        })
        .catch((err) => {
          console.error("Failed to update hit dice");
        })
        .then((updated) => {
          if (updated) {
            res.send(convertHitDiceDbModel(updated));
          }
        });
    });
});

app.put(
  "/api/character/:characterId/hitdice/:selector",
  jsonParser,
  (req, res) => {
    const characterId = Number.parseInt(req.params.characterId);
    const hitDiceDto: CharacterHitDiceDto = req.body;

    const selector = req.params.selector;
    var model;
    var foreignKey;
    switch (selector) {
      case "remaining":
        model = HitDiceRemaining;
        foreignKey = "hitDiceRemainingId";
        break;
      case "maximum":
        model = HitDice;
        foreignKey = "hitDiceId";
        break;
      default:
        console.warn(`Attempt to access hitdice/${selector}`);
        res.sendStatus(404);
        return;
    }

    model
      .findOrCreate({
        where: { [foreignKey]: characterId },
      })
      .catch((err) => {
        console.error(
          `Find or create hit dice for character ${characterId} failed.`,
          err
        );
        res.sendStatus(404); //Presume it hit the character
      })
      .then((result) => {
        if (!result) {
          return;
        }
        if (result[1]) {
          console.warn(`Character ${characterId} did not have hit dice.`);
        }
        const existing = result[0];
        res.send(convertHitDiceDbModel(existing));
      });
  }
);
