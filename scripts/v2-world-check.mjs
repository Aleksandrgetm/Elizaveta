import assert from 'node:assert/strict';
import { setupWorld } from '../dist/v2-world.js';

// A small DOM/event boundary fixture keeps this suite dependency-free. Scroll
// positions are driven explicitly: smooth scrolling must not finish instantly
// in the fixture, otherwise intermediate-category and focus bugs are missed.
class Element extends EventTarget {
  constructor(name, attributes = {}) {
    super();
    this.name = name;
    this.attributes = new Map(Object.entries(attributes));
    this.classes = new Set();
    this.listeners = new Map();
    this.style = {};
    this.children = [];
    this.inert = false;
    this.clientWidth = 320;
    this.scrollWidth = 320;
    this.scrollLeft = 0;
    this.scrollCalls = [];
    this.classList = {
      contains: name => this.classes.has(name),
      toggle: (name, on) => on ? this.classes.add(name) : this.classes.delete(name),
    };
    const attribute = key => `data-${key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`;
    this.dataset = new Proxy({}, {
      get: (_, key) => this.getAttribute(attribute(key)) ?? undefined,
      set: (_, key, value) => { this.setAttribute(attribute(key), value); return true; },
    });
  }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  removeAttribute(name) { this.attributes.delete(name); }
  get tabIndex() { return Number(this.getAttribute('tabindex') ?? -1); }
  set tabIndex(value) { this.setAttribute('tabindex', value); }
  contains(element) { return this === element || this.children.some(child => child.contains(element)); }
  focus(options) { document.activeElement = this; this.focusOptions = options; }
  getBoundingClientRect() { return { left: 20, right: 20 + this.clientWidth, width: this.clientWidth }; }
  addEventListener(type, handler, options) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(handler);
    super.addEventListener(type, handler, options);
  }
  removeEventListener(type, handler, options) {
    this.listeners.get(type)?.delete(handler);
    super.removeEventListener(type, handler, options);
  }
  get listenerCount() { return [...this.listeners.values()].reduce((sum, listeners) => sum + listeners.size, 0); }
  scrollTo(options) {
    this.scrollCalls.push(options);
    this.requestedLeft = Math.max(0, Math.min(this.scrollWidth - this.clientWidth, options.left));
    if (options.behavior !== 'smooth') this.driveScroll(this.requestedLeft);
  }
  driveScroll(left) {
    this.scrollLeft = Math.max(0, Math.min(this.scrollWidth - this.clientWidth, left));
    this.dispatchEvent(new Event('scroll'));
  }
}

function fixture() {
  const nodes = [];
  const element = (name, attrs) => { const node = new Element(name, attrs); nodes.push(node); return node; };
  const section = element('section');
  const pin = element('pin');
  const stage = element('stage'); stage.clientWidth = 1100;
  const rail = element('rail');
  const nav = element('nav'); nav.clientWidth = 300; nav.scrollWidth = 610;
  const portrait = element('portrait');
  const headings = [element('marker'), element('heading')];
  const portraitLayers = [element('face'), element('frame')];
  const categories = ['beauty', 'fashion', 'lifestyle', 'wellness', 'travel'];
  const offset = index => index * (rail.clientWidth + 24);
  Object.defineProperty(rail, 'scrollWidth', { get: () => categories.length * rail.clientWidth + 24 * (categories.length - 1) });
  const panels = categories.map((category, index) => {
    const panel = element(`panel-${index}`, { 'data-category': category });
    const picture = element(`picture-${index}`);
    const copy = element(`copy-${index}`);
    copy.children = [element(`index-${index}`), element(`title-${index}`), element(`text-${index}`)];
    panel.children = [picture, copy];
    panel.querySelector = selector => selector === '.world-category-image' ? picture : selector === '.world-state-copy' ? copy : null;
    panel.getBoundingClientRect = () => ({ left: 20 + offset(index) - rail.scrollLeft, right: 20 + offset(index) - rail.scrollLeft + rail.clientWidth, width: rail.clientWidth });
    panel.classList.toggle('is-active', index === 0);
    return panel;
  });
  const tabs = categories.map((category, index) => {
    const tab = element(`tab-${index}`, { 'data-category': category, 'aria-selected': String(index === 0), tabindex: index === 0 ? '0' : '-1' });
    tab.classList.toggle('is-active', index === 0);
    tab.getBoundingClientRect = () => ({ left: 20 + index * 122 - nav.scrollLeft, right: 130 + index * 122 - nav.scrollLeft, width: 110 });
    return tab;
  });
  section.querySelector = selector => ({ '.world-pin': pin, '.world-stage': stage, '.world-slides': rail, '.world-nav': nav, '.world-portrait': portrait }[selector] || null);
  section.querySelectorAll = selector => ({ '.world-state': panels, '.world-tab': tabs, '.section-marker, .world-heading': headings, '.world-face, .world-frame': portraitLayers }[selector] || []);
  globalThis.document = { querySelector: selector => selector === '.world' ? section : null, activeElement: null };
  const windowNode = element('window');
  windowNode.innerHeight = 900;
  windowNode.scrollY = 0;
  windowNode.scrollTo = options => { windowNode.scrollCalls.push(options); windowNode.scrollY = options.top; };
  globalThis.window = windowNode;
  let serial = 0;
  const frames = new Map();
  globalThis.requestAnimationFrame = callback => { frames.set(++serial, callback); return serial; };
  globalThis.cancelAnimationFrame = id => frames.delete(id);
  const flush = () => {
    let loops = 0;
    while (frames.size) {
      assert.ok(++loops < 20, 'animation frame callbacks must settle');
      const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(callback => callback());
    }
  };
  const current = () => tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
  const click = index => tabs[index].dispatchEvent(new Event('click'));
  const key = (index, key) => {
    const event = new Event('keydown', { cancelable: true });
    Object.defineProperty(event, 'key', { value: key });
    tabs[index].dispatchEvent(event);
    return event;
  };
  const arrive = () => { rail.driveScroll(rail.requestedLeft); rail.dispatchEvent(new Event('scrollend')); flush(); };
  const assertClean = () => {
    assert.equal(nodes.reduce((sum, node) => sum + node.listenerCount, 0), 0, 'all World DOM/window listeners are removed');
    assert.equal(frames.size, 0, 'pending RAF is cancelled');
    assert.equal(section.classList.contains('is-story-desktop'), false);
    assert.equal(section.getAttribute('data-world-active'), null);
    panels.forEach((panel, index) => {
      assert.equal(panel.inert, false, 'baseline panel accessibility restored');
      assert.equal(panel.getAttribute('aria-hidden'), null);
      assert.equal(panel.classList.contains('is-active'), index === 0);
    });
    tabs.forEach((tab, index) => {
      assert.equal(tab.getAttribute('aria-selected'), String(index === 0));
      assert.equal(tab.tabIndex, index === 0 ? 0 : -1);
    });
  };
  return { section, pin, stage, rail, nav, portrait, portraitLayers, headings, panels, tabs, window: windowNode, offset, flush, current, click, key, arrive, assertClean };
}

function animationBoundary() {
  const contexts = [];
  const timelines = [];
  const triggers = [];
  let owner;
  const gsap = {
    set() {},
    context(callback) {
      const context = {
        reverted: false,
        add(name, handler) {
          this[name] = (...args) => { const previous = owner; owner = this; try { return handler(...args); } finally { owner = previous; } };
        },
        revert() { this.reverted = true; timelines.filter(timeline => timeline.owner === this).forEach(timeline => timeline.kill()); },
      };
      contexts.push(context); callback(context); return context;
    },
    timeline(options = {}) {
      const timeline = {
        options, owner, killed: false, calls: [],
        to(target, values, at = 0) { this.calls.push({ target, values, at }); return this; },
        from(target, values, at = 0) { this.calls.push({ target, values, at }); return this; },
        fromTo(target, from, values, at = 0) { this.calls.push({ target, from, values, at }); return this; },
        kill() { this.killed = true; },
      };
      timelines.push(timeline); return timeline;
    },
  };
  const ScrollTrigger = {
    create(options) {
      const trigger = {
        options, start: 1800, end: 1800 + Number(options.end().slice(2)), progress: 0, killed: false,
        kill(revert) { this.killed = true; this.reverted = revert; },
        drive(progress) { this.progress = progress; options.onUpdate(this); },
        refresh(progress = this.progress) { this.progress = progress; options.onRefresh(this); },
      };
      triggers.push(trigger); trigger.refresh(); return trigger;
    },
    update() { triggers.filter(trigger => !trigger.killed).forEach(trigger => trigger.drive(Math.max(0, Math.min(1, (window.scrollY - trigger.start) / (trigger.end - trigger.start))))); },
  };
  return { gsap, ScrollTrigger, contexts, timelines, triggers };
}

const rejectAllocation = () => { throw new Error('Native/reduced World allocated an animation or pin'); };
const forbiddenGsap = { context: rejectAllocation, timeline: rejectAllocation, set: rejectAllocation, from: rejectAllocation, fromTo: rejectAllocation, to: rejectAllocation };
const forbiddenScrollTrigger = { create: rejectAllocation };

// Accessibility preferences and failed vendor loading keep all controls usable.
for (const [gsap, scroll, options] of [
  [forbiddenGsap, forbiddenScrollTrigger, { desktop: true, reduced: true }],
  [null, forbiddenScrollTrigger, { desktop: true }],
  [forbiddenGsap, null, { desktop: true }],
]) {
  const f = fixture();
  const cleanup = setupWorld(gsap, scroll, options); f.flush();
  f.click(4); f.arrive();
  assert.equal(f.current(), 4, 'fallback tabs reach every category');
  assert.equal(f.window.scrollCalls.length, 0, 'native controls never move vertical page scroll');
  if (options.reduced) assert.equal(f.rail.scrollCalls.at(-1).behavior, 'instant');
  cleanup(); f.assertClean();
}

// A smooth tab jump must retain the requested category while passing others;
// a real swipe/wheel input cancels that intent and immediately follows the user.
{
  const f = fixture();
  const cleanup = setupWorld(forbiddenGsap, forbiddenScrollTrigger, { desktop: false }); f.flush();
  f.click(4);
  f.rail.driveScroll(f.offset(1)); f.flush();
  assert.equal(f.current(), 4, 'intermediate smooth-scroll positions cannot replace the clicked tab');
  f.arrive(); assert.equal(f.current(), 4);
  f.click(0);
  f.rail.dispatchEvent(new Event('pointerdown'));
  f.rail.driveScroll(f.offset(2)); f.flush();
  assert.equal(f.current(), 2, 'touch takes over from a pending tab jump');
  f.click(4);
  f.rail.dispatchEvent(new Event('wheel'));
  f.rail.driveScroll(f.offset(1)); f.flush();
  assert.equal(f.current(), 1, 'wheel input takes over from a pending tab jump');
  assert.equal(f.key(1, 'End').defaultPrevented, true); f.arrive(); assert.equal(f.current(), 4);
  assert.equal(document.activeElement, f.tabs[4]);
  assert.deepEqual(f.tabs[4].focusOptions, { preventScroll: true });
  f.key(4, 'ArrowRight'); f.arrive(); assert.equal(f.current(), 0, 'right arrow wraps');
  f.key(0, 'ArrowLeft'); f.arrive(); assert.equal(f.current(), 4, 'left arrow wraps');
  f.key(4, 'Home'); f.arrive(); assert.equal(f.current(), 0);
  assert.equal(f.key(0, 'Escape').defaultPrevented, false, 'unrelated keys remain native');
  document.activeElement = f.panels[0];
  f.click(3); f.arrive();
  assert.equal(document.activeElement, f.tabs[3], 'focus leaves a panel before it becomes inactive');
  assert.equal(f.panels[0].inert, true); assert.equal(f.panels[3].inert, false);
  f.rail.clientWidth = 250;
  f.window.dispatchEvent(new Event('resize')); f.flush();
  assert.equal(f.rail.scrollLeft, f.offset(3), 'resize retains the active native slide');
  assert.ok(f.nav.scrollCalls.some(call => call.left > 0), 'overflowing tab row reveals the selected category');
  assert.ok(f.nav.scrollCalls.every(call => !('top' in call)), 'tab row scrolls only horizontally');
  assert.equal(f.window.scrollCalls.length, 0);
  f.rail.driveScroll(f.offset(2)); // leave a pending callback for cleanup to cancel
  cleanup(); f.assertClean();
  const calls = f.rail.scrollCalls.length;
  f.click(1); assert.equal(f.rail.scrollCalls.length, calls, 'disposed click handlers do not run');
}

// Desktop links scroll position, category, focus and transitions, then reverts
// every owned animation/pin before the same DOM becomes a native carousel.
{
  const f = fixture();
  const a = animationBoundary();
  const cleanup = setupWorld(a.gsap, a.ScrollTrigger, { desktop: true });
  assert.equal(a.triggers.length, 1, 'one storytelling pin');
  const trigger = a.triggers[0];
  assert.equal(trigger.options.pin, f.pin);
  assert.ok(trigger.end - trigger.start >= window.innerHeight * 2.2 && trigger.end - trigger.start <= window.innerHeight * 2.8, 'pin remains short');
  for (let index = 0; index < 5; index += 1) {
    f.click(index);
    assert.equal(f.current(), index, 'every tab reaches its matching desktop state');
    assert.ok(Math.abs(trigger.progress - index / 4) < 0.001, 'tab scroll and rendered state agree');
    assert.equal(f.window.scrollCalls.at(-1).behavior, 'instant', 'tab click avoids intermediate scroll states');
  }
  document.activeElement = f.panels[4].children[1].children[0];
  trigger.drive(0.5); assert.equal(f.current(), 2);
  assert.equal(document.activeElement, f.tabs[2], 'scroll-driven state changes preserve usable keyboard focus');
  trigger.drive(1); trigger.drive(0); trigger.drive(0.75);
  assert.equal(f.current(), 3);
  assert.ok(a.timelines.filter(timeline => !timeline.options.scrollTrigger && timeline.killed).length >= 3, 'rapid state changes cancel old transitions');
  trigger.refresh(); assert.equal(f.current(), 3, 'refresh at a stable progress preserves the category');
  const intro = a.timelines.find(timeline => timeline.options.scrollTrigger);
  assert.ok(intro, 'desktop has a short entrance');
  assert.equal(intro.options.scrollTrigger.start, 'top 80%');
  assert.equal(intro.options.scrollTrigger.once, true);
  assert.ok(intro.calls.every(call => call.target !== f.portrait), 'intro never competes with portrait position/rotation');
  assert.ok(intro.calls.some(call => call.target === f.nav && call.values.clipPath), 'navigation entrance uses a wipe');
  const duration = Math.max(...intro.calls.map(call => call.at + call.values.duration + (call.values.stagger || 0) * (Array.isArray(call.target) ? call.target.length - 1 : 0)));
  assert.ok(duration >= 0.6 && duration <= 0.8, 'entrance finishes in 0.6–0.8 seconds');
  assert.equal(intro.owner, a.contexts[0], 'entrance belongs to the cleanup context');
  cleanup(); f.assertClean();
  assert.equal(trigger.killed, true); assert.equal(trigger.reverted, true);
  assert.ok(a.contexts.every(context => context.reverted));
  assert.ok(a.timelines.every(timeline => timeline.killed), 'intro and state transitions are all disposed');
  const nativeCleanup = setupWorld(null, null, { reduced: true }); f.flush();
  assert.equal(f.current(), 3, 'mode change remembers the active category');
  assert.equal(f.rail.scrollLeft, f.offset(3));
  nativeCleanup(); f.assertClean();
}

console.log('PASS: World reduced/no-GSAP fallback, native tab/swipe intent, keyboard/focus, resize, desktop scroll states, intro ownership, and animation/listener cleanup.');
