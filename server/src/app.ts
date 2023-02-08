import express, { Response } from "express";
import bodyParser from "body-parser";
import { Character } from "./model/character";

export const app = express();
export const jsonParser = bodyParser.json();
export const port = process.env.PORT || 3000;
const allowedOrigins = process.env.ALLOW_ORIGIN?.split(",") || ["*"];
export function setHeaders(res: Response) {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigins);
  res.setHeader("Access-Control-Allow-Headers", ["content-type"]);
  res.setHeader("Access-Control-Allow-Methods", [
    "GET",
    "POST",
    "PUT",
    "DELETE",
  ]);
  res.setHeader("Content-Type", "application/json");
}
app.use("/api/**", async (req, res, next) => {
  setHeaders(res);
  next();
});

app.use("/api/character/:characterId/**", async (req, res, next) => {
  const characterId = Number.parseInt(req.params.characterId);
  if (isNaN(characterId)) {
    console.error(`Bad character id ${req.params.characterId}`);
    res.send(400);
    return;
  }
  const existingCharacter = await Character.findOne({
    where: { id: characterId },
  });
  if (existingCharacter) {
    console.log(`Request to ${req.baseUrl} validated.`);
    next();
  } else {
    console.error(`Character ${characterId} not found.`);
    res.send(404);
  }
});
