import express, { Application } from 'express';
import { appConfiguration, loggerConfiguration } from './config';
import * as http from 'http';
import fs from 'fs';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';
import Watcher from './watcher';

const { port } = appConfiguration;

// Create the Express application
const app: Application = express();

// Start the HTTP server
const server = http.createServer(app);

const io = new SocketIOServer(server);

const file = 'logfile.log';

const watcher = new Watcher(file);

watcher.start();

app.get('/', (req, res) => {
  res.send({ message: 'Welcome' });
});

app.get('/log', (req, res) => {
  let counter = 1;

  fs.appendFile(file, `${Date.now()} : ${counter.toString()}`, (err) => {
    if (err) throw err;
  });

  counter++;

  setInterval(() => {
    fs.appendFile(file, `\n${Date.now()}: ${counter}`, (err) => {
      if (err) loggerConfiguration.error('Error', err);
    });

    counter++;
  }, 1000);

  const options = {
    root: path.join(__dirname),
  };

  const fileName = 'index.html';

  res.sendFile(fileName, options);
});

io.on('connection', function (socket) {
  loggerConfiguration.info('new connection established:' + socket.id);

  watcher.on('process', function process(data) {
    socket.emit('update-log', data);
  });

  const data = watcher.getLogs();

  socket.emit('init', data);
});

// Start the HTTP server
server.listen(port, () => {
  loggerConfiguration.info(`Listening on port ${port}...`);
});
