
# AsyncLoop

A simple class to instantiate infinite loops of async functions without memory leaks.

## Usage

const AsyncLoop = require('./');

```js
const loop = new AsyncLoop(async () => {
  // something async here
})
  .on('started', () => {})
  .on('stopped', () => {})
  .on('error', (err) => {})
  .start();
```

## License

MIT

