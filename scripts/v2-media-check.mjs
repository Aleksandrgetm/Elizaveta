// Exercise the actual dialog controller with a minimal host adapter. Source
// attachment, loading, cancellation and focus are real controller branches;
// native browser layout, network transport and codec playback need browser QA.
import assert from 'node:assert/strict';
import { videos } from '../dist/content.js?v=ugc-20261005';

class Element {
  constructor(id = '', tagName = 'DIV') {
    this.id = id;
    this.tagName = tagName;
    this.handlers = new Map();
    this.children = [];
    this.attributes = new Map();
    this.dataset = {};
    this.isConnected = true;
    this.hidden = false;
    this.classes = new Set();
    this.style = {
      values: new Map(),
      getPropertyValue(name) { return this.values.get(name) || ''; },
      getPropertyPriority() { return ''; },
      setProperty(name, value) { this.values.set(name, value); },
      removeProperty(name) { this.values.delete(name); },
    };
    this.classList = {
      add: (...names) => names.forEach(name => this.classes.add(name)),
      remove: (...names) => names.forEach(name => this.classes.delete(name)),
      contains: name => this.classes.has(name),
    };
  }
  set className(value) { this.classes = new Set(value.split(/\s+/)); }
  get className() { return [...this.classes].join(' '); }
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
  matches(selector) {
    return selector.split(',').some(part => {
      const candidate = part.trim();
      if (candidate.startsWith('.')) return this.classes.has(candidate.slice(1));
      const attribute = candidate.match(/^\[([^\]]+)\]$/)?.[1];
      if (attribute) return this.hasAttribute(attribute);
      return candidate.toUpperCase() === this.tagName;
    });
  }
  querySelectorAll(selector) {
    return this.children.flatMap(child => [...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector)]);
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  append(...elements) { elements.forEach(element => { element.parentElement = this; this.children.push(element); }); }
  replaceChildren() { this.children.forEach(child => { child.parentElement = null; }); this.children = []; }
  contains(element) { return element === this || this.children.some(child => child.contains(element)); }
  set innerHTML(value) {
    this.replaceChildren();
    if (value.includes('<img')) {
      const image = new Element('', 'IMG');
      image.src = value.match(/<img[^>]*\bsrc="([^"]+)"/)?.[1] || '';
      this.append(image);
    }
  }
  setAttribute(name, value) { this.attributes.set(name, value); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  removeAttribute(name) { this.attributes.delete(name); if (name === 'src') this.src = ''; }
  hasAttribute(name) { return this.attributes.has(name); }
  closest(selector) { return this.matches(selector) ? this : this.parentElement?.closest(selector) || null; }
  focus() { document.activeElement = this; }
}

const ids = ['media-dialog', 'dialog-media', 'dialog-title', 'dialog-description', 'dialog-meta', 'dialog-counter', 'close-dialog', 'previous-media', 'next-media'];
const elements = new Map(ids.map(id => [id, new Element(id)]));
const dialog = elements.get('media-dialog');
const media = elements.get('dialog-media');
const description = elements.get('dialog-description');
dialog.append(elements.get('close-dialog'), media, elements.get('previous-media'), elements.get('next-media'));
dialog.showModal = () => { dialog.open = true; };
dialog.close = () => { dialog.open = false; dialog.emit('close'); };
dialog.getBoundingClientRect = () => ({ left: 10, top: 10, right: 380, bottom: 800 });
const createdVideos = [];
const attachedSources = [];
const lifecycle = [];
const playPlans = [];
globalThis.document = Object.assign(new Element(), {
  body: new Element(), documentElement: Object.assign(new Element(), { clientWidth: 390 }),
  querySelector: selector => elements.get(selector.replace(/^#/, '')) || null,
  createElement(tag) {
    const element = new Element('', tag.toUpperCase());
    if (tag !== 'video') return element;
    const number = createdVideos.length;
    Object.assign(element, {
      pauses: 0, loads: 0, plays: 0,
      pause() { this.pauses += 1; lifecycle.push(`pause:${number}`); },
      load() { this.loads += 1; lifecycle.push(`load:${number}`); },
      play() { this.plays += 1; lifecycle.push(`play:${number}`); return playPlans.shift()?.() || Promise.resolve(); },
    });
    let source = '';
    Object.defineProperty(element, 'src', {
      get: () => source,
      set(value) { source = value; if (value) attachedSources.push(value); },
    });
    createdVideos.push(element);
    return element;
  },
});
globalThis.matchMedia = () => ({ matches: true, addEventListener() {} });
globalThis.getComputedStyle = () => ({ paddingRight: '0' });
globalThis.window = { scrollX: 0, scrollY: 1250, innerWidth: 390, scrollTo(x, y) { this.scrollX = x; this.scrollY = y; } };
const trigger = new Element('work-trigger', 'BUTTON');
const click = id => elements.get(id).emit('click');
const open = (index = 0) => {
  trigger.dataset.video = String(index);
  trigger.setAttribute('data-video', String(index));
  document.emit('click', { target: trigger });
};
const close = () => click('close-dialog');
const currentVideo = () => media.querySelector('video');
const loading = () => media.querySelector('.video-loading');
const flush = () => new Promise(resolve => setImmediate(resolve));
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
const blockedError = () => Object.assign(new Error('Explicit native play is required'), { name: 'NotAllowedError' });
const fetchPlans = [];
const fetches = [];
const blobs = [];
const revoked = [];
const originalFetch = globalThis.fetch;
const originalCreateURL = URL.createObjectURL;
const originalRevokeURL = URL.revokeObjectURL;
globalThis.fetch = (path, options) => {
  fetches.push({ path, signal: options.signal });
  assert.ok(fetchPlans.length, `unexpected fetch ${path}`);
  return fetchPlans.shift();
};
URL.createObjectURL = blob => { blobs.push(blob); return `blob:test-${blobs.length}`; };
URL.revokeObjectURL = url => revoked.push(url);
const response = (bytes, ok = true) => ({ ok, status: ok ? 200 : 503, arrayBuffer: async () => Uint8Array.from(bytes).buffer });
const saved = videos.slice(0, 2).map(item => ({ ...item }));
assert.equal(saved.length, 2, 'the fixture needs at least two actual work slots');
const sourceA = '/__test_only__/first.mp4';
const sourceB = '/__test_only__/second.mp4';
const { initMediaDialog } = await import('../dist/v2-interactions.js');
initMediaDialog();
assert.equal(createdVideos.length, 0, 'initialization creates no players');
assert.equal(attachedSources.length, 0, 'initialization activates no MP4 source');
assert.equal(fetches.length, 0, 'initialization fetches no video parts');
const removedPhotoTrigger = new Element();
removedPhotoTrigger.setAttribute('data-photo', '0');
document.emit('click', { target: removedPhotoTrigger });
assert.ok(!dialog.open, 'removed photo-gallery controls cannot open the UGC viewer');

try {
  Object.assign(videos[0], { src: sourceA, parts: undefined, poster: '/__test_only__/first.webp', description: '' });
  Object.assign(videos[1], { src: sourceB, parts: undefined, poster: '/__test_only__/second.webp', description: 'Описание выбранной работы.' });
  open();
  const first = currentVideo();
  assert.ok(dialog.open);
  assert.deepEqual(attachedSources, [sourceA], 'one selection attaches only its own source');
  assert.equal(first.preload, 'none');
  assert.equal(first.playsInline, true);
  assert.equal(first.controls, true);
  assert.equal(first.poster, videos[0].poster);
  assert.ok(media.classList.contains('is-loading'));
  assert.equal(media.getAttribute('aria-busy'), 'true');
  assert.equal(loading().querySelector('img').src, first.poster, 'loading uses the matching poster');
  assert.equal(loading().style.pointerEvents, 'none', 'poster never intercepts player controls');
  assert.equal(loading().querySelector('span').getAttribute('role'), 'status');
  assert.equal(description.hidden, true, 'empty optional copy is hidden');
  assert.equal(document.activeElement.id, 'close-dialog');
  assert.equal(document.body.style.getPropertyValue('position'), 'fixed');
  first.emit('canplay');
  assert.ok(media.classList.contains('is-ready'));
  assert.ok(!media.classList.contains('is-loading'));
  assert.equal(media.getAttribute('aria-busy'), 'false');
  assert.equal(loading().hidden, false, 'canplay leaves the overlay available for its CSS fade');
  assert.equal(loading().getAttribute('aria-hidden'), 'true');
  assert.equal(loading().querySelector('span').hidden, true);
  click('next-media');
  const second = currentVideo();
  assert.equal(first.src, '');
  assert.equal(first.pauses, 1);
  assert.equal(first.loads, 1);
  assert.ok(lifecycle.indexOf('pause:0') < lifecycle.indexOf('play:1'), 'old playback stops before new play');
  assert.equal(media.querySelectorAll('video').length, 1);
  assert.equal(second.src, sourceB);
  assert.equal(description.hidden, false);
  assert.equal(elements.get('dialog-counter').textContent, `02 / ${String(videos.length).padStart(2, '0')}`);
  first.emit('error');
  first.emit('playing');
  assert.equal(currentVideo(), second, 'stale events cannot replace the current selection');
  assert.ok(media.classList.contains('is-loading'));
  second.emit('error');
  assert.equal(currentVideo(), null);
  assert.equal(second.src, '');
  assert.ok(media.querySelector('img'), 'failed media keeps the real poster');
  assert.match(description.textContent, /Не удалось загрузить видео/);
  assert.equal(media.getAttribute('aria-busy'), 'false');
  click('previous-media');
  const notReady = currentVideo();
  dialog.emit('keydown', { target: elements.get('close-dialog'), key: 'ArrowRight', preventDefault() {} });
  const replacement = currentVideo();
  notReady.emit('canplay');
  assert.equal(currentVideo(), replacement);
  assert.ok(media.classList.contains('is-loading'), 'stale canplay cannot clear the next loading state');
  dialog.emit('cancel', { preventDefault() {} });
  assert.equal(replacement.src, '');
  assert.equal(dialog.open, false);
  assert.equal(media.children.length, 0);
  assert.equal(document.activeElement, trigger);
  assert.equal(window.scrollY, 1250);
  assert.equal(document.body.style.getPropertyValue('position'), '');

  playPlans.push(() => Promise.reject(blockedError()));
  open();
  const blocked = currentVideo();
  await flush();
  assert.ok(media.classList.contains('is-play-blocked'));
  assert.equal(loading().hidden, true, 'rejected autoplay immediately exposes native controls');
  assert.equal(blocked.controls, true);
  assert.equal(blocked.src, sourceA, 'rejection preserves the selected playable source');
  assert.equal(media.getAttribute('aria-busy'), 'false');
  blocked.emit('canplay');
  blocked.emit('playing');
  assert.ok(!media.classList.contains('is-play-blocked'));
  assert.ok(media.classList.contains('is-ready'));
  close();

  const oldPlay = deferred();
  playPlans.push(() => oldPlay.promise);
  open();
  click('next-media');
  const afterOldPlay = currentVideo();
  oldPlay.reject(blockedError());
  await flush();
  assert.equal(currentVideo(), afterOldPlay);
  assert.ok(media.classList.contains('is-loading'));
  assert.ok(!media.classList.contains('is-play-blocked'), 'old rejected promise cannot alter the new player');
  close();

  videos[0].src = '';
  const beforeMissing = createdVideos.length;
  open();
  assert.equal(createdVideos.length, beforeMissing, 'missing source creates no fake player');
  assert.ok(media.querySelector('img'));
  assert.match(description.textContent, /Видео пока недоступно/);
  close();

  videos[0].src = '/__test_only__/large-logical-original.mp4';
  videos[0].parts = ['/__test_only__/part-1.bin', '/__test_only__/part-2.bin'];
  const chunkA = deferred();
  const chunkB = deferred();
  fetchPlans.push(chunkA.promise, chunkB.promise);
  open();
  const chunkPlayer = currentVideo();
  assert.equal(chunkPlayer.src, '', 'chunked original never attaches a nonexistent logical MP4');
  assert.equal(chunkPlayer.plays, 0, 'chunked playback waits for complete source assembly');
  assert.deepEqual(fetches.map(request => request.path), videos[0].parts);
  assert.ok(media.classList.contains('is-loading'));
  chunkB.resolve(response([3, 4]));
  chunkA.resolve(response([1, 2]));
  await flush();
  assert.equal(blobs[0].type, 'video/mp4');
  assert.deepEqual([...new Uint8Array(await blobs[0].arrayBuffer())], [1, 2, 3, 4], 'original byte order survives out-of-order downloads');
  assert.equal(chunkPlayer.src, 'blob:test-1');
  assert.equal(chunkPlayer.plays, 1);
  chunkPlayer.emit('canplay');
  close();
  assert.equal(chunkPlayer.src, '');
  assert.ok(revoked.includes('blob:test-1'), 'closing releases the assembled object URL');

  const staleA = deferred();
  const staleB = deferred();
  fetchPlans.push(staleA.promise, staleB.promise);
  open();
  const canceledPlayer = currentVideo();
  const canceledRequests = fetches.slice(-2);
  click('next-media');
  const directAfterCancel = currentVideo();
  assert.ok(canceledRequests.every(request => request.signal.aborted), 'switch aborts both selected-part requests');
  assert.equal(canceledPlayer.src, '');
  staleA.resolve(response([9]));
  staleB.resolve(response([8]));
  await flush();
  assert.equal(blobs.length, 1, 'stale part responses create no leaked object URL');
  assert.equal(currentVideo(), directAfterCancel);
  assert.equal(directAfterCancel.src, sourceB);
  close();

  fetchPlans.push(Promise.resolve(response([5])), Promise.resolve(response([], false)));
  open();
  await flush();
  assert.equal(currentVideo(), null, 'an HTTP failure releases the chunked player');
  assert.ok(fetches.slice(-2).every(request => request.signal.aborted));
  assert.ok(media.querySelector('img'));
  assert.match(description.textContent, /Не удалось загрузить видео/);
  assert.equal(media.getAttribute('aria-busy'), 'false');
  close();
  assert.ok(!attachedSources.includes(videos[0].src), 'logical chunked source was never requested as a direct MP4');
} finally {
  if (dialog.open) close();
  saved.forEach((item, index) => {
    Object.keys(videos[index]).forEach(key => delete videos[index][key]);
    Object.assign(videos[index], item);
  });
  globalThis.fetch = originalFetch;
  URL.createObjectURL = originalCreateURL;
  URL.revokeObjectURL = originalRevokeURL;
}
console.log('PASS: selected-only video sources, poster/loading/canplay states, autoplay rejection, native controls, stale-event isolation, single-player cleanup, keyboard/Escape/focus/scroll, missing/error fallbacks, byte-exact part assembly, fetch cancellation and object URL release. Browser network and codec validation remain separate.');
