import { app, jsonParser, setHeaders } from "../app";
import {
  convertSpellbookDbModel,
  convertSpellbookDto,
  convertSpellDbModel,
  convertSpellDto,
} from "../mapper/spell-mapper";
import { CharacterSpellbook, Spell } from "../model/character-spells";

export const exists = true;
console.log("Registering spellbook controller.");

const spellInclude = [Spell.Damage, Spell.UpcastDamage];
const spellBookInclude = [
  { association: CharacterSpellbook.Spells, include: spellInclude },
  CharacterSpellbook.Resources,
];

app.get("/api/character/:characterId/spellbook", async (req, res) => {
  setHeaders(res);
  const characterId = Number.parseInt(req.params["characterId"]);
  const found = await CharacterSpellbook.findOne({
    where: { spellId: characterId },
    include: spellBookInclude,
  });
  if (!found) {
    res.sendStatus(404);
  } else {
    res.send(convertSpellbookDbModel(found));
  }
});

app.put(
  "/api/character/:characterId/spellbook",
  jsonParser,
  async (req, res) => {
    setHeaders(res);
    const characterId = Number.parseInt(req.params["characterId"]);
    const toModify = convertSpellbookDto(req.body);
    const found = await CharacterSpellbook.findOne({
      where: { spellbookId: characterId },
      include: [CharacterSpellbook.Spells, CharacterSpellbook.Resources],
    });
    if (!found) {
      toModify.setDataValue("spellId", characterId);
      toModify
        .save()
        .catch((err) => {
          console.error(err);
          res.send(500);
        })
        .then(async (modified) => {
          if (!modified) {
            return;
          }
          const ret = await CharacterSpellbook.findOne({
            where: { id: modified.getDataValue("id") },
            include: spellBookInclude,
          });
          res.send(convertSpellbookDbModel(ret));
        });
    }
  }
);

app.get("/api/character/:characterId/spells/:spellId", (req, res) => {
  setHeaders(res);
  const spellId = Number.parseInt(req.params["spellId"]);
  Spell.findOne({ where: { id: spellId }, include: spellInclude })
    .catch((err) => {
      console.error(`Failed to fetch spell by id ${spellId}`, err);
      res.sendStatus(500);
    })
    .then((spell) => {
      if (spell) {
        res.send(convertSpellDbModel(spell));
      }
    });
});

app.put(
  "/api/character/:characterId/spells/:spellId",
  jsonParser,
  async (req, res) => {
    setHeaders(res);
    const characterId = Number.parseInt(req.params["characterId"]);
    const spellId = Number.parseInt(req.params["spellId"]);
    const spellbook = await CharacterSpellbook.findOne({
      where: { spellId: characterId },
      include: spellBookInclude,
    });
    if (!spellbook) {
      console.error(`Character ${characterId} does not have a spellbook.`);
      res.sendStatus(404);
      return;
    }
    const toModify = convertSpellDto(req.body);
    const found = await Spell.findOne({
      where: { spellId, SpellbookId: spellbook.getDataValue("id") },
    });
    if (!found) {
      console.error(
        `Character ${characterId} does not have a spell by id ${spellId}.`
      );
      res.sendStatus(404);
      return;
    }
    found.update(toModify.dataValues);
  }
);
