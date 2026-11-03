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
