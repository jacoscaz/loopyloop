
'use strict';

const EventEmitter = require('eventemitter3');

class LoopyLoop extends EventEmitter {

  constructor(task, opts) {

    super();

    Object.defineProperty(this, 'task', {
      value: task,
      writable: false
    });

    this._chained = 0;
    this._running = false;

    if (!opts || typeof(opts) !== 'object' || opts === null) {
      opts = {};  
    }

    this._maxChained = typeof(opts.maxChained) === 'number'
      ? Math.abs(opts.maxChained)
      : 10;
  }

  start(cb) {
    if (!this._running) {
      const loop = () => {
        this.task.call(this)
          .then(() => { 
            if (this._running) {
              if (this._maxChained) {
                if (this._chained < this._maxChained) {
                  this._chained += 1;
                  return this.task.call(this)
                    .then(loop);  
                } else {
                  this._chained = 0;
                  setImmediate(loop);
                }
              } else {
                setImmediate(loop);
              }
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
      if (typeof(cb) === 'function') {
        this.once('started', cb);
      }
    }
    return this;
  }

  stop(cb) {
    if (this._running) {
      this._running = false;
      if (typeof(cb) === 'function') {
        this.once('stopped', cb);
      }
    }
    return this;
  }

  isRunning() {
    return this._running;
  }
  
}

module.exports = LoopyLoop;

