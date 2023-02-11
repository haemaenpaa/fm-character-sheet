import { app, jsonParser, setHeaders } from "../app";
import {
  convertBiographyDbModel,
  convertBiographyDto,
} from "../mapper/biography-mapper";
import { CharacterBio } from "../model/character-bio";

export const exists = true;

app.get("/api/character/:characterId/biography", async (req, res) => {
  setHeaders(res);
  const characterId = Number.parseInt(req.params["characterId"]);
  const bio = await CharacterBio.findOne({
    where: {
      biographyId: characterId,
    },
  });
  if (!bio) {
    res.sendStatus(404);
    return;
  }
  res.send(convertBiographyDbModel(bio));
});

app.put(
  "/api/character/:characterId/biography",
  jsonParser,
  async (req, res) => {
    setHeaders(res);
    const characterId = Number.parseInt(req.params["characterId"]);
    const modified = convertBiographyDto(req.body);
    const existing = await CharacterBio.findOne({
      where: {
        biographyId: characterId,
      },
    });
    if (!existing) {
      modified.setDataValue("biographyId", characterId);
      const send = res.send.bind(res);
      const sendStatus = res.sendStatus.bind(res);
      modified
        .save()
        .then((saved) => {
          const resultDto = convertBiographyDbModel(saved);
          res.send(resultDto);
        })
        .catch((err) => {
          console.error("Failed to create biography", err);
          sendStatus(500);
        });
      return;
    }
    existing
      .update(modified.dataValues)
      .then((saved) => {
        const resultDto = convertBiographyDbModel(saved);
        res.send(resultDto);
      })
      .catch((err) => {
        console.error("Failed to update biography", err);
        res.sendStatus(500);
      });
  }
);
