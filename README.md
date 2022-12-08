
# LoopyLoop

A simple class to instantiate infinite loops of async functions.

## Usage

```js
const { LoopyLoop } = require('loopyloop');

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
| ---------- |-------------------------------------------------------------------------------------------------------------------------------|
| `started`  | Emitted **after** the loop has started running but before the task runs for the first time.                                   |
| `stopped`  | Emitted **after** the loop has stopped running.                                                                               |
| `error`    | Emitted when the `Promise` returned by `task` rejects. The rejection's error is provided as the first argument to this event. |

In addition to emitting the `error` event, a `LoopyLoop` instance will stop running when its `task` rejects.

### Methods

| Method           | Description       |
|------------------|-------------------|
| `loop.start()`   | Starts the loop.  |
| `loop.stop()`    | Stops the loop.   |

## Compatibility

`LoopyLoop` works with both modern `async` functions and functions that explicitely return `Promise`s. Compatible with all Node.js versions `>= 14.0.0`.

## License

[MIT](./LICENSE.md)
