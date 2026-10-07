import assert from 'node:assert/strict';
import { initMobileNavigation } from '../dist/v2-navigation.js';

class Element extends EventTarget {
  constructor() {
    super(); this.attrs = new Map(); this.children = []; this.listeners = new Set();
    this.offsetHeight = 64; this.scrollTop = 0;
    const classes = new Set();
    this.classList = {
      add: (...names) => names.forEach(name => classes.add(name)),
      remove: (...names) => names.forEach(name => classes.delete(name)),
      contains: name => classes.has(name),
      toggle: (name, on) => on ? classes.add(name) : classes.delete(name),
    };
  }
  getAttribute(name) { return this.attrs.get(name) ?? null; }
  setAttribute(name, value) { this.attrs.set(name, String(value)); }
  removeAttribute(name) { this.attrs.delete(name); }
  contains(node) { return node === this || this.children.includes(node); }
  focus() { document.activeElement = this; }
  getBoundingClientRect() { return { top: this.top || 0, height: this.offsetHeight }; }
  addEventListener(type, fn, options) { this.listeners.add(fn); super.addEventListener(type, fn, options); }
  removeEventListener(type, fn, options) { this.listeners.delete(fn); super.removeEventListener(type, fn, options); }
}

function fixture({ motion = false, desktop = false } = {}) {
  const header = new Element(), toggle = new Element(), close = new Element(), dialog = new Element();
  const root = new Element(), body = new Element(), logo = new Element(), bottom = new Element(), fawn = new Element();
  const star = new Element(), petals = new Element(), content = new Element();
  const mobile = new Element(); mobile.matches = !desktop;
  const reduced = new Element(); reduced.matches = !motion;
  const targets = new Map();
  const links = ['about', 'niches', 'work', 'service-index', 'services', 'contact'].map((id, index) => {
    const link = new Element(); link.hash = `#${id}`; link.setAttribute('href', link.hash);
    link.closest = () => link;
    const target = new Element(); target.top = [800, 1600, 2400, 4000, 3200, 4800][index];
    target.scrollIntoView = options => { target.scrollOptions = options; };
    targets.set(id, target); return link;
  });
  const email = new Element(); email.setAttribute('href', 'mailto:lbritakina@gmail.com'); email.closest = () => email;
  dialog.children = [logo, close, ...links, email];
  const nodes = [header, toggle, close, dialog, root, body, logo, bottom, fawn, star, petals, content, mobile, reduced, ...links, email];
  header.querySelector = () => logo;
  dialog.querySelector = selector => ({ '.mobile-menu-body': content, '.mobile-menu-fawn': fawn, '.mobile-menu-bottom': bottom, '.mobile-menu-star': star }[selector] || null);
  dialog.querySelectorAll = selector => ({ '.mobile-menu-links>a': links, '.mobile-menu-decor': [star, petals], 'a[href],button:not(:disabled)': dialog.children }[selector] || []);
  dialog.showModal = () => { dialog.open = true; };
  dialog.close = () => { dialog.open = false; dialog.dispatchEvent(new Event('close')); };
  const allocations = [];
  if (motion) nodes.forEach(node => {
    node.animate = () => {
      let resolve;
      const animation = { cancelled: false, finished: new Promise(done => { resolve = done; }), cancel() { this.cancelled = true; resolve(); }, finish() { resolve(); } };
      allocations.push(animation); return animation;
    };
  });
  const windowNode = new Element(); windowNode.scrollY = 500; windowNode.innerHeight = 844;
  windowNode.scrollTo = options => { windowNode.scrollY = options.top; };
  windowNode.ScrollTrigger = { refresh() {} };
  globalThis.window = windowNode;
  globalThis.document = { body, documentElement: root, activeElement: null,
    querySelector: selector => ({ '#mobile-navigation': dialog, '#mobile-menu-toggle': toggle, '#mobile-menu-close': close, '.site-header': header }[selector] || null),
    getElementById: id => targets.get(id),
  };
  globalThis.matchMedia = query => query.includes('reduced') ? reduced : mobile;
  globalThis.getComputedStyle = () => ({ clipPath: 'none', opacity: '1', scrollPaddingTop: '78px' });
  globalThis.location = { hash: '' };
  globalThis.history = { pushState: (state, title, hash) => { location.hash = hash; } };
  const frames = new Map(); let serial = 0;
  globalThis.requestAnimationFrame = fn => { frames.set(++serial, fn); return serial; };
  globalThis.cancelAnimationFrame = id => frames.delete(id);
  let locks = 0, unlocks = 0;
  const lock = () => {
    locks += 1; body.classList.add('mobile-menu-open');
    const y = window.scrollY; window.scrollY = 0;
    return trigger => { unlocks += 1; window.scrollY = y; body.classList.remove('mobile-menu-open'); trigger.focus(); };
  };
  const flush = () => { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(fn => fn(performance.now() + 1000)); };
  const click = node => node.dispatchEvent(new Event('click'));
  const activate = node => {
    const event = new Event('click', { cancelable: true });
    Object.defineProperty(event, 'target', { value: node }); dialog.dispatchEvent(event);
  };
  const key = (key, shiftKey = false) => {
    const event = new Event('keydown', { cancelable: true });
    Object.assign(event, { key, shiftKey }); dialog.dispatchEvent(event); return event;
  };
  const cleanup = initMobileNavigation(lock);
  return { header, toggle, close, dialog, root, body, links, targets, mobile, reduced, email, logo, allocations, click, activate, key, flush, cleanup,
    get locks() { return locks; }, get unlocks() { return unlocks; },
    assertClean() { assert.equal(locks, unlocks); assert.ok(!dialog.open); assert.ok(!body.classList.contains('mobile-menu-open')); assert.ok(nodes.every(node => !node.listeners.size)); assert.equal(windowNode.listeners.size, 0); assert.equal(frames.size, 0); },
  };
}

{
  const f = fixture();
  f.targets.get('services').top = -300;
  f.targets.get('service-index').top = -20;
  f.click(f.toggle);
  assert.equal(f.toggle.getAttribute('aria-expanded'), 'true');
  assert.equal(f.links[3].getAttribute('aria-current'), 'location', 'active service follows geometry, not menu order');
  assert.equal(document.activeElement, f.links[3]);
  assert.equal(f.locks, 1);
  f.email.focus(); assert.equal(f.key('Tab').defaultPrevented, true); assert.equal(document.activeElement, f.logo);
  assert.equal(f.key('Tab', true).defaultPrevented, true); assert.equal(document.activeElement, f.email);
  const escape = new Event('cancel', { cancelable: true }); f.dialog.dispatchEvent(escape);
  assert.equal(escape.defaultPrevented, true);
  assert.equal(f.dialog.open, false); assert.equal(document.activeElement, f.toggle);
  assert.equal(window.scrollY, 500);
  f.flush();
  for (const link of f.links) {
    f.click(f.toggle); f.activate(link); f.flush(); f.flush();
    assert.equal(location.hash, link.hash);
    assert.equal(f.targets.get(link.hash.slice(1)).scrollOptions.behavior, 'instant');
    assert.equal(f.dialog.open, false);
  }
  f.cleanup(); f.assertClean();
}
{
  const f = fixture();
  // Browsers queue the native close event; reopening can happen before delivery.
  f.dialog.close = () => { f.dialog.open = false; };
  f.click(f.toggle); f.activate(f.links[2]); f.click(f.toggle);
  f.dialog.dispatchEvent(new Event('close'));
  f.flush();
  assert.equal(f.dialog.open, true, 'an old close event cannot dismiss a reopened menu');
  assert.equal(f.targets.get('work').scrollOptions, undefined, 'old navigation cannot run under a reopened menu');
  f.cleanup(); f.assertClean();
}
{
  const f = fixture();
  f.click(f.toggle); f.reduced.matches = false; f.activate(f.links[2]);
  f.flush(); f.flush(); f.flush();
  assert.equal(window.scrollY, 500 + 2400 - 78, 'menu scrolling reaches the anchor below the fixed header');
  f.click(f.toggle); f.activate(f.links[0]); f.flush(); f.flush();
  const before = window.scrollY;
  window.dispatchEvent(new Event('touchstart')); f.flush();
  assert.equal(window.scrollY, before, 'touch input takes over from the menu scroll');
  f.cleanup(); f.assertClean();
}
{
  const f = fixture({ motion: true });
  f.click(f.toggle); f.click(f.close); f.click(f.close); // Reopen while closing.
  assert.equal(f.locks, 1, 'rapid reversal never nests body locks');
  f.allocations.forEach(animation => animation.finish());
  await Promise.resolve(); await Promise.resolve();
  assert.equal(f.dialog.open, true); assert.equal(f.toggle.getAttribute('aria-expanded'), 'true');
  f.click(f.close);
  f.reduced.matches = true; f.reduced.dispatchEvent(new Event('change'));
  assert.equal(f.dialog.open, false, 'enabling reduced motion finishes an in-flight close');
  assert.equal(f.unlocks, 1);
  f.flush(); f.click(f.toggle);
  f.mobile.matches = false; f.mobile.dispatchEvent(new Event('change'));
  assert.equal(f.dialog.open, false); assert.equal(document.activeElement, f.logo);
  f.cleanup(); f.assertClean();
}
{
  const f = fixture({ desktop: true });
  f.click(f.toggle);
  assert.equal(f.locks, 0, 'desktop cannot open the mobile dialog');
  assert.equal(f.dialog.open, undefined);
  f.cleanup(); f.assertClean();
}
console.log('PASS: Mobile navigation real anchors, geometry-based active state, focus/Tab/Escape, six destinations, reduced motion, animation reversal, single scroll-lock ownership, desktop breakpoint and cleanup.');
