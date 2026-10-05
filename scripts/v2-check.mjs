import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mountSections, esc } from '../dist/v2-components.js';
import { videos, services } from '../dist/content.js';

const root = fileURLToPath(new URL('../', import.meta.url));
process.chdir(root);
for (const name of ['v2.js', 'v2-components.js', 'v2-interactions.js', 'v2-motion.js', 'v2-world.js']) {
  const result = spawnSync(process.execPath, ['--check', `dist/${name}`], { stdio: 'inherit' });
  assert.equal(result.status, 0, `${name} must parse`);
}

const documentSource = readFileSync('dist/index.html', 'utf8');
const mount = { innerHTML: '' };
mountSections(mount);
const html = documentSource.replace('<div id="sections"></div>', mount.innerHTML);
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'IDs must be unique across static and mounted content');
for (const id of ['home', 'about', 'contents', 'niches', 'work', 'services', 'contact']) {
  assert.ok(ids.includes(id), `chapter ${id} must exist`);
}
assert.ok(!ids.includes('moments'), 'the separate Moments gallery must stay removed');
for (const match of html.matchAll(/href="#([^"\s]+)"/g)) {
  assert.ok(ids.includes(match[1]), `anchor #${match[1]} must resolve`);
}
for (const match of html.matchAll(/aria-(?:labelledby|describedby)="([^"]+)"/g)) {
  for (const id of match[1].split(/\s+/)) assert.ok(ids.includes(id), `accessible relation ${id} must resolve`);
}
assert.equal([...html.matchAll(/<h1\b/g)].length, 1, 'one accessible page title');
assert.ok(html.includes('lang="ru"'), 'Russian document language');
assert.ok(html.includes('<dialog id="media-dialog"'), 'native modal focus/inert semantics');

const localReference = path => {
  if (!path.startsWith('/') || path.startsWith('//')) return;
  assert.ok(existsSync(resolve(root, 'dist', `.${path.split(/[?#]/)[0]}`)), `missing local asset ${path}`);
};
for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) localReference(match[1]);
for (const match of html.matchAll(/srcset="([^"]+)"/g)) {
  match[1].split(',').forEach(candidate => localReference(candidate.trim().split(/\s+/)[0]));
}
for (const match of html.matchAll(/<img\b[^>]*>/g)) {
  assert.ok(/\balt="[^"]*"/.test(match[0]), 'all image elements need an alt attribute');
  assert.ok(/\bwidth="\d+"/.test(match[0]) && /\bheight="\d+"/.test(match[0]), 'image layout needs intrinsic dimensions');
}
for (const name of ['beauty', 'fashion', 'lifestyle', 'wellness', 'travel']) {
  assert.ok(html.includes(`src="/assets/editorial/${name}.webp"`), `correct supplied ${name} image`);
}
assert.ok(html.includes('src="/assets/editorial/flower-portrait.webp"'), 'black dress and flowers anchor');
assert.ok(html.includes('src="/assets/vinyl.webp"'), 'approved original pink vinyl');
assert.ok(!html.includes('/decor/vinyl/pink-vinyl.webp'), 'replacement marbled CD must stay unused');
const taggedAttributes = tag => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, 'g'))]
  .map(match => Object.fromEntries([...match[0].matchAll(/([\w:-]+)="([^"]*)"/g)].map(attribute => [attribute[1], attribute[2]])));
const hasClass = name => attributes => attributes.class?.split(/\s+/).includes(name);
const worldTabs = taggedAttributes('button').filter(hasClass('world-tab'));
const worldStates = taggedAttributes('article').filter(hasClass('world-state'));
assert.equal(worldTabs.length, 5, 'five accessible world tabs');
assert.equal(worldStates.length, 5, 'five world category panels');
assert.deepEqual(worldTabs.map(tab => tab['data-world-index']), ['0', '1', '2', '3', '4'], 'tabs identify the five ordered world states');
assert.equal(new Set(worldTabs.map(tab => tab['aria-controls'])).size, 5, 'each world tab controls a distinct panel');
for (const tab of worldTabs) {
  assert.equal(tab.role, 'tab', 'world controls expose tab semantics');
  assert.ok(tab.id, 'world tabs have accessible IDs');
  const panel = worldStates.find(state => state.id === tab['aria-controls']);
  assert.ok(panel, `world tab ${tab.id} must control an existing category panel`);
  assert.equal(panel.role, 'tabpanel', 'world states expose tabpanel semantics');
  assert.equal(panel['aria-labelledby'], tab.id, 'each world panel is named by its controlling tab');
}
assert.equal((html.match(/data-work-card="/g) || []).length, videos.length, 'one reel card per work slot');
assert.equal((html.match(/data-format="/g) || []).length, services.length, 'all nine content formats rendered');
assert.ok(!html.includes('data-photo='), 'no standalone photo-gallery controls remain');
assert.equal((html.match(/class="vinyl-index"/g) || []).length, 5, 'five indexed contents links');
assert.ok(!/<video\b|<audio\b|<source[^>]+\btype="video\//i.test(html), 'no initial video elements or video sources');
for (const social of ['https://instagram.com/waniloow', 'mailto:lbritakina@gmail.com', 'https://t.me/waniloow']) {
  assert.ok(html.includes(`href="${social}"`), `real contact ${social}`);
}
assert.equal(esc('<script>"&\''), '&lt;script&gt;&quot;&amp;&#39;', 'editable labels must be escaped');
assert.ok(existsSync('dist/v1.html'), 'V1 entry point must remain available');

// Exercise the actual reduced-motion and missing-GSAP branches. Any motion
// allocation in these cases is an error, independently of implementation text.
let refreshes = 0;
const callbacks = [];
const reveal = { style: {}, children: [] };
globalThis.requestAnimationFrame = callback => { callbacks.push(callback); return callbacks.length; };
globalThis.cancelAnimationFrame = () => {};
globalThis.location = { hash: '' };
globalThis.sessionStorage = { getItem: () => null, setItem() {} };
globalThis.document = {
  querySelector: selector => selector === '.hero-reveal' ? reveal : null,
  images: [],
  fonts: { ready: Promise.resolve() },
};
const rejectMotion = () => { throw new Error('Reduced motion allocated an animation'); };
let reverted = false;
globalThis.window = {
  gsap: {
    registerPlugin() {}, timeline: rejectMotion, from: rejectMotion, to: rejectMotion,
    fromTo: rejectMotion, set: rejectMotion,
    matchMedia: () => ({
      add(conditions, callback) {
        assert.match(conditions.reduced, /prefers-reduced-motion/);
        callback({ conditions: { reduced: true, desktop: true, compact: false } });
      },
      revert() { reverted = true; },
    }),
  },
  ScrollTrigger: { refresh() { refreshes += 1; } },
  addEventListener() {}, removeEventListener() {}, scrollY: 0,
};
const { initMotion } = await import('../dist/v2-motion.js');
const cleanup = initMotion();
await Promise.resolve();
callbacks.splice(0).forEach(callback => callback());
assert.equal(reveal.style.visibility, 'hidden', 'reduced motion exposes hero immediately');
assert.ok(refreshes > 0, 'reduced-motion layout still refreshes');
cleanup();
assert.ok(reverted, 'motion listener cleanup is callable');
delete window.gsap;
delete window.ScrollTrigger;
reveal.style.visibility = 'visible';
assert.equal(typeof initMotion(), 'function', 'missing-GSAP fallback remains callable');
assert.equal(reveal.style.visibility, 'hidden', 'failed animation library cannot cover the hero');

console.log('PASS: V2 modules, composed document semantics, anchors, supplied assets, all formats/work slots, no initial videos, reduced-motion execution, missing-GSAP fallback and V1 preservation.');
