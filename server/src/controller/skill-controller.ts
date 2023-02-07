import { CharacterDto, DefaultSkillsDto } from "fm-transfer-model";
import { app, jsonParser } from "../app";
import { convertSkillDbModel, convertSkillDto } from "../mapper/skill-mapper";
import { Character } from "../model/character";
import { CustomSkill } from "../model/custom-skill";

export const exists = true;

const defaultSkills = [
  "anh",
  "ath",
  "dec",
  "emp",
  "inv",
  "lea",
  "med",
  "occ",
  "perc",
  "pers",
  "sub",
  "ste",
  "sur",
];

app.get("/api/character/:characterId/skills", (req, res) => {
  const characterId = Number.parseInt(req.params.characterId);
  CustomSkill.findAll({ where: { CharacterId: characterId } }).then(
    (found) => res.send(found.map(convertSkillDbModel)),
    (error) => {
      console.error("Could not find character skills", error);
      res.sendStatus(404);
    }
  );
});

app.put(
  "/api/character/:characterId/defaultSkills",
  jsonParser,
  async (req, res) => {
    const characterId = Number.parseInt(req.params.characterId);
    const character = await Character.findOne({ where: { id: characterId } });

    if (!character) {
      console.error(`Character ${characterId} not found.`);
      res.sendStatus(404);
    }

    const skillDto = req.body;
    const values = {};
    for (const skill of defaultSkills) {
      if (skill in skillDto) {
        values[skill] = skillDto[skill];
      }
    }
    character.update(values).then(
      (updated) => {
        const ret = {};
        for (const skill of defaultSkills) {
          ret[skill] = updated.getDataValue(skill);
        }
        res.send(ret);
      },
      (error) => {
        console.error("Failed to update default skills", error);
        res.sendStatus(500);
      }
    );
  }
);

app.post("/api/character/:characterId/skills", jsonParser, async (req, res) => {
  const characterId = Number.parseInt(req.params.characterId);
  const character = await Character.findOne({ where: { id: characterId } });
  if (!character) {
    console.error(`No Character by ID ${characterId}`);
    res.sendStatus(404);
    return;
  }
  const toCreate = convertSkillDto(req.body);
  toCreate.setDataValue("CharacterId", characterId);

  CustomSkill.create(toCreate.dataValues).then(
    (created) => {
      res.send(convertSkillDbModel(created));
    },
    (error) => {
      console.error("Failed to create custom skill", error);
      res.sendStatus(500);
    }
  );
});

app.put(
  "/api/character/:characterId/skills/:skillId",
  jsonParser,
  async (req, res) => {
    const characterId = Number.parseInt(req.params.characterId);
    const skillId = Number.parseInt(req.params.skillId);
    const existing = await CustomSkill.findOne({
      where: { id: skillId, CharacterId: characterId },
    });
    if (!existing) {
      console.error(`No skill ${skillId} on ${characterId}`);
      res.sendStatus(404);
      return;
    }

    const toUpdate = convertSkillDto(req.body);
    toUpdate.setDataValue("CharacterId", characterId);

    existing.update(toUpdate.dataValues).then(
      (updated) => {
        res.send(convertSkillDbModel(updated));
      },
      (error) => {
        console.error("Failed to update custom skill", error);
        res.sendStatus(500);
      }
    );
  }
);

app.delete("/api/character/:characterId/skills/:skillId", async (req, res) => {
  const characterId = Number.parseInt(req.params.characterId);
  const skillId = Number.parseInt(req.params.skillId);
  const existing = await CustomSkill.destroy({
    where: { id: skillId, CharacterId: characterId },
  }).then(
    (_) => res.status(200).send(),
    (error) => {
      console.error("Failed to delete custom skill.", error);
      res.status(500).send();
    }
  );
});
