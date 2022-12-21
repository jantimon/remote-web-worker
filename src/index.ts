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
typeof window !== "undefined" && (
    window.Worker = ((BaseWorker: typeof window.Worker) =>
        class Worker extends BaseWorker {
            constructor(scriptURL: string | URL, options?: WorkerOptions) {
                if (/^(http|\/\/)/.test(String(scriptURL))) {
                    super(URL.createObjectURL(new Blob([`importScripts( "${scriptURL}" );`], { type: "text/javascript" })));
                } else {
                    super(scriptURL, options);
                }
            }
        }
    )(window.Worker)
);

export type WorkerConstructor = typeof window.Worker;