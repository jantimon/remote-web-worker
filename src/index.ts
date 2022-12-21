// Patch Worker to allow loading scripts from remote URLs
//
// It's a workaround for the fact that the Worker constructor
// accepts only local URLs, not remote URLs:
// https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker
//
// As a workaround this patched Worker constructor will
// use `importScripts` to load the remote script.
// https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts
//
// Compatibility: Chrome 4+, Firefox 4+, Safari 4+
//
// Usage:
// ```ts
// import "remote-web-worker";
// ```
typeof window !== "undefined" &&
  (Worker = ((BaseWorker: typeof Worker) =>
    class Worker extends BaseWorker {
      constructor(scriptURL: string | URL, options?: WorkerOptions) {
        const url = String(scriptURL);
        super(
          // Check if the URL is remote
          /^(http|\/\/)/.test(url) && !url.startsWith(location.origin)
            ? // Launch the worker with an inline script that will use `importScripts`
              // to bootstrap the actual script to work around the same origin policy.
              URL.createObjectURL(
                new Blob(
                  [
                    // Replace the `importScripts` function with
                    // a patched version that will resolve relative URLs
                    // to the remote script URL.
                    `importScripts=((baseImportScripts)=>(...args)=>baseImportScripts(...args.map((url)=>''+new URL(url,"${url}"))))(importScripts);importScripts("${url}")`,
                  ],
                  { type: "text/javascript" }
                )
              )
            : scriptURL,
          options
        );
      }
    })(Worker));

export type WorkerConstructor = typeof window.Worker;
