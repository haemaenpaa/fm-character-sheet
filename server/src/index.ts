import express from "express";
import * as path from "path";
import { app, port } from "./app";
import * as biographyController from "./controller/biography-controller";
import * as characterController from "./controller/character-controller";
import * as spellController from "./controller/spell-controller";
import * as selectionController from "./controller/selection-controller";
import * as attacksController from "./controller/attack-controller";
import * as hitDiceController from "./controller/hit-dice-controller";
import * as inventoryController from "./controller/inventory-controller";
import * as raceController from "./controller/race-controller";
import * as resourceController from "./controller/resource-controller";

//Access the exported constant from each controller to ensure that the calls to app route are invoked.
characterController.exists;
biographyController.exists;
spellController.exists;
selectionController.exists;
attacksController.exists;
hitDiceController.exists;
inventoryController.exists;
raceController.exists;
resourceController.exists;

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
