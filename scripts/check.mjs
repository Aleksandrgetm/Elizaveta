import {readFileSync,existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {videos,photos,gallery,socials} from '../dist/content.js';
for(const file of ['app.js','components.js','content.js','interactions.js','decorations.js']) {
  const result=spawnSync(process.execPath,['--check',`dist/${file}`],{stdio:'inherit'});
  assert.equal(result.status,0,`${file} syntax`);
}
assert.equal(videos.length,12,'12 video slots');
assert.equal(new Set(videos.map(v=>v.id)).size,12,'unique video ids');
for(const v of videos){assert.ok(v.title&&v.category,'video labels');assert.ok(photos[v.poster]||v.poster.startsWith('/assets/')||v.poster.startsWith('https://'),'poster');if(v.src.startsWith('/'))assert.ok(existsSync(`dist${v.src}`),v.src)}
for(const p of Object.values(photos))for(const w of [480,960,1440])assert.ok(existsSync(`dist/assets/photos/liza-${p.id}-${w}.webp`),'photo exists');
for(const p of gallery)assert.ok(photos[p],'gallery photo');
assert.equal(socials.length,3);
const html=readFileSync('dist/index.html','utf8');assert.ok(html.includes('lang="ru"'));
for(const match of html.matchAll(/(?:src|href)="(\/[^"#]*)"/g))assert.ok(existsSync(`dist${match[1].split('?')[0]}`),match[1]);
const css=readFileSync('dist/assets/fonts/fonts.css','utf8');assert.ok(css.includes('U+0400'),'Cyrillic font subset');
for(const m of css.matchAll(/url\(\.\/([^)]+)\)/g))assert.ok(existsSync(`dist/assets/fonts/${m[1]}`),'font asset');
console.log('PASS: JavaScript syntax, 12 editable videos, all photos/fonts, local references, metadata. Static site is ready; no compile step required.');
