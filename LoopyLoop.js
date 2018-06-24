
'use strict';

const EventEmitter = require('eventemitter3');
const setImmediate = require('set-immediate-shim');

function chain(task, ctx, count) {
  return task.call(ctx).then(() => {
    if (count > 0) {
      return chain(task, ctx, count - 1);
    }
  });
}

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
        (this._maxChained ? chain(this.task, this, this._maxChained) : this.task.call(this))
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

