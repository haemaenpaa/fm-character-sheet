import { CharacterDto } from "fm-transfer-model/src/model/character";
import {
  convertCharacterDbModel,
  convertCharacterDto,
} from "../mapper/character-mapper";
import { randomId } from "../model/id-generator";
import { characterInclude, sequelize } from "../sequelize-configuration";
import { app, setHeaders, jsonParser } from "../app";
import { Character } from "../model/character";
import { convertRaceDto } from "../mapper/race-mapper";
import { convertSpellbookDto } from "../mapper/spell-mapper";
import {
  convertHitDiceDto,
  convertHitDiceRemainingDto,
} from "../mapper/hit-die-mapper";
import { convertBiographyDto } from "../mapper/biography-mapper";

export const exists = true;

app.get("/api/characters", async (req, res) => {
  sequelize
    .model("Character")
    .findAll({ include: characterInclude })
    .then((characters) => {
      setHeaders(res);
      res.send(characters.map(convertCharacterDbModel));
    });
});
app.get("/api/character/:characterId", async (req, res) => {
  setHeaders(res);
  const characterId = Number.parseInt(req.params.characterId);
  if (isNaN(characterId)) {
    res.sendStatus(400);
    return;
  }
  sequelize
    .model("Character")
    .findOne({ where: { id: characterId }, include: characterInclude })
    .then((character) => {
      if (!character) {
        res.sendStatus(404);
        return;
      }
      res.send(convertCharacterDbModel(character));
    });
});
app.post("/api/character/", jsonParser, async (req, res) => {
  setHeaders(res);
  const character = req.body as CharacterDto;
  if (!character.id) {
    character.id = randomId();
  }
  const dbCharacter = convertCharacterDto(character);
  console.log("creating character:", dbCharacter.dataValues);
  sequelize.transaction().then((transaction) => {
    Character.create(dbCharacter.dataValues, { include: characterInclude })
      .then(async (created) => {
        const characterId = created.getDataValue("id");
        const creates = [];
        if (character.race) {
          const race = convertRaceDto(character.race);
          race.setDataValue("id", characterId);
          race.setDataValue("raceId", characterId);
          creates.push(race.save());
        }
        if (character.spells) {
          const spells = convertSpellbookDto(character.spells);
          if (!character.spells.id) {
            spells.setDataValue("id", characterId);
          }
          spells.setDataValue("spellId", characterId);
          creates.push(spells.save());
        }
        if (character.hitDice) {
          const hitDice = convertHitDiceDto(character.hitDice);
          hitDice.setDataValue("hitDiceId", characterId);
          creates.push(hitDice.save());
        }
        if (character.hitDiceRemaining) {
          const hitDiceRemaining = convertHitDiceRemainingDto(
            character.hitDiceRemaining
          );
          hitDiceRemaining.setDataValue("hitDiceRemainingId", characterId);
          creates.push(hitDiceRemaining.save());
        }

        if (character.biography) {
          const bio = convertBiographyDto(character.biography);
          bio.setDataValue("id", characterId);
          bio.setDataValue("biographyId", characterId);
          creates.push(bio.save());
        }
        await Promise.all(creates)
          .catch((error) => {
            transaction.rollback();
            console.error("Failed to create character data", error);
            res.sendStatus(500);
          })
          .then(async (_) => await transaction.commit());
        Character.findOne({
          where: { id: characterId },
          include: characterInclude,
        }).then((found) => {
          console.log("Created final:", found.dataValues);
          res.send(convertCharacterDbModel(found));
        });
      })
      .catch((err) => {
        console.error(err);
        transaction.rollback();
        res.sendStatus(500);
      });
  });
});
app.put("/api/character/:characterId", jsonParser, async (req, res) => {
  setHeaders(res);
  const characterId = Number.parseInt(req.params.characterId);
  const character = req.body as CharacterDto;
  if (character.id !== characterId) {
    res.sendStatus(400);
    return;
  }
  console.log("Update request", character);

  const dbCharacter = convertCharacterDto(character);
  const existing = await Character.findOne({
    where: { id: characterId },
    include: characterInclude,
  });
  if (existing) {
    const result = await existing.update(dbCharacter.dataValues);
    console.log("Update result:", result.dataValues);
    const ret = await Character.findOne({
      where: { id: characterId },
      include: characterInclude,
    });
    res.send(convertCharacterDbModel(ret));
  } else {
    res.sendStatus(404);
  }
});
app.delete("/api/character/:characterId", async (req, res) => {
  setHeaders(res);
  const characterId = Number.parseInt(req.params.characterId);
  const characterModel = sequelize.model("Character");
  const existing = await characterModel.findOne({
    where: { id: characterId },
    include: characterInclude,
  });
  if (!existing) {
    res.sendStatus(200);
  } else {
    existing
      .destroy()
      .then((_) => {
        res.sendStatus(200);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  }
});
