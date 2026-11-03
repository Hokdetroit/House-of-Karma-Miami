(() => {
  let cleanup = () => {};

  function initialize(root = document) {
    cleanup();
    const controller = new AbortController();
    const { signal } = controller;
    const filters = root.querySelectorAll('[data-portfolio-filter]');
    const projects = root.querySelectorAll('[data-project-category]');
    const pageType = root.querySelector('.hok-portfolio-hero') ? 'portfolio' : root.querySelector('.p-hero_heading') && root.querySelector('.hok-offerings') ? 'service' : '';
    if (pageType) document.body.dataset.hokPage = pageType;
    else delete document.body.dataset.hokPage;

    filters.forEach(button => button.addEventListener('click', () => {
      const category = button.dataset.portfolioFilter;
      filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
      let count = 0;
      projects.forEach(project => {
        project.hidden = category !== 'all' && category !== project.dataset.projectCategory;
        if (!project.hidden) {
          count += 1;
          project.classList.remove('is-waiting');
        }
      });
      root.querySelector('#portfolio-count').textContent = `${count} ${count === 1 ? 'project' : 'projects'}`;
      window.ScrollTrigger?.refresh();
    }, { signal }));

    root.querySelectorAll('[data-project-open]').forEach(button => {
      const dialog = root.querySelector('#' + button.dataset.projectOpen);
      if (!dialog) return;
      button.addEventListener('click', () => dialog.showModal(), { signal });
      dialog.addEventListener('click', event => {
        if (event.target !== dialog) return;
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
      }, { signal });
      dialog.addEventListener('close', () => button.focus({ preventScroll: true }), { signal });
    });

    const menus = document.querySelectorAll('[data-hok-service-menu]');
    document.addEventListener('click', event => menus.forEach(menu => {
      if (!menu.contains(event.target)) menu.open = false;
    }), { signal });
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      menus.forEach(menu => {
        if (menu.open) {
          menu.open = false;
          menu.querySelector('summary').focus();
        }
      });
    }, { signal });

    document.querySelectorAll('.nav_link, .nav_dropdown-link, .hok-nav-service-list a').forEach(link => {
      const active = link.getAttribute('href') === location.pathname;
      link.classList.toggle('w--current', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    const header = document.querySelector('.nav_component');
    const newSections = root.querySelectorAll('.hok-extension, .hok-portfolio-hero');
    const updateHeaderContrast = () => {
      if (!header) return;
      const menuOpen = innerWidth <= 991 && header.querySelector('[aria-expanded="true"]');
      const overLightSection = [...newSections].some(section => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= 60 && bounds.bottom > 60 && !section.classList.contains('hok-deep');
      });
      header.classList.toggle('hok-on-light', !menuOpen && overLightSection);
    };
    let contrastFrame = 0;
    const scheduleContrast = () => {
      if (contrastFrame) return;
      contrastFrame = requestAnimationFrame(() => {
        contrastFrame = 0;
        updateHeaderContrast();
      });
    };
    addEventListener('scroll', scheduleContrast, { passive: true, signal });
    addEventListener('resize', scheduleContrast, { signal });
    const menuObserver = new MutationObserver(scheduleContrast);
    if (header) {
      menuObserver.observe(header, { subtree: true, attributes: true, attributeFilter: ['aria-expanded'] });
      header.querySelector('nav')?.setAttribute('data-lenis-prevent', '');
    }
    updateHeaderContrast();

    let revealObserver;
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
      revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('is-waiting');
          revealObserver.unobserve(entry.target);
        }
      }), { threshold: 0.06 });
      root.querySelectorAll('.hok-reveal').forEach(element => {
        element.classList.add('is-waiting');
        revealObserver.observe(element);
      });
    }
    cleanup = () => {
      controller.abort();
      cancelAnimationFrame(contrastFrame);
      menuObserver.disconnect();
      revealObserver?.disconnect();
    };
  }

  initialize();
  window.barba?.hooks.afterEnter(({ next }) => initialize(next.container));
})();
