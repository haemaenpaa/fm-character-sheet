import { app, jsonParser } from "../app";
import { convertCharacterDbModel } from "../mapper/character-mapper";
import { Character } from "../model/character";

export const exists = true;

const knownAbilities = [
  "br",
  "dex",
  "vit",
  "int",
  "cun",
  "res",
  "pre",
  "man",
  "com",
];

app.get("/api/:characterId/abilities", (req, res) => {
  const character = res.locals.character as Character;
  const dto = convertCharacterDbModel(character);
  res.send(dto.abilities);
});

app.put("/api/:characterId/abilities", jsonParser, (req, res) => {
  const character = res.locals.character as Character;
  const values = {};
  for (const ab of knownAbilities) {
    if (ab in req.body) {
      values[ab] = req.body[ab];
    }
  }
  character.update(values).then(
    (updated) => {
      const dto = convertCharacterDbModel(updated);
      res.send(dto.abilities);
    },
    (error) => {
      console.error("Could not update abilities", error);
      res.sendStatus(500);
    }
  );
});
