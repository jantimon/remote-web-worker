# Remote Worker

[Leightweight (~0.3kb)][1] Worker patch to allow loading scripts from remote URLs (cross-origin).

## Motivation

This patch allows to host Web Worker scripts on CDN servers without the following exceptions:

- `"Uncaught DOMException: Failed to construct 'Worker': Script at 'https://cdn.jsdelivr.net/npm/console-log-hello-world' cannot be accessed from origin 'http://localhost:8080'."`
- `"Uncaught (in promise) DOMException: Failed to execute 'importScripts' on 'WorkerGlobalScope': The script at 'https://cdn.jsdelivr.net/npm/console-log-hello-world' failed to load.`

## Installation

```bash
npm install --save-dev remote-web-worker
```

## Usage

Apply Patch

```js
import 'remote-web-worker';
```

Initialize a Worker just like you would normally do:

```js
const worker = new Worker(
  'https://cdn.jsdelivr.net/npm/console-log-hello-world',
  { type: 'classic' }
);
```

## How it works

According to spec the Worker constructor accepts only local URLs, not remote URLs:
https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker 

As a workaround this patched Worker will use `importScripts` to load the remote script.
https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts

## Compatibility

 - Chrome 4+
 - Firefox 4+
 - Safari 4+

## Limitations

 - Only supports `type="classic"` workers (no `import` or `export`)

## License

MIT

[1]: https://bundlephobia.com/package/remote-web-worker