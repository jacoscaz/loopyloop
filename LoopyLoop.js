
'use strict';

const EventEmitter = require('eventemitter3');

class LoopyLoop extends EventEmitter {

  constructor(task) {
    super();
    this.task = task;
    this.running = false;
  }

  start() {
    if (!this.running) {
      const task = this.task;
      const loop = () => {
        task()
          .then(() => { 
            if (this.running) {
              setImmediate(loop);
            } else {
              setImmediate(() => {
                this.emit('stopped');  
              });
            }
          })
          .catch((err) => { 
            setImmediate(() => {
              this.running = false;
              this.emit('error', err);
              this.emit('stopped');
            });
          });
      }
      setImmediate(() => {
        this.running = true;
        this.emit('started');
        loop();
      });
    }
    return this;
  }

  stop() {
    if (this.running) {
      this.running = false;
    }
    return this;
  }

  isRunning() {
    return this.running;  
  }
  
}

module.exports = LoopyLoop;

