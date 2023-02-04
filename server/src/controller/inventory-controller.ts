import { InventoryContainerDto } from "fm-transfer-model";
import { app, jsonParser } from "../app";
import {
  convertInventoryContainerDbModel,
  convertInventoryContainerDto,
} from "../mapper/inventory-mapper";
import { InventoryContainer } from "../model/inventory";
import { inventoryContainerInclude } from "../sequelize-configuration";
import { fetchBasicCharacter } from "./controller-utils";

app.get("/api/character/:characterId/inventory", (req, res) => {
  const characterId = Number.parseInt(req.params.characterId);
  InventoryContainer.findAll({
    where: {
      CharacterId: characterId,
    },
    include: inventoryContainerInclude,
  })
    .catch((error) => {
      console.error("Could not get inventory containers");
      res.send(500);
    })
    .then((found) => {
      if (found) {
        res.send(found.map(convertInventoryContainerDbModel));
      }
    });
});
app.post(
  "/api/character/:characterId/inventory/:containerId",
  jsonParser,
  async (req, res) => {
    const characterId = Number.parseInt(req.params.characterId);
    const containerId = Number.parseInt(req.params.containerId);
    const character = fetchBasicCharacter(characterId);
    if (!character) {
      console.error(`Character ${characterId} does not exist`);
      res.sendStatus(400);
      return;
    }

    const dto: InventoryContainerDto = req.body;
    const toUpdate = convertInventoryContainerDto(dto);
    toUpdate.setDataValue("id", containerId);
    toUpdate.setDataValue("CharacterId", characterId);

    InventoryContainer.create(toUpdate.dataValues, {
      include: inventoryContainerInclude,
    })
      .catch((err) => {
        console.error("Failed to update container", err);
        res.send(500);
      })
      .then(async (result) => {
        if (result) {
          const ret = await InventoryContainer.findOne({
            where: {
              id: containerId,
              CharacterId: characterId,
            },
            include: inventoryContainerInclude,
          });
          res.send(convertInventoryContainerDbModel(ret));
        }
      });
  }
);

app.put(
  "/api/character/:characterId/inventory/:containerId",
  jsonParser,
  async (req, res) => {
    const characterId = Number.parseInt(req.params.characterId);
    const containerId = Number.parseInt(req.params.containerId);
    const existing = await InventoryContainer.findOne({
      where: {
        id: containerId,
        CharacterId: characterId,
      },
    });
    if (!existing) {
      console.error(`No container ${containerId} on character ${characterId}`);
      res.send(404);
      return;
    }
    const dto: InventoryContainerDto = req.body;
    const toUpdate = convertInventoryContainerDto(dto);
    toUpdate.setDataValue("id", containerId);
    toUpdate.setDataValue("CharacterId", characterId);

    existing
      .update(toUpdate.dataValues)
      .catch((err) => {
        console.error("Failed to update container", err);
        res.send(500);
      })
      .then(async (result) => {
        if (result) {
          const ret = await InventoryContainer.findOne({
            where: {
              id: containerId,
              CharacterId: characterId,
            },
            include: inventoryContainerInclude,
          });
          res.send(convertInventoryContainerDbModel(ret));
        }
      });
  }
);
app.delete(
  "/api/character/:characterId/inventory/:containerId",
  jsonParser,
  async (req, res) => {
    const characterId = Number.parseInt(req.params.characterId);
    const containerId = Number.parseInt(req.params.containerId);
    InventoryContainer.destroy({
      where: {
        id: containerId,
        CharacterId: characterId,
      },
    })
      .catch((error) => {
        console.error(`Failed to delete container ${containerId}`, error);
        res.sendStatus(500);
      })
      .then((count) => {
        if (count >= 0) {
          res.status(200).send();
        }
      });
  }
);
