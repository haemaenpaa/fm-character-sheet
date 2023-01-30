import { app, jsonParser, setHeaders } from "../app";
import { convertBiographyDbModel } from "../mapper/biography-mapper";
import { CharacterBio } from "../model/character-bio";
import { sequelize } from "../sequelize-configuration";

app.get("/api/character/:characterId/biography", async (req, res) => {
  setHeaders(res);
  const characterId = Number.parseInt(req.params["characterId"]);
  const bio = await CharacterBio.findOne({
    where: {
      characterId,
    },
  });
  if (!bio) {
    res.sendStatus(404);
    return;
  }
  res.send(convertBiographyDbModel(bio));
});
