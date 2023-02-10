import { InventoryContainerDto, ItemDto } from "fm-transfer-model";
import { app, jsonParser } from "../app";
import {
  convertInventoryContainerDbModel,
  convertInventoryContainerDto,
  convertItemDbModel,
  convertItemDto,
} from "../mapper/inventory-mapper";
import { randomId } from "../model/id-generator";
import { InventoryContainer, Item } from "../model/inventory";
import {
  inventoryContainerInclude,
  inventoryContainerOrder,
  sequelize,
} from "../sequelize-configuration";

export const exists = true;

app.get("/api/character/:characterId/inventory", (req, res) => {
  const characterId = Number.parseInt(req.params.characterId);
  InventoryContainer.findAll({
    where: {
      CharacterId: characterId,
    },
    include: inventoryContainerInclude,
    order: [["idx", "ASC"], inventoryContainerOrder],
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
  "/api/character/:characterId/inventory",
  jsonParser,
  async (req, res) => {
    const characterId = Number.parseInt(req.params.characterId);

    const dto: InventoryContainerDto = req.body;

    const containerId = dto.id || randomId();
    const toUpdate = convertInventoryContainerDto(dto);
    toUpdate.setDataValue("id", containerId);
    toUpdate.setDataValue("CharacterId", characterId);

    const count = await InventoryContainer.count({
      where: { CharacterId: characterId },
    });
    toUpdate.setDataValue("idx", count);

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
            order: [inventoryContainerOrder],
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
    sequelize.transaction().then((transaction) => {
      const keys = { ...toUpdate.dataValues };
      delete keys.idx;
      existing
        .update(keys)
        .then(async (_) => {
          Item.destroy({
            where: {
              InventoryContainerId: containerId,
            },
          });
        })
        .then((_) =>
          Promise.all(
            toUpdate.getDataValue("contents").map((it: Item) => {
              it.setDataValue("InventoryContainerId", containerId);
              return it.save();
            })
          )
        )
        .then(
          async (result: any[]) => {
            if (result === undefined) {
              return;
            }
            transaction.commit();
            const ret = await InventoryContainer.findOne({
              where: {
                id: containerId,
                CharacterId: characterId,
              },
              include: inventoryContainerInclude,
              order: [inventoryContainerOrder],
            });
            res.send(convertInventoryContainerDbModel(ret));
          },
          (err) => {
            console.error("Failed to update container", err);
            transaction.rollback();
            res.send(500);
          }
        );
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

app.post(
  "/api/character/:characterId/inventory/:containerId/item",
  jsonParser,
  async (req, res) => {
    const characterId = Number.parseInt(req.params.characterId);
    const containerId = Number.parseInt(req.params.containerId);
    const dto: ItemDto = req.body;
    const toCreate = convertItemDto(dto);
    toCreate.setDataValue("InventoryContainerId", containerId);

    const container = await InventoryContainer.findOne({
      where: {
        id: containerId,
        CharacterId: characterId,
      },
    });
    if (!container) {
      console.error(
        `Character ${characterId} does not have inventory container ${containerId}`
      );
      res.sendStatus(404);
      return;
    }
    const count = await Item.count({
      where: { InventoryContainerId: containerId },
    });
    toCreate.setDataValue("idx", count);
    Item.create(toCreate.dataValues).then(
      (created) => {
        res.send(convertItemDbModel(created));
      },
      (error) => {
        console.error("Could not create item", error);
        res.sendStatus(500);
      }
    );
  }
);

app.put(
  "/api/character/:characterId/inventory/:containerId/item/:itemId",
  jsonParser,
  async (req, res) => {
    const characterId = Number.parseInt(req.params.characterId);
    const containerId = Number.parseInt(req.params.containerId);
    const itemId = Number.parseInt(req.params.itemId);
    const dto: ItemDto = req.body;

    const toUpdate = convertItemDto(dto);
    toUpdate.setDataValue("id", itemId);

    const container = await InventoryContainer.findOne({
      where: {
        id: containerId,
        CharacterId: characterId,
      },
    });
    if (!container) {
      console.error(
        `Character ${characterId} does not have inventory container ${containerId}`
      );
      res.sendStatus(404);
      return;
    }

    const existing = await Item.findOne({
      where: { id: itemId, InventoryContainerId: containerId },
    });
    if (!existing) {
      console.error(
        `Character ${characterId} container ${containerId} does not contain item ${itemId}`
      );
      res.send(404);
    }

    const keys = { ...toUpdate.dataValues };
    delete keys.idx;
    existing
      .update(keys)
      .then((updated) => {
        res.send(convertItemDbModel(updated));
      })
      .catch((err) => {
        console.error(`Could not update item ${itemId}`, err);
        res.sendStatus(500);
      });
  }
);

app.delete(
  "/api/character/:characterId/inventory/:containerId/item/:itemId",
  async (req, res) => {
    const characterId = Number.parseInt(req.params.characterId);
    const containerId = Number.parseInt(req.params.containerId);
    const itemId = Number.parseInt(req.params.itemId);

    const container = await InventoryContainer.findOne({
      where: {
        id: containerId,
        CharacterId: characterId,
      },
    });
    if (!container) {
      console.error(
        `Character ${characterId} does not have inventory container ${containerId}`
      );
      res.sendStatus(404);
      return;
    }
    Item.destroy({
      where: {
        id: itemId,
        InventoryContainerId: containerId,
      },
    }).then(
      (_) => {
        res.status(200).send();
      },
      (err) => {
        console.error("Could not delete item.", err);
        res.sendStatus(500);
      }
    );
  }
);

/**
 * Move one item from one container to another.
 */
app.post("/api/character/:characterId/moveItem/:itemId", async (req, res) => {
  const itemId = Number.parseInt(req.params.itemId);
  const characterId = Number.parseInt(req.params.characterId);

  const queryTo = req.query["to"];
  if (
    !(queryTo instanceof String || typeof queryTo === "string") ||
    isNaN(Number.parseInt(queryTo as string))
  ) {
    console.error(`${queryTo} is not a container id.`);
    res.sendStatus(400);
    return;
  }
  const destinationId = Number.parseInt(queryTo as string);
  const existing = await Item.findOne({
    where: {
      id: itemId,
    },
  });
  if (!existing) {
    console.error(`Item ${itemId} not found.`);
    res.sendStatus(404);
  }
  const originId = existing.getDataValue("InventoryContainerId");
  const originContainer = await InventoryContainer.findOne({
    where: {
      id: originId,
      CharacterId: characterId,
    },
  });
  const destinationContainer = await InventoryContainer.findOne({
    where: {
      id: destinationId,
      CharacterId: characterId,
    },
  });
  if (!originContainer || !destinationContainer) {
    console.error(
      `Character ${characterId} did not have containers ${originId} and/or ${destinationId}`
    );
    res.sendStatus(404);
  }
  existing.update({ InventoryContainerId: destinationId }).then(
    (updated) => {
      res.send(convertItemDbModel(updated));
    },
    (err) => {
      console.error(
        `Could not move item ${itemId} from ${originId} to ${destinationId}`,
        err
      );
      res.sendStatus(500);
    }
  );
});

/**
 * Bulk move all items from one container to another.
 */
app.post(
  "/api/character/:characterId/inventory/bulkMove/:containerId/",
  async (req, res) => {
    const characterId = Number.parseInt(req.params.characterId);
    const originId = Number.parseInt(req.params.containerId);

    const queryTo = req.query["to"];
    if (
      !(queryTo instanceof String || typeof queryTo === "string") ||
      isNaN(Number.parseInt(queryTo as string))
    ) {
      console.error(`${queryTo} is not a container id.`);
      res.sendStatus(400);
      return;
    }
    const destinationId = Number.parseInt(queryTo as string);
    const originContainer = await InventoryContainer.findOne({
      where: {
        id: originId,
        CharacterId: characterId,
      },
      //Fetch origin container's contents.
      include: inventoryContainerInclude,
    });
    const destinationContainer = await InventoryContainer.findOne({
      where: {
        id: destinationId,
        CharacterId: characterId,
      },
    });
    if (!originContainer || !destinationContainer) {
      console.error(
        `Character ${characterId} did not have containers ${originId} and/or ${destinationId}`
      );
      res.sendStatus(404);
    }
    sequelize.transaction().then((transaction) => {
      const contents = originContainer.getDataValue("contents") as Item[];
      Promise.all(
        contents.map((item) =>
          item.update({ InevtoryContainerId: destinationId })
        )
      ).then(
        async (updated) => {
          await transaction.commit();
          res.send(updated.map(convertItemDbModel));
        },
        async (error) => {
          await transaction.rollback();
          console.error(
            `Could not move items from ${originId} to ${destinationId}.`,
            error
          );
          res.sendStatus(500);
        }
      );
    });
  }
);
