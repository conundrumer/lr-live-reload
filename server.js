const express = require("express");
const chokidar = require("chokidar");
const WebSocketServer = require("ws").Server;
const path = require("path");

const port = 3333;
const scriptEntry = "main.js";
const scriptDir = "client";
const getScriptUrl = () => `${port}/${Date.now()}/${scriptEntry}`;

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/:time/:script", (req, res) => {
  console.log(req.url);
  res.sendFile(req.params.script, { root: path.join(__dirname, scriptDir) });
});

app.listen(port, () => console.log(`Live Reload server listening on ${port}`));

const wss = new WebSocketServer({ port: 40510 });
const watcher = chokidar.watch(scriptDir);

let activeSockets = new Set();

let debounce;
watcher.on("change", () => {
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    console.log("change");
    for (let ws of activeSockets) {
      ws.send(getScriptUrl());
    }
  }, 1000 / 60);
});

wss.on("connection", ws => {
  console.log("connection");

  ws.send(getScriptUrl());

  activeSockets.add(ws);

  ws.on("close", () => {
    activeSockets.delete(ws);
  });
});
