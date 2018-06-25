
# LoopyLoop

[![Build Status](https://travis-ci.org/jacoscaz/node-loopyloop.svg?branch=master)](https://travis-ci.org/jacoscaz/node-loopyloop)

A simple class to instantiate infinite loops of async functions without memory leaks.

## Usage

```js
const LoopyLoop = require('loopyloop');

const loop = new LoopyLoop(async () => {
  // something async here
})
  .on('started', () => {})
  .on('stopped', () => {})
  .on('error', (err) => {})
  .start();
```

## License

[MIT](./LICENSE)
