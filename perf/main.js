
'use strict';

const LoopyLoop = require('../');

let start;

let count = 0;
let limit = 1e7;

const task = (() => {
  count++ >= limit && loop.stop();
  return Promise.resolve();
});

const opts = {maxChained: 10};

const loop = new LoopyLoop(task, opts)
  .on('stopped', () => {
    const delta = process.hrtime(start);
    const millis = Math.round((delta[0] * 1e9 + delta[1]) / 1e6);
    console.log(`${limit} cycles in ${millis} ms - ${limit/millis} cycles/ms`);
  })
  .on('started', () => {
    start = process.hrtime();
  })
  .start();






