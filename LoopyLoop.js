
'use strict';

const EventEmitter = require('eventemitter3');

class LoopyLoop extends EventEmitter {

  constructor(task) {

    super();

    Object.defineProperty(this, 'task', {
      value: task,
      writable: false
    });

    this._running = false;
  }

  start(cb) {
    if (!this._running) {
      const loop = () => {
        this.task.call(this)
          .then(() => { 
            if (this._running) {
              setImmediate(loop);
            } else {
              setImmediate(() => {
                this.emit('stopped');  
              });
            }
          })
          .catch((err) => { 
            setImmediate(() => {
              this._running = false;
              this.emit('error', err);
              this.emit('stopped');
            });
          });
      }
      setImmediate(() => {
        this._running = true;
        this.emit('started');
        loop();
      });
    }
    if (typeof(cb) === 'function') {
      this.once('started', cb);
    }
    return this;
  }

  stop(cb) {
    if (this._running) {
      this._running = false;
    }
    if (typeof(cb) === 'function') {
      this.once('stopped', cb);
    }
    return this;
  }

  isRunning() {
    return this._running;
  }
  
}

module.exports = LoopyLoop;

