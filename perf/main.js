
'use strict';

const Stats = require('stats-incremental');
const LoopyLoop = require('../');

function round(num) {
  return Math.round(num * 1e2) / 1e2;
}

function hrtimeToNanos(hrtime) {
  return (hrtime[0] * 1e9) + hrtime[1];
}

function hrtimeToMillis(hrtime) {
  return hrtimeToNanos(hrtime) / 1e6;
}

function hrtimeDiff(after, before) {
  return [
    after[0] - before[0], 
    after[1] - before[1]
  ];
}

function getStats(hrtimes) {
  const stats = new Stats();
  const length = hrtimes.length;
  for (let i = length - 1; i >= 1; i--) {
    stats.update(hrtimeToNanos(hrtimeDiff(hrtimes[i], hrtimes[i - 1])));
  }
  return stats.getAll();
}

function findMaxIndex(values) {
  let max = -Infinity;
  let pos = -Infinity;
  for (let i = values.length - 1; i >= 0; i--) {
    if (values[i] > max) {
      max = values[i];
      pos = i;
    }
  }
  return [max, pos];
}

const limit = 1e6;
const opts = {maxChained: 10};

let start;
let count = 0;

const hrtimes = new Array(limit);

const task = (() => {
  hrtimes[count] = process.hrtime();
  count++ >= limit && loop.stop();
  return Promise.resolve();
});

const loop = new LoopyLoop(task, opts)
  .on('stopped', () => {
    const millis = hrtimeToMillis(process.hrtime(start));
    console.log('');
    console.log(`TOTAL: ${limit} ticks in ${round(millis / 1e3)} seconds`);
    console.log(`SPEED: ${round(limit/millis)} tick/ms`);
    console.log(`MAX CHAINED: ${opts.maxChained}`);
    console.log('');
    const stats = getStats(hrtimes);
    console.log(`AVG: ${round(stats.mean)} ns/tick`);
    console.log(`STD: ${round(stats.standard_deviation)} ns/tick`);
    console.log(`COV: ${round(stats.standard_deviation / stats.mean)}`);
    console.log(`MAX: ${stats.max} ns/tick`);
    console.log(`MIN: ${stats.min} ns/tick`);
    console.log('');
  });

start = process.hrtime();
loop.start();
