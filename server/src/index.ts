import express from "express";
import * as path from "path";
import { convertCharacterDbModel } from "./mapper/character-mapper";
import { Attack } from "./model/attack";
import { Character } from "./model/character";
import { CharacterSpellbook, Spell } from "./model/character-spells";
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

/**
 * Route that redirects everything not otherwise routed to the SPA frontend.
 */
app.get("*", async (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
