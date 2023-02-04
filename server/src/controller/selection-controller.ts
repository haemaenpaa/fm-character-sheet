import { AoSelectionDto } from "fm-transfer-model";
import { app, jsonParser, setHeaders } from "../app";
import {
  convertSelectionDbModel,
  convertSelectionDto,
} from "../mapper/selection-mapper";
import { AoSelection } from "../model/ao-selection";
import { Character } from "../model/character";
import { randomId } from "../model/id-generator";

export const exists = true;

app.get("/api/character/:characterId/selections", async (req, res) => {
  const characterId = Number.parseInt(req.params.characterId);
  const result = await AoSelection.findAll({
    where: {
      CharacterId: characterId,
    },
  });
  res.send(result.map(convertSelectionDbModel));
});

app.post(
  "/api/character/:characterId/selections",
  jsonParser,
  async (req, res) => {
    const characterId = Number.parseInt(req.params.characterId);
    const character = await fetchCharacter(characterId);
    if (!character) {
      console.error(`Character ${characterId} not found.`);
      res.sendStatus(404);
      return;
    }
    const dto = req.body as AoSelectionDto;
    const toCreate = convertSelectionDto(dto);
    if (!dto.id) {
      toCreate.setDataValue("id", randomId());
    }
    toCreate.setDataValue("CharacterId", characterId);
    toCreate
      .save()
      .catch((err) => {
        console.error("Failed to create new Ao Selection", err);
        res.sendStatus(500);
      })
      .then((saved) => {
        if (saved) {
          res.send(convertSelectionDbModel(saved));
        }
      });
  }
);

app.put(
  "/api/character/:characterId/selections/:selectionId",
  jsonParser,
  async (req, res) => {
    const characterId = Number.parseInt(req.params.characterId);
    const character = await fetchCharacter(characterId);
    const selectionId = Number.parseInt(req.params.selectionId);
    if (!character) {
      console.error(`Character ${characterId} not found.`);
      res.sendStatus(404);
      return;
    }
    const dto = req.body as AoSelectionDto;
    const toUpdate = convertSelectionDto(dto);
    toUpdate.setDataValue("id", selectionId);
    toUpdate.setDataValue("CharacterId", characterId);

    const existing = await AoSelection.findOne({
      where: { id: selectionId, CharacterId: characterId },
    });
    if (!existing) {
      console.error(
        `Character ${characterId} does not have selection ${dto.id}`
      );
      res.sendStatus(404);
      return;
    }
    existing
      .update(toUpdate.dataValues)
      .catch((err) => {
        console.error("Failed to update Ao Selection", err);
        res.sendStatus(500);
      })
      .then((saved) => {
        if (saved) {
          res.send(convertSelectionDbModel(saved));
        }
      });
  }
);

app.delete(
  "/api/character/:characterId/selections/:selectionId",
  async (req, res) => {
    const characterId = Number.parseInt(req.params.characterId);

    const selectionId = Number.parseInt(req.params.selectionId);
    const existing = await AoSelection.findOne({
      where: { id: selectionId, CharacterId: characterId },
    });
    if (!existing) {
      console.error(
        `Character ${characterId} does not have selection ${selectionId}`
      );
      res.status(200).send();
      return;
    }
    existing
      .destroy()
      .catch((err) => {
        console.error("Failed to create new Ao Selection", err);
        res.sendStatus(500);
      })
      .then((_) => {
        res.status(200).send();
      });
  }
);

function fetchCharacter(characterId: number) {
  return Character.findOne({
    where: { id: characterId },
  });
}
