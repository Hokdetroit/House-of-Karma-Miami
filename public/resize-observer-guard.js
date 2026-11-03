(() => {
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
