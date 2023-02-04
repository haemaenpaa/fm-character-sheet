import express, { Response } from "express";
import bodyParser from "body-parser";

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
