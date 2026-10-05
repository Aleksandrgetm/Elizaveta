import {readFileSync,existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {videos,photos,gallery,socials} from '../dist/content.js';
import {videos as archivedVideos} from '../dist/content-v1.js';
for(const file of ['app.js','components.js','content.js','content-v1.js','interactions.js','decorations.js']) {
  const result=spawnSync(process.execPath,['--check',`dist/${file}`],{stdio:'inherit'});
  assert.equal(result.status,0,`${file} syntax`);
}
assert.equal(videos.length,10,'10 real UGC videos');
assert.equal(new Set(videos.map(v=>v.id)).size,videos.length,'unique video ids');
for(const v of videos){assert.ok(v.title?.trim()&&v.category?.trim(),'video labels');assert.ok(v.src?.trim(),'each work has a real video source');assert.ok(v.poster?.startsWith('/assets/videos/posters/'),'each work has its own video poster');assert.ok(existsSync(`dist${v.poster}`),v.poster);if(v.parts?.length){for(const part of v.parts)assert.ok(existsSync(`dist${part}`),part)}else if(v.src.startsWith('/'))assert.ok(existsSync(`dist${v.src}`),v.src)}
assert.equal(archivedVideos.length,12,'V1 retains its historical 12 slots');
assert.ok(archivedVideos.every(v=>!v.src&&!v.parts),'V1 remains the archived photo-preview edition');
for(const file of ['components.js','interactions.js'])assert.match(readFileSync(`dist/${file}`,'utf8'),/from ['"]\.\/content-v1\.js(?:\?[^'"]*)?['"]/,'V1 uses its archived dataset');
for(const p of Object.values(photos))for(const w of [480,960,1440])assert.ok(existsSync(`dist/assets/photos/liza-${p.id}-${w}.webp`),'photo exists');
for(const p of gallery)assert.ok(photos[p],'gallery photo');
assert.equal(socials.length,3);
const html=readFileSync('dist/index.html','utf8');assert.ok(html.includes('lang="ru"'));
for(const match of html.matchAll(/(?:src|href)="(\/[^"#]*)"/g))assert.ok(existsSync(`dist${match[1].split('?')[0]}`),match[1]);
const css=readFileSync('dist/assets/fonts/fonts.css','utf8');assert.ok(css.includes('U+0400'),'Cyrillic font subset');
for(const m of css.matchAll(/url\(\.\/([^)]+)\)/g))assert.ok(existsSync(`dist/assets/fonts/${m[1]}`),'font asset');
console.log('PASS: JavaScript syntax, 10 real UGC videos, all photos/fonts, local references, metadata. Static site is ready; no compile step required.');
