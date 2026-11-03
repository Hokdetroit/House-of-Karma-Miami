(() => {
  // This notification is benign per spec (observations are simply re-delivered
  // next frame). Observers created before this script, or by browser internals,
  // can still emit it, so stop it before other error listeners see it.
  const isResizeObserverLoopNotice = (message) =>
    typeof message === 'string' && message.includes('ResizeObserver loop');
  window.addEventListener(
    'error',
    (event) => {
      if (!isResizeObserverLoopNotice(event.message)) return;
      event.stopImmediatePropagation();
      event.preventDefault();
    },
    true,
  );
  const nativeOnError = window.onerror;
  window.onerror = function (message, ...rest) {
    if (isResizeObserverLoopNotice(message)) return true;
    return typeof nativeOnError === 'function' ? nativeOnError.call(this, message, ...rest) : false;
  };

  const NativeResizeObserver = window.ResizeObserver;
  if (!NativeResizeObserver || NativeResizeObserver.__hokDeferred) return;

  // Deliver resize callbacks on the next frame so layout changes made inside
  // third-party observers (Swiper, sliders, globe) cannot re-trigger the same
  // observation pass and raise "ResizeObserver loop completed" errors.
  class DeferredResizeObserver extends NativeResizeObserver {
    constructor(callback) {
      let frame = 0;
      let pending = [];
      super((entries, observer) => {
        pending = pending.concat(entries);
        if (frame) return;
        frame = requestAnimationFrame(() => {
          const batch = pending;
          pending = [];
          frame = 0;
          callback(batch, observer);
        });
      });
    }
  }

  DeferredResizeObserver.__hokDeferred = true;
  window.ResizeObserver = DeferredResizeObserver;
})();
