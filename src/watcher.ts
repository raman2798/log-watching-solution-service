/* eslint-disable @typescript-eslint/no-this-alias */
import * as events from 'events';
import * as fs from 'fs';
import bf from 'buffer';

const TRAILING_LINES = 10;

const buffer = Buffer.alloc(bf.constants.MAX_STRING_LENGTH);

class Watcher extends events.EventEmitter {
  private watchFile: string;
  private store: string[];

  constructor(watchFile: string) {
    super();
    this.watchFile = watchFile;
    this.store = [];
  }

  public getLogs(): string[] {
    return this.store;
  }

  private watch(curr: fs.Stats, prev: fs.Stats): void {
    const watcher = this;

    fs.open(this.watchFile, (err, fd) => {
      if (err) throw err;
      let data = '';
      let logs: string[] = [];

      fs.read(fd, buffer, 0, buffer.length, prev.size, (err, bytesRead) => {
        if (err) throw err;

        if (bytesRead > 0) {
          data = buffer.slice(0, bytesRead).toString();
          logs = data.split('\n').slice(1);

          if (logs.length >= TRAILING_LINES) {
            logs.slice(-10).forEach((elem) => this.store.push(elem));
          } else {
            logs.forEach((elem) => {
              if (this.store.length === TRAILING_LINES) {
                this.store.shift();
              }
              this.store.push(elem);
            });
          }

          watcher.emit('process', logs);
        }
      });
    });
  }

  public start(): void {
    const watcher = this;

    fs.open(this.watchFile, (err, fd) => {
      if (err) throw err;
      let data = '';
      let logs: string[] = [];

      fs.read(fd, buffer, 0, buffer.length, 0, (err, bytesRead) => {
        if (err) throw err;
        if (bytesRead > 0) {
          data = buffer.slice(0, bytesRead).toString();
          logs = data.split('\n');
          this.store = [];
          logs.slice(-10).forEach((elem) => this.store.push(elem));
        }
        fs.close(fd, (err) => {
          if (err) throw err;
        });
      });

      fs.watchFile(this.watchFile, { interval: 1000 }, (curr, prev) => {
        watcher.watch(curr, prev);
      });
    });
  }
}

export default Watcher;
