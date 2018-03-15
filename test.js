/*
 * This process should stabilize at around 50 MB of memory consumption.
 */

'use strict';

const InfiniteLoop = require('./');

const loop = new InfiniteLoop(async () => {
  const salutation = {
    hello: 'world', 
    timestamp: Date.now(), 
    random: Math.random()
  };
  console.log(salutation);
})
  .on('started', () => { console.log('STARTED'); })
  .on('stopped', () => { console.log('STOPPED'); })
  .on('error', (err) => { console.log('ERROR:', err); })
  .start();

setTimeout(() => {
  loop.stop();
}, 60 * 1000)

