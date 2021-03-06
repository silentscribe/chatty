// server.js

const express = require('express');
const SocketServer = require('ws');
const uuidv1 = require('uuid/v1');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer.Server({ server });

const clientCount = (size) => {
  const sizeObj = {size};
  wss.clients.forEach(client => {
    if (client.readyState === SocketServer.OPEN) {
      client.send(JSON.stringify(sizeObj));
    }
  });
  return;
}
// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');
  clientCount(wss.clients.size);

  ws.onmessage = (message) => {
    let data = JSON.parse(message.data);
    data.id = uuidv1();
    wss.clients.forEach(client => {
      if (client.readyState === SocketServer.OPEN) {
        client.send(JSON.stringify(data))
      }
    });
  }

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
    clientCount(wss.clients.size);
  });
  
});

