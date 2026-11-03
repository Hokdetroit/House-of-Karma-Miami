import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

class Element extends EventTarget {
  constructor(dataset = {}) {
    super();
    this.dataset = dataset;
    this.attributes = {};
    this.hidden = false;
    this.classes = new Set();
    this.classList = {
      add: value => this.classes.add(value),
      remove: value => this.classes.delete(value),
      contains: value => this.classes.has(value),
      toggle: (value, force) => force ? this.classes.add(value) : this.classes.delete(value),
    };
  }
  setAttribute(name, value) { this.attributes[name] = value; }
  getAttribute(name) { return this.attributes[name]; }
  removeAttribute(name) { delete this.attributes[name]; }
  querySelector() { return null; }
  querySelectorAll() { return []; }
}

function portfolio() {
  const root = new Element();
  root.filters = ['all', 'healthcare', 'infrastructure', 'production'].map(portfolioFilter => new Element({ portfolioFilter }));
  root.projects = ['healthcare', 'healthcare', 'healthcare', 'infrastructure', 'production', 'production'].map(projectCategory => new Element({ projectCategory }));
  root.count = { textContent: '6 projects' };
  root.querySelectorAll = selector => selector === '[data-portfolio-filter]' ? root.filters : selector === '[data-project-category]' ? root.projects : [];
  root.querySelector = selector => selector === '#portfolio-count' ? root.count : selector === '.hok-portfolio-hero' ? {} : null;
  root.body = { dataset: {} };
  return root;
}

test('portfolio filters update visibility, count, and pressed state without synthetic resize', () => {
  const document = portfolio();
  let afterEnter;
  let refreshes = 0;
  const context = {
    document, AbortController, location: { pathname: '/portfolio' }, innerWidth: 1440,
    addEventListener() {}, cancelAnimationFrame() {}, requestAnimationFrame() { return 1; },
    matchMedia() { return { matches: true }; },
    MutationObserver: class { observe() {} disconnect() {} },
    ScrollTrigger: { refresh() { refreshes++; } },
    barba: { hooks: { afterEnter(callback) { afterEnter = callback; } } },
  };
  context.window = context;
  vm.runInNewContext(readFileSync(new URL('../public/healthcare-pages.js', import.meta.url), 'utf8'), context);
  document.filters[1].dispatchEvent(new Event('click'));
  assert.equal(document.projects.filter(project => !project.hidden).length, 3);
  assert.equal(document.count.textContent, '3 projects');
  assert.equal(document.filters[1].attributes['aria-pressed'], 'true');
  assert.equal(document.filters[0].attributes['aria-pressed'], 'false');
  document.filters[2].dispatchEvent(new Event('click'));
  assert.equal(document.count.textContent, '1 project');
  document.filters[0].dispatchEvent(new Event('click'));
  assert.equal(document.count.textContent, '6 projects');
  assert.equal(refreshes, 3);
  const next = portfolio();
  afterEnter({ next: { container: next } });
  document.filters[1].dispatchEvent(new Event('click'));
  assert.equal(document.count.textContent, '6 projects', 'old-page handlers are removed');
  next.filters[1].dispatchEvent(new Event('click'));
  assert.equal(next.count.textContent, '3 projects', 'new-page controls are initialized after animated navigation');
  assert.equal(document.body.dataset.hokPage, 'portfolio');
});

test('mega menu opens, closes with Escape, restores focus, and resets its trigger', () => {
  const listeners = {};
  const trigger = new Element();
  trigger.isConnected = true;
  let focused = false;
  trigger.focus = () => { focused = true; };
  const menu = new Element();
  menu.id = 'hok-mega-menu';
  menu.showModal = () => { menu.open = true; };
  menu.close = () => { menu.open = false; listeners.close({ target: menu }); };
  const document = {
    documentElement: new Element(),
    getElementById: () => menu,
    querySelectorAll: () => [trigger],
    addEventListener: (event, handler) => { listeners[event] = handler; },
  };
  const context = { document, location: { pathname: '/' }, clearTimeout, setTimeout, matchMedia: () => ({ matches: true }) };
  vm.runInNewContext(readFileSync(new URL('../public/mega-menu.js', import.meta.url), 'utf8'), context);
  const target = { closest: selector => selector === '[data-hok-menu-open]' ? trigger : null };
  listeners.click({ target });
  assert.equal(menu.open, true);
  assert.equal(trigger.attributes['aria-expanded'], 'true');
  assert.equal(document.documentElement.classList.contains('hok-menu-is-open'), true);
  let prevented = false;
  listeners.cancel({ target: menu, preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(menu.open, false);
  assert.equal(trigger.attributes['aria-expanded'], 'false');
  assert.equal(document.documentElement.classList.contains('hok-menu-is-open'), false);
  assert.equal(focused, true);
});
