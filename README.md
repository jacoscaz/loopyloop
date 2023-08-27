
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

## Runtimes

LoopyLoop should be compatible with all modern JS runtimes. Loaders, bundlers,
build systems and [import maps][r2] may be used to resolve the `node:events`
package to any other package or module offering an alternative implementation 
of `EventEmitter`, as long as basic API compatibility is maintained. One good
example of an alternative implementation is [`eventmitter3`][r1].

[r1]: https://www.npmjs.com/package/eventemitter3
[r2]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap

## License

[MIT](./LICENSE.md)
