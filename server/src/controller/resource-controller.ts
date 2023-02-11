import { app, jsonParser } from "../app";
import {
  convertResourceDbModel,
  convertResourceDto,
} from "../mapper/resource-mapper";
import { CharacterResource } from "../model/resources";
export const exists = true;

app.get("/api/character/:characterId/resources", (req, res) => {
  const characterId = Number.parseInt(req.params.characterId);
  CharacterResource.findAll({ where: { CharacterId: characterId } }).then(
    (found) => {
      res.send(found.map(convertResourceDbModel));
    },
    (error) => {
      console.error("Failed to fetch resources.", error);
      res.sendStatus(500);
    }
  );
});

app.post(
  "/api/character/:characterId/resources",
  jsonParser,
  async (req, res) => {
    const characterId = Number.parseInt(req.params.characterId);
    const dto = req.body;
    const toCreate = convertResourceDto(dto);
    toCreate.setDataValue("CharacterId", characterId);
    toCreate.save().then(
      (created) => {
        res.send(convertResourceDbModel(created));
      },
      (error) => {
        console.error("Failed to create resource", error);
        res.sendStatus(500);
      }
    );
  }
);

app.put(
  "/api/character/:characterId/resources/:resourceId",
  jsonParser,
  async (req, res) => {
    const characterId = Number.parseInt(req.params.characterId);
    const resourceId = Number.parseInt(req.params.resourceId);
    const dto = req.body;
    const existing = await CharacterResource.findOne({
      where: { id: resourceId, CharacterId: characterId },
    });
    if (!existing) {
      console.error(
        `Character ${characterId} does not have resource ${dto.id}`
      );
      res.send(404);
      return;
    }
    const toUpdate = convertResourceDto(dto);
    toUpdate.setDataValue("CharacterId", characterId);
    toUpdate.setDataValue("id", resourceId);

    existing.update(toUpdate.dataValues).then(
      (updated) => {
        res.send(convertResourceDbModel(updated));
      },
      (error) => {
        console.error("Failed to update resource", error);
        res.sendStatus(500);
      }
    );
  }
);
app.delete(
  "/api/character/:characterId/resources/:resourceId",
  jsonParser,
  async (req, res) => {
    const characterId = Number.parseInt(req.params.characterId);
    const resourceId = Number.parseInt(req.params.resourceId);
    const dto = req.body;
    CharacterResource.destroy({
      where: { id: resourceId, CharacterId: characterId },
    }).then(
      (_) => {
        res.status(200).send();
      },
      (error) => {
        console.error(`Failed to delete resource ${resourceId}`, error);
        res.sendStatus(500);
      }
    );
  }
);
