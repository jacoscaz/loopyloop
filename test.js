/*
 * This process should stabilize at around 50 MB of memory consumption.
 */

'use strict';

const LoopyLoop = require('./');

const loop = new LoopyLoop(async () => {
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
}, 60 * 1000);

