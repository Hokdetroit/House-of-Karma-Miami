window.__ODYN_LR__ = true;

// Preserve the original shaders when supported; the source artwork covers devices without WebGL.
try {
  var testCanvas = document.createElement('canvas');
  var graphics = testCanvas.getContext('webgl2');
  if (graphics) {
    graphics.getExtension('WEBGL_lose_context')?.loseContext();
  } else {
    var fallback = document.createElement('style');
    fallback.textContent = '.home-hero_unicorn,.modal_unicorn{background-image:url(/site-assets/hero-poster.webp);background-size:cover;background-position:center}.home-hero_unicorn.is-mobile{display:none}@media(max-width:767px){.home-hero_unicorn:not(.is-mobile){display:none}.home-hero_unicorn.is-mobile{display:block}}';
    document.head.appendChild(fallback);
  }
} catch (_) {}

document.addEventListener('submit', function (event) {
  if (!(event.target instanceof HTMLFormElement)) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  var form = event.target;
  var notice = form.querySelector('[data-replica-notice]');
  if (!notice) {
    notice = document.createElement('p');
    notice.setAttribute('data-replica-notice', '');
    notice.setAttribute('role', 'status');
    notice.style.cssText = 'padding:16px;margin-top:16px;background:#edf5f2;color:#005453;border:1px solid #005453;font:inherit;';
    form.appendChild(notice);
  }
  notice.textContent = 'This is a website reproduction. Your message has not been sent. Contact-form delivery has not been connected.';
}, true);
