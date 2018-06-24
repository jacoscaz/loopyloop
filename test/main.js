
'use strict';

const tap = require('tap');
const LoopyLoop = require('../');

function wait(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

tap.test('constructor', (test) => {
  const task = (async () => {});
  const loop = new LoopyLoop(task);
  test.type(loop, LoopyLoop);
  test.equal(loop.task, task);
  test.end();
});

tap.test('constructor with opts', (test) => {
  const task = (async () => {});
  const opts = {maxChained: 42};
  const loop = new LoopyLoop(task, opts);
  test.equal(loop._maxChained, opts.maxChained);
  test.end();
});

tap.test('start(), stop(), isRunning()', (test) => {
  let work = false;
  const task = (async () => { work = true; });
  const loop = new LoopyLoop(task);
  loop.on('started', () => {
    test.equal(work, true);
    setTimeout(() => {
      loop.stop();
    }, 100);
  });
  loop.on('stopped', () => {
    test.equal(loop.isRunning(), false);
    test.end();
  });
  loop.start();
});

tap.test('sequence - w/o chained calls', (test) => {
  let seq = 0;
  const target = [];
  const source = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const loop = new LoopyLoop(async () => {
    const localSeq = seq++;
    await wait(Math.random() * 500);
    target.push(localSeq);
    if (target.length >= 10) {
      loop.stop(); 
    }
  }, {maxChained: 0});
  loop.on('stopped', () => {
    console.log(target, source);
    test.same(source, target);
    test.end();
  });
  loop.start();
});

tap.test('sequence - w/ chained calls', (test) => {
  let seq = 0;
  const target = [];
  const source = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const loop = new LoopyLoop(async () => {
    const localSeq = seq++;
    await wait(Math.random() * 500);
    target.push(localSeq);
    if (target.length >= 10) {
      loop.stop(); 
    }
  }, {maxChained: 2});
  loop.on('stopped', () => {
    test.same(source, target);
    test.end();
  });
  loop.start();
});
