(() => {
  let opener;
  let closeTimer;
  const dialog = () => document.getElementById('hok-mega-menu');
  const reset = () => {
    clearTimeout(closeTimer);
    document.documentElement.classList.remove('hok-menu-is-open');
    document.querySelectorAll('[data-hok-menu-open]').forEach(button => button.setAttribute('aria-expanded', 'false'));
    dialog()?.classList.remove('is-closing');
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  };
  const close = (animate = true) => {
    const menu = dialog();
    if (!menu?.open || menu.classList.contains('is-closing')) return;
    if (!animate || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      menu.close();
      return;
    }
    menu.classList.add('is-closing');
    closeTimer = setTimeout(() => menu.close(), 180);
  };
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-hok-menu-open]');
    const menu = dialog();
    if (!menu) return;
    if (trigger) {
      opener = trigger;
      menu.querySelectorAll('a[href]').forEach(link => {
        if (link.getAttribute('href') === location.pathname) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
      trigger.setAttribute('aria-expanded', 'true');
      document.documentElement.classList.add('hok-menu-is-open');
      menu.showModal();
      menu.scrollTop = 0;
      return;
    }
    if (event.target.closest('[data-hok-menu-close]')) close();
    else if (menu.open && event.target.closest('#hok-mega-menu a[href]')) close(false);
    else if (event.target === menu) {
      const bounds = menu.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
    }
  });
  document.addEventListener('cancel', event => {
    if (event.target.id !== 'hok-mega-menu') return;
    event.preventDefault();
    close();
  }, true);
  document.addEventListener('close', event => {
    if (event.target.id === 'hok-mega-menu') reset();
  }, true);
})();
