import express, { Response, Request } from "express";
import bodyParser from "body-parser";
import { Character } from "./model/character";
import { characterInclude, characterOrder } from "./sequelize-configuration";
import checkJwt from "./auth";
import { User, UserCharacter } from "./model/user";
import { HasOne } from "sequelize";

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

const characterIdRoute = async (
  req: Request,
  res: Response,
  next: () => void
) => {
  if (req.method === "OPTIONS") {
    next();
    return;
  }
  const characterId = Number.parseInt(req.params.characterId);
  if (isNaN(characterId)) {
    console.error(`Bad character id ${req.params.characterId}`);
    res.send(400);
    return;
  }
  if (checkJwt) {
    const userCharacter = await UserCharacter.findOne({
      where: {
        CharacterId: characterId,
      },
      include: [
        {
          model: User,
          association: new HasOne(UserCharacter, User, {
            foreignKey: "id",
            sourceKey: "UserId",
          }),
          required: true,
          where: { openId: req.auth.payload.sub },
        },
      ],
    });
    if (
      !userCharacter ||
      (userCharacter.getDataValue("role") !== "OWNER" && req.method !== "GET")
    ) {
      res
        .status(403)
        .send(
          userCharacter
            ? `Role ${userCharacter.getDataValue(
                "role"
              )} does not have edit permit`
            : `User has no access to character`
        );
      res.sendStatus(403).end();
      return;
    }
  }
  const existingCharacter = await Character.findOne({
    where: { id: characterId },
    include: characterInclude,
    order: characterOrder,
  });

  if (existingCharacter) {
    console.log(`Request to ${req.baseUrl} validated.`);
    console.log(req.auth);
    res.locals.character = existingCharacter;
    next();
  } else {
    console.error(`Character ${characterId} not found.`);
    res.sendStatus(404);
  }
};

if (checkJwt) {
  app.use("/api/characters", checkJwt);
  app.use("/api/character/**", checkJwt);
}
app.use("/api/character/:characterId/**", characterIdRoute);
app.use("/api/character/:characterId", characterIdRoute);
