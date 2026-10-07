import assert from 'node:assert/strict';
import { setupServices } from '../dist/v2-services.js';

// Test the accessibility and lifecycle boundary without requiring a browser.
class Node extends EventTarget {
  constructor() {
    super();
    this.attrs = new Map(); this.style = {}; this.children = [];
    this.hidden = false; this.inert = false; this.disabled = false;
    this.scrollHeight = 640;
    const classes = new Set();
    this.classList = {
      toggle: (name, on) => on ? classes.add(name) : classes.delete(name),
      contains: name => classes.has(name),
      remove: (...names) => names.forEach(name => classes.delete(name)),
    };
    this.listeners = new Set();
  }
  setAttribute(name, value) { this.attrs.set(name, String(value)); }
  getAttribute(name) { return this.attrs.get(name); }
  querySelector() { return null; }
  querySelectorAll() { return []; }
  contains(node) { return this === node || this.children.includes(node); }
  focus() { document.activeElement = this; }
  scrollIntoView() { this.scrolledIntoView = true; }
  getBoundingClientRect() { return { top: 100 }; }
  addEventListener(type, handler) { this.listeners.add(handler); super.addEventListener(type, handler); }
  removeEventListener(type, handler) { this.listeners.delete(handler); super.removeEventListener(type, handler); }
}

function fixture() {
  const section = new Node();
  const dialog = new Node();
  const buttons = Array.from({ length: 4 }, () => new Node());
  const panels = Array.from({ length: 4 }, () => new Node());
  const rows = buttons.map((button, index) => {
    const row = new Node();
    row.querySelector = selector => ({ '.service-toggle': button, '.service-panel': panels[index] }[selector] || new Node());
    return row;
  });
  section.querySelectorAll = () => rows;
  section.children = panels;
  globalThis.document = { querySelector: selector => selector === '#service-index' ? section : selector === '#media-dialog' ? dialog : null, activeElement: null };
  globalThis.window = { innerHeight: 900, scrollY: 0, scrollTo: ({ top }) => { window.scrollY = top; } };
  let serial = 0;
  const frames = new Map();
  globalThis.requestAnimationFrame = callback => { frames.set(++serial, callback); return serial; };
  globalThis.cancelAnimationFrame = id => frames.delete(id);
  const contexts = [], triggers = [], tweens = [];
  const gsap = {
    context(callback) {
      const context = { reverted: false, revert() { this.reverted = true; } };
      contexts.push(context); callback(); return context;
    },
    timeline() { return { from() { return this; } }; },
    from() {},
    fromTo(target, from, to) {
      target.style.height = from.height;
      const tween = { killed: false, kill() { this.killed = true; }, finish() { if (!this.killed) to.onComplete?.(); } };
      tweens.push(tween); return tween;
    },
  };
  const ScrollTrigger = {
    refresh() {},
    update() {
      triggers.filter(trigger => !trigger.killed).forEach(trigger => trigger.options.onUpdate({ progress: (window.scrollY - trigger.start) / (trigger.end - trigger.start) }));
    },
    create(options) {
      const trigger = { options, start: 1000, end: 2620, killed: false, kill() { this.killed = true; } };
      triggers.push(trigger); return trigger;
    },
  };
  const expanded = () => buttons.map(button => button.getAttribute('aria-expanded') === 'true');
  const click = index => buttons[index].dispatchEvent(new Event('click'));
  const assertRestored = () => {
    assert.deepEqual(expanded(), [true, true, true, true]);
    assert.ok(panels.every(panel => !panel.hidden && !panel.inert));
    assert.ok(buttons.every(button => !button.disabled && !button.listeners.size));
    assert.ok(contexts.every(context => context.reverted));
    assert.ok(triggers.every(trigger => trigger.killed));
    assert.equal(frames.size, 0);
    assert.equal(dialog.listeners.size, 0);
  };
  return { section, dialog, buttons, panels, rows, gsap, ScrollTrigger, contexts, triggers, tweens, expanded, click, assertRestored };
}

for (const reduced of [true, false]) {
  const f = fixture();
  const reject = new Proxy({}, { get() { throw new Error('fallback must not allocate motion'); } });
  const cleanup = setupServices(reduced ? reject : null, reduced ? reject : null, { desktop: true, reduced });
  assert.deepEqual(f.expanded(), [true, true, true, true], 'fallback exposes all service details');
  assert.ok(f.buttons.every(button => button.disabled));
  assert.ok(f.panels.every(panel => !panel.hidden && !panel.inert));
  cleanup(); f.assertRestored();
}

{
  const f = fixture();
  const cleanup = setupServices(f.gsap, f.ScrollTrigger);
  assert.deepEqual(f.expanded(), [false, false, false, false], 'mobile starts as four collapsed native controls');
  assert.equal(f.triggers.length, 0, 'mobile has no pin');
  f.click(0);
  assert.deepEqual(f.expanded(), [true, false, false, false]);
  assert.equal(f.panels[0].inert, false);
  f.panels[0].children.push(new Node());
  document.activeElement = f.panels[0].children[0];
  f.click(2); // Rapid switching must cancel the earlier height completion.
  assert.equal(document.activeElement, f.buttons[0], 'focus cannot remain inside a hidden panel');
  assert.equal(f.tweens[0].killed, true);
  assert.deepEqual(f.expanded(), [false, false, true, false]);
  assert.equal(f.panels[0].inert, true);
  f.tweens.at(-1).finish();
  assert.equal(f.panels[2].style.height, '', 'open panel returns to natural responsive height');
  f.click(2);
  assert.deepEqual(f.expanded(), [false, false, false, false], 'current service can close');
  cleanup(); f.assertRestored();
  const again = setupServices(f.gsap, f.ScrollTrigger);
  f.click(3);
  assert.deepEqual(f.expanded(), [false, false, false, true], 'breakpoint re-entry adds only one listener');
  again(); f.assertRestored();
}

{
  const f = fixture();
  const cleanup = setupServices(f.gsap, f.ScrollTrigger, { desktop: true });
  assert.deepEqual(f.expanded(), [true, false, false, false]);
  assert.equal(f.triggers.length, 1);
  assert.equal(f.triggers[0].options.end(), '+=1620', 'all four scenes fit within 1.8 viewports of scrolling');
  for (let index = 0; index < 4; index += 1) {
    f.triggers[0].options.onUpdate({ progress: (index + 0.5) / 4 });
    assert.deepEqual(f.expanded(), [0, 1, 2, 3].map(value => value === index));
  }
  f.click(1);
  assert.deepEqual(f.expanded(), [false, true, false, false], 'direct selection and scroll remain in sync');
  f.dialog.open = true;
  f.triggers[0].options.onUpdate({ progress: 0 });
  f.triggers[0].options.onRefresh({ progress: 0 });
  assert.deepEqual(f.expanded(), [false, true, false, false], 'body locking cannot hide the media opener');
  cleanup();
  const mobile = setupServices(f.gsap, f.ScrollTrigger);
  assert.deepEqual(f.expanded(), [false, true, false, false], 'resize while playing preserves the open service');
  document.activeElement = f.panels[1];
  f.dialog.open = false;
  f.dialog.dispatchEvent(new Event('close'));
  assert.equal(f.buttons[1].scrolledIntoView, true, 'orientation change restores the service location after close');
  assert.deepEqual(f.expanded(), [false, true, false, false], 'modal close keeps the resized accordion selection');
  mobile(); f.assertRestored();
}
{
  const f = fixture();
  const cleanup = setupServices(f.gsap, f.ScrollTrigger, { desktop: true });
  f.triggers[0].options.onUpdate({ progress: 1 });
  assert.equal(f.expanded()[3], true, 'last service stays visible after pin exit');
  cleanup(); f.assertRestored();
}
console.log('PASS: Services mobile accordion, focus/inert state, rapid switching, natural panel height, reduced/no-GSAP fallback, bounded desktop pin, direct/scroll selection and breakpoint cleanup.');
