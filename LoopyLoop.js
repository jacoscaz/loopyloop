
'use strict';

const EventEmitter = require('eventemitter3');
const setImmediate = require('set-immediate-shim');

function chain(task, loopy, count) {
  return new Promise((resolve, reject) => {
    function _chain(_task, _loopy, _count) {
      _task.call(_loopy)
        .then(() => {
          if (_loopy.isRunning() && _count > 0) {
            _chain(_task, _loopy, _count - 1);
          } else {
            resolve();
          }
        })
        .catch(reject);
    }
    _chain(task, loopy, count);
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

    this.on('error', (err) => {
      if (this.listenerCount('error') === 1) {
        throw err;
      }
    });

    this._maxChained = typeof(opts.maxChained) === 'number'
      ? Math.abs(opts.maxChained)
      : 10;
  }

  start(cb) {
    if (!this._running) {
      const loop = () => {
        (
          this._maxChained 
            ? chain(this.task, this, this._maxChained) 
            : this.task.call(this)
        )
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
        loop();
        setImmediate(() => {
          this.emit('started');
        });
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

