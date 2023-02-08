import { ResistanceDto } from "fm-transfer-model";
import { app, jsonParser } from "../app";
import {
  convertResistanceDbModel,
  convertResistanceDto,
} from "../mapper/resistance-mapper";
import { Resistance, ResistanceCategory } from "../model/resistance";

export const exists = true;

app.get("/api/character/:characterId/resistances/:category", (req, res) => {
  const characterId = Number.parseInt(req.params.characterId);
  const category = req.params.category;

  Resistance.findAll({ where: { CharacterId: characterId, category } }).then(
    (resistances) => {
      res.send(resistances.map(convertResistanceDbModel));
    },
    (error) => {
      console.error("Could not get resistances", error);
      res.sendStatus(500);
    }
  );
});

app.post(
  "/api/character/:characterId/resistances/:category",
  jsonParser,
  async (req, res) => {
    const characterId = Number.parseInt(req.params.characterId);
    const category = req.params.category as ResistanceCategory;

    const dto = req.body as ResistanceDto;
    const existing = await Resistance.findOne({
      where: { CharacterId: characterId, category, value: dto.value },
    });
    if (existing) {
      existing.update({ type: dto.type }).then(
        (updated) => res.send(convertResistanceDbModel(updated)),
        (error) => {
          console.error("Failed to update resistance.", error);
          res.sendStatus(500);
        }
      );
    } else {
      const toCreate = convertResistanceDto(dto, category);
      toCreate.save().then(
        (created) => res.send(convertResistanceDbModel(created)),
        (error) => {
          console.error("Failed to create resistance.", error);
          res.sendStatus(500);
        }
      );
    }
  }
);

app.delete(
  "/api/character/:characterId/resistances/:category/:value",
  async (req, res) => {
    const characterId = Number.parseInt(req.params.characterId);
    const category = req.params.category as ResistanceCategory;
    const value = req.params.value;

    const existing = await Resistance.destroy({
      where: { CharacterId: characterId, category, value },
    }).then(
      (_) => res.status(200).send(),
      (error) => {
        console.error("Failed to delete resistance", error);
        res.sendStatus(500);
      }
    );
  }
);
