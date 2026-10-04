// Integration-test the actual dialog controller with a minimal host adapter.
// This verifies source lifecycle and focus/scroll restoration without claiming
// native browser layout, focus trapping or real codec playback validation.
import assert from 'node:assert/strict';
import { videos } from '../dist/content.js';

class Element {
  constructor(id = '') {
    this.id = id;
    this.handlers = new Map();
    this.children = [];
    this.attributes = new Map();
    this.dataset = {};
    this.isConnected = true;
    this.style = {
      values: new Map(),
      getPropertyValue(name) { return this.values.get(name) || ''; },
      getPropertyPriority() { return ''; },
      setProperty(name, value) { this.values.set(name, value); },
      removeProperty(name) { this.values.delete(name); },
    };
    const classes = new Set();
    this.classList = { add: (...names) => names.forEach(name => classes.add(name)), remove: (...names) => names.forEach(name => classes.delete(name)), contains: name => classes.has(name) };
  }
  addEventListener(name, callback, options = {}) {
    const list = this.handlers.get(name) || [];
    list.push({ callback, once: options.once });
    this.handlers.set(name, list);
  }
  emit(name, event = {}) {
    for (const handler of [...(this.handlers.get(name) || [])]) {
      handler.callback({ target: this, ...event });
      if (handler.once) this.handlers.set(name, this.handlers.get(name).filter(item => item !== handler));
    }
  }
  querySelectorAll(selector) { return selector === 'video' ? this.children.filter(child => child.tagName === 'VIDEO') : []; }
  querySelector(selector) { return selector === 'img' ? this.children.find(child => child.tagName === 'IMG') : null; }
  append(element) { this.children.push(element); }
  replaceChildren() { this.children = []; }
  contains(element) { return this.children.includes(element); }
  set innerHTML(value) { this.children = value.includes('<img') ? [Object.assign(new Element(), { tagName: 'IMG' })] : []; }
  setAttribute(name, value) { this.attributes.set(name, value); }
  removeAttribute(name) { this.attributes.delete(name); if (name === 'src') this.src = ''; }
  hasAttribute(name) { return this.attributes.has(name); }
  closest() { return this; }
  focus() { document.activeElement = this; }
}

const elements = new Map(['media-dialog', 'dialog-media', 'dialog-title', 'dialog-description', 'dialog-meta', 'dialog-counter', 'close-dialog', 'previous-media', 'next-media'].map(id => [id, new Element(id)]));
const dialog = elements.get('media-dialog');
dialog.showModal = () => { dialog.open = true; };
dialog.close = () => { dialog.open = false; dialog.emit('close'); };
dialog.getBoundingClientRect = () => ({ left: 10, top: 10, right: 380, bottom: 800 });
const media = elements.get('dialog-media');
const createdVideos = [];
globalThis.document = Object.assign(new Element(), {
  body: new Element(), documentElement: Object.assign(new Element(), { clientWidth: 390 }),
  querySelector: selector => elements.get(selector.replace(/^#/, '')) || null,
  createElement(tag) {
    assert.equal(tag, 'video', 'controller creates only requested video elements');
    const video = Object.assign(new Element(), {
      tagName: 'VIDEO', pauses: 0, loads: 0, plays: 0,
      pause() { this.pauses += 1; }, load() { this.loads += 1; },
      play() { this.plays += 1; return Promise.resolve(); },
    });
    createdVideos.push(video);
    return video;
  },
});
globalThis.matchMedia = () => ({ matches: true, addEventListener() {} });
globalThis.getComputedStyle = () => ({ paddingRight: '0' });
globalThis.window = { scrollX: 0, scrollY: 1250, innerWidth: 390, scrollTo(x, y) { this.scrollX = x; this.scrollY = y; } };
const trigger = new Element('work-trigger');
trigger.dataset.video = '0';
trigger.setAttribute('data-video', '0');
const click = element => element.emit('click');
const open = () => document.emit('click', { target: trigger });
const { initMediaDialog } = await import('../dist/v2-interactions.js');
initMediaDialog();
assert.equal(createdVideos.length, 0, 'initialization must not create video elements');

// A genuinely absent source opens an honest image preview, with no fake player.
open();
assert.equal(dialog.open, true);
assert.equal(createdVideos.length, 0);
assert.ok(media.querySelector('img'));
assert.match(elements.get('dialog-description').textContent, /превью будущей работы/);
assert.equal(document.activeElement.id, 'close-dialog');
assert.equal(document.body.style.getPropertyValue('position'), 'fixed');
click(elements.get('next-media'));
assert.equal(elements.get('dialog-counter').textContent, '02 / 12');
dialog.emit('cancel', { preventDefault() {} });
assert.equal(dialog.open, false);
assert.equal(document.activeElement, trigger, 'close restores focus to originating card');
assert.equal(window.scrollY, 1250, 'close restores original document position');
assert.equal(document.body.style.getPropertyValue('position'), '', 'body locking styles are restored');

// This fixture tests conditional attachment, not the availability of real media.
const oldSource = videos[0].src;
videos[0].src = '/__test_only__/explicitly-selected.mp4';
try {
  open();
  assert.equal(createdVideos.length, 1, 'one explicit selection creates one video');
  const first = createdVideos[0];
  assert.equal(first.src, videos[0].src);
  assert.equal(first.preload, 'none');
  assert.equal(first.playsInline, true);
  assert.equal(first.controls, true);
  click(elements.get('next-media'));
  assert.equal(first.src, '', 'next selection releases the former source');
  assert.equal(first.pauses, 1);
  assert.equal(first.loads, 1);
  assert.equal(media.querySelectorAll('video').length, 0, 'empty next source gets a photo preview');
  first.emit('error');
  assert.equal(elements.get('dialog-counter').textContent, '02 / 12', 'stale error cannot replace the new selection');
  assert.match(elements.get('dialog-description').textContent, /превью будущей работы/);
  click(elements.get('previous-media'));
  const second = createdVideos[1];
  second.emit('error');
  assert.equal(media.querySelectorAll('video').length, 0, 'failed source releases video');
  assert.ok(media.querySelector('img'), 'failed source keeps its real poster visible');
  assert.match(elements.get('dialog-description').textContent, /Не удалось загрузить видео/);
  click(elements.get('close-dialog'));
  assert.equal(document.activeElement, trigger);
  assert.equal(media.children.length, 0, 'closed dialog releases media');
} finally {
  videos[0].src = oldSource;
}
console.log('PASS: V2 dialog preview, next/previous, Escape cancellation, focus/scroll restore, lazy video attachment, source release and failed/stale video fallback. Real playback still requires supplied video files.');
