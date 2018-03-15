
# LoopyLoop

A simple class to instantiate infinite loops of async functions without memory leaks.

## Usage

const LoopyLoop = require('loopyloop');

```js
const loop = new LoopyLoop(async () => {
  // something async here
})
  .on('started', () => {})
  .on('stopped', () => {})
  .on('error', (err) => {})
  .start();
```

## License

MIT

