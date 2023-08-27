
import { EventEmitter } from 'node:events';

export interface Task {
  (): Promise<any>;
}

export interface Opts {
  maxChained?: number;
}

type Resolver = (value?: any) => any;
type Rejecter = (err: Error) => any;

export class LoopyLoop extends EventEmitter {

  private _stop: boolean;
  private _running: boolean;
  private _runTask: () => Promise<void>;

  constructor(task: Task, opts: Opts = { maxChained: 10 }) {

    super();

    this._stop = false;
    this._running = false;
    this._runTask = typeof opts?.maxChained === 'number' && opts.maxChained > 1
        ? () => new Promise((resolve, reject) => this._chain(task, opts.maxChained as number, resolve, reject))
        : task;

    this._loop = this._loop.bind(this);

  }

  isRunning() {
    return this._running;
  }

  start() {
    if (!this._running) {
      this._stop = false;
      this._running = true;
      this.emit('started');
      setImmediate(this._loop);
    }
    return this;
  }

  stop() {
    if (this._running) {
      this._stop = true;
    }
    return this;
  }

  private _loop() {
    this._runTask()
      .then(() => {
        if (this._stop) {
          this._running = false;
          this._stop = false;
          this.emit('stopped');
          return;
        }
        setImmediate(this._loop);
      })
      .catch((err) => {
        this._running = false;
        this._stop = false;
        this.emit('error', err);
        this.emit('stopped');
      });
  }

  private _chain = (task: Task, count: number, resolve: Resolver, reject: Rejecter) => {
    let left = count;
    const boundChain = () => {
      if (left < 1 || this._stop) {
        resolve();
        return;
      }
      left -= 1;
      task().then(boundChain).catch(reject);
    };
    boundChain();
  };

}
