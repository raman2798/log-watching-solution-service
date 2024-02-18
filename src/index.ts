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

const filePath = 'logfile.log';

// Check if the file exists
const fileExists = fs.existsSync(filePath);

if (!fileExists) {
  fs.writeFileSync(filePath, '', 'utf8');
}

const watcher = new Watcher(filePath);

watcher.start();

app.get('/', (req, res) => {
  res.send({ message: 'Welcome' });
});

app.get('/log', (req, res) => {
  let counter = 1;

  fs.appendFile(filePath, `${Date.now()} : ${counter.toString()}`, (err) => {
    if (err) throw err;
  });

  counter++;

  setInterval(() => {
    fs.appendFile(filePath, `\n${Date.now()}: ${counter}`, (err) => {
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
