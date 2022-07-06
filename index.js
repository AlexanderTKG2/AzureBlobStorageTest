require("module-alias/register");
const express = require("express");
const bodyParser = require("body-parser");
const env = require("@/src/config/env");

const { FilesRouter } = require("@/src/routes/fileRoutes");

const app = express();

app.disable("x-powered-by");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/files", FilesRouter);

const PORT = env.api.port;
const HOST = env.api.host;

app.listen(PORT, HOST, () => {
  console.log("API running on port: " + PORT);
});
