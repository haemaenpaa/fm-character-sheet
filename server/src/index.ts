import express from "express";
import { CharacterDto } from "fm-transfer-model/src/model/character";
import * as path from "path";
import {
  convertCharacterDbModel,
  convertCharacterDto,
} from "./mapper/character-mapper";
import { Attack } from "./model/attack";
import { Character } from "./model/character";
import { CharacterSpellbook, Spell } from "./model/character-spells";
import { randomId } from "./model/id-generator";
import { InventoryContainer } from "./model/inventory";
import { Race } from "./model/race";
import { initializeSchema } from "./model/schema";
const app = express();
const port = process.env.PORT || 3000;

const sequelize = initializeSchema("sqlite::memory:");

const characterInclude = [
  {
    association: Character.Race,
    include: [Race.Abilities, Race.Resistances],
  },
  Character.Resistances,
  Character.Selections,
  Character.HitDice,
  Character.HitDiceRemaining,
  {
    association: Character.Spellbook,
    include: [
      {
        association: CharacterSpellbook.Spells,
        include: [Spell.Damage, Spell.UpcastDamage],
      },
    ],
  },
  {
    association: Character.Attacks,
    include: [Attack.Damage, Attack.Effect],
  },
  {
    association: Character.Inventory,
    include: [InventoryContainer.Contents],
  },
  Character.Bio,
  Character.Resources,
];
sequelize.sync().then((sql) => {
  const charModel = sql.model("Character");
  charModel.create(
    {
      id: 1,
      name: "Placeholder character",
      resistances: [{ type: "immunity", value: "Fire", category: "damage" }],
    },
    {
      include: characterInclude,
    }
  );
});

const frontendPath =
  process.env.FRONTEND_PATH || path.join(__dirname, "fm-character-sheet");

//Serve the frontend content as static.
app.use(express.static(frontendPath));

app.get("/api/characters", async (req, res) => {
  sequelize
    .model("Character")
    .findAll({ include: characterInclude })
    .then((characters) => {
      res.setHeader("Content-Type", "application/json");
      res.send(characters.map(convertCharacterDbModel));
    });
});

app.get("/api/character/:characterId", async (req, res) => {
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
      //TODO: Map the database model into a data transfer model
      res.setHeader("Content-Type", "application/json");
      res.send(convertCharacterDbModel(character));
    });
});

app.post("/api/character/", async (req, res) => {
  const character = req.body as CharacterDto;
  if (!character.id) {
    character.id = randomId();
  }
  const dbCharacter = convertCharacterDto(character);
  sequelize
    .model("Character")
    .create(dbCharacter.dataValues, { include: characterInclude })
    .then((created) => {
      res.setHeader("Content-Type", "application/json");
      res.send(convertCharacterDbModel(created));
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.put("/api/character/:characterId", async (req, res) => {
  const characterId = Number.parseInt(req.params.characterId);
  const character = req.body as CharacterDto;
  if (character.id !== characterId) {
    res.sendStatus(400);
    return;
  }

  const dbCharacter = convertCharacterDto(character);
  const characterModel = sequelize.model("Character");
  const existing = await characterModel.findOne({
    where: { id: characterId },
    include: characterInclude,
  });
  if (existing) {
    const result = await existing.update(dbCharacter.dataValues);
    res.setHeader("Content-Type", "application/json");
    res.send(convertCharacterDbModel(result));
  } else {
    res.sendStatus(404);
  }
});

app.delete("/api/character/:characterId", async (req, res) => {
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

/**
 * Route that redirects everything not otherwise routed to the SPA frontend.
 */
app.get("*", async (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
