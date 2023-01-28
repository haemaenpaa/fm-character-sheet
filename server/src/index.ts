import express from "express";
import * as path from "path";
import { Association } from "sequelize";
import { Attack } from "./model/attack";
import { Character } from "./model/character";
import { CharacterSpellbook, Spell } from "./model/character-spells";
import { InventoryContainer } from "./model/inventory";
import { Race } from "./model/race";
import { initializeSchema } from "./model/schema";
const app = express();
const port = process.env.PORT || 3000;

const sequelize = initializeSchema("sqlite::memory:");

sequelize.sync().then((sql) => {
  const charModel = sql.model("Character");
  console.log("Model:", charModel, charModel.getAttributes());
  charModel
    .create(
      {
        id: 1,
        name: "Placeholder character",
        resistances: [{ type: "immunity", value: "Fire", category: "damage" }],
      },
      {
        include: [
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
        ],
      }
    )
    .then((chr) => {
      console.log(chr);
      chr.dataValues.addSavingThrow;
    });
});

const frontendPath =
  process.env.FRONTEND_PATH || path.join(__dirname, "fm-character-sheet");

//Serve the frontend content as static.
app.use(express.static(frontendPath));

/**
 * Route that redirects everything not otherwise routed to the SPA frontend.
 */
app.get("*", async (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
