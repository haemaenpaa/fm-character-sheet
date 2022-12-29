import express from "express";
import * as path from "path";
const app = express();
const port = process.env.PORT || 3000;

const frontendPath =
  process.env.FRONTEND_PATH || path.join(__dirname, "fm-character-sheet");

//Serve the frontend content as static.
app.use(express.static(frontendPath));

/**
 * Route that redirects everything not otherwise routed to the SPA frontend.
 */
app.get("*", async (req, res) => {
  res.sendFile(path.join(__dirname, frontendPath, "index.html"));
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
