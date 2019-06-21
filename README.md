
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

## API

### Constructor

```js
const loop = new LoopyLoop(task, opts);
```

| Argument            | Description                                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `task`              | An `async` or otherwise `Promise`-returning `function` to be executed continuously.                                      |
| `[opts]`            | An optional `object` of loop options.                                                                                    |
| `[opts.maxChained]` | The optional maximum `number` of chained executions within the same tick of the JavaScript event loop. Defaults to `10`. |

### Events

The `LoopyLoop` class extends `EventEmitter` and its instances emit the following events:

| Event      | Description                                                                                                                   |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `started`  | Emitted **after** the loop has started running.                                                                               |
| `stopped`  | Emitted **after** the loop has stopped running.                                                                               |
| `error`    | Emitted when the `Promise` returned by `task` rejects. The rejection's error is provided as the first argument to this event. |

In addition to emitting the `error` event, a `LoopyLoop` instance will stop running when its `task` rejects.

### Methods

| Method             | Description                                                                                                           |
| ------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `loop.start([cb])` | Starts the loop. The optional `cb` callback is added as a one-time listener to the `started` event.                   |
| `loop.stop([cb])`  | Stops the loop. The optional `cb` callback is added as a one-time listener to the `stopped` event.                    |

## Compatibility

`LoopyLoop` works with both modern `async` functions and functions that explicitely return `Promise`s. Compatible with all Node.js versions `>= 8.0.0`.

## License

[MIT](./LICENSE.md)
