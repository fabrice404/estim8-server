const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const game = require('./game');

const server = http.createServer(express);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  ws.send(JSON.stringify(game.get()));
  ws.on('message', (msg) => {
    const response = game.messageHandler(msg);
    if (response) {
      [...wss.clients]
        .filter((client) => client.readyState === WebSocket.OPEN)
        .forEach((client) => {
          client.send(response);
        });
    }
  });
});

const port = process.env.PORT || 8001;
server.listen(port, () => {
  game.reset();
  process.stdout.write(`Server is listening on port ${port}\n`);
});
