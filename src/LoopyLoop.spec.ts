
import { test } from 'node:test';
import assert, { strictEqual, deepStrictEqual } from 'node:assert';

import { LoopyLoop } from './LoopyLoop.js';

const wait = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

test('constructor', (t) => {
  const task = (() => Promise.resolve());
  const loop = new LoopyLoop(task);
  assert(loop instanceof LoopyLoop);
  // test.end();
});

test('start(), stop(), isRunning()', (t, done) => {
  let work = false;
  const task = (() => {
    work = true;
    return Promise.resolve();
  });
  const loop = new LoopyLoop(task);
  loop.on('started', () => {
    strictEqual(loop.isRunning(), true);
    process.nextTick(() => {
      loop.stop();
    });
  });
  loop.on('stopped', () => {
    strictEqual(loop.isRunning(), false);
    done();
  });
  loop.start();
});

test('should not start more than once', (t, done) => {
  const task = () => Promise.resolve();
  let count = 0;
  const loop = new LoopyLoop(task)
    .on('started', () => {
      count += 1
    })
    .on('stopped', () => {
      strictEqual(count, 1);
      done();
    });
  setTimeout(() => loop.stop(), 10);
  loop.start();
  loop.start();
});

test('should not stop more than once', (t, done) => {
  const task = () => Promise.resolve();
  let count = 0;
  const loop = new LoopyLoop(task)
    .on('stopped', () => {
      count += 1
    });
  setTimeout(() => {
    strictEqual(count, 1);
    done();
  }, 20);
  setTimeout(() => { loop.stop(); }, 5);
  setTimeout(() => { loop.stop(); }, 10);
  loop.start();
});

test('sequence - w/o chained calls', (t, done) => {
  let seq = 0;
  const target: number[] = [];
  const source = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const loop = new LoopyLoop(() => {
    const localSeq = seq++;
    return wait(Math.random() * 50).then(() => {
      target.push(localSeq);
      if (target.length >= 10) {
        loop.stop();
      }
    });
  }, {maxChained: 0});
  loop.on('stopped', () => {
    deepStrictEqual(source, target);
    done();
  });
  loop.start();
});

test('sequence - w/ chained calls', (t, done) => {
  let seq = 0;
  const target: number[] = [];
  const source = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const loop = new LoopyLoop(() => {
    const localSeq = seq++;
    return wait(Math.random() * 50).then(() => {
      target.push(localSeq);
      if (target.length >= 10) {
        loop.stop();
      }
    });
  }, {maxChained: 2});
  loop.on('stopped', () => {
    deepStrictEqual(source, target);
    done();
  });
  loop.start();
});

test('catch error w/o chained calls', (t, done) => {
  let i = 0;
  const err = new Error('test error');
  const task = (() => {
    if (++i === 10) {
      return Promise.reject(err);
    }
    return Promise.resolve();
  });
  const loop = new LoopyLoop(task, {maxChained: 0});
  loop.on('error', (_err) => {
    strictEqual(err, _err);
    done();
  });
  loop.start();
});

test('catch error w/ chained calls', (t, done) => {
  let i = 0;
  const err = new Error('test error');
  const task = (() => {
    if (++i === 10) {
      return Promise.reject(err);
    }
    return Promise.resolve();
  });
  const loop = new LoopyLoop(task, {maxChained: Infinity});
  loop.on('error', (_err) => {
    strictEqual(err, _err);
    done();
  });
  loop.start();
});
