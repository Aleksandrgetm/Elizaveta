import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, extname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { videos } from '../dist/content.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const audit = JSON.parse(readFileSync(resolve(root, 'docs/video-assets.json'), 'utf8'));
const expectedCount = 15;
const maximumStaticAssetBytes = 25 * 1024 * 1024;
const sha256 = buffer => createHash('sha256').update(buffer).digest('hex');
const inside = (directory, name) => {
  assert.equal(typeof name, 'string', 'asset path must be a string');
  const path = resolve(directory, name);
  const remainder = relative(directory, path);
  assert.ok(remainder && remainder !== '..' && !remainder.startsWith(`..${sep}`), `asset stays in its directory: ${name}`);
  assert.ok(statSync(path).isFile(), `asset is a regular file: ${name}`);
  return path;
};
const localAsset = (url, prefix) => {
  assert.ok(url?.startsWith(prefix) && !/[?#]/.test(url), `expected a local ${prefix} asset: ${url}`);
  return inside(resolve(root, 'dist'), `.${url}`);
};
const unique = (values, label) => assert.equal(new Set(values).size, expectedCount, `all ${expectedCount} ${label} are distinct`);
const deliveryPaths = new Set();
const readDeliveryAsset = url => {
  assert.ok(!deliveryPaths.has(url), `each video delivery asset belongs to one work: ${url}`);
  deliveryPaths.add(url);
  const buffer = readFileSync(localAsset(url, '/assets/videos/'));
  assert.ok(buffer.length > 0 && buffer.length <= maximumStaticAssetBytes, `video delivery asset fits the 25 MiB hosting limit: ${url}`);
  return buffer;
};

assert.equal(audit.sourceDirectory, 'assets/videos', 'audit identifies the supplied optimized MP4 folder');
assert.equal(audit.reencoded, false, 'supplied videos must not be reencoded');
assert.equal(videos.length, expectedCount, 'exactly fifteen real works are available');
assert.equal(audit.videos.length, expectedCount, 'every supplied video is audited');
const sourceDirectory = resolve(root, audit.sourceDirectory);
const originals = readdirSync(sourceDirectory).filter(name => /\.mp4$/i.test(name)).sort();
assert.equal(originals.length, expectedCount, 'exactly fifteen optimized original MP4s are present');
assert.deepEqual(audit.videos.map(video => basename(video.sourcePath)).sort(), originals, 'audit includes every supplied MP4 exactly once');
unique(videos.map(video => video.id), 'work IDs');
unique(videos.map(video => video.src), 'video sources');
unique(videos.map(video => video.poster), 'poster paths');
unique(audit.videos.map(video => video.id), 'audit IDs');
unique(audit.videos.map(video => video.sha256), 'original video hashes');
unique(audit.videos.map(video => video.poster.sha256), 'poster image hashes');

let totalVideoBytes = 0;
let totalPosterBytes = 0;
for (const work of videos) {
  const entry = audit.videos.find(video => video.id === work.id);
  assert.ok(entry, `work ${work.id} has an audit record`);
  assert.equal(work.title, entry.title, `work ${work.id} title matches its video`);
  assert.equal(work.category, entry.category, `work ${work.id} category matches its video`);
  assert.ok(work.title.trim() && !/\.(?:mp4|mov)\b/i.test(work.title), `work ${work.id} has a readable title`);
  assert.ok(work.category.trim(), `work ${work.id} has a category`);
  assert.equal(work.src, entry.videoPath, `work ${work.id} plays its own video`);
  assert.equal(work.poster, entry.posterPath, `work ${work.id} uses its own poster`);
  assert.equal(extname(entry.sourcePath).toLowerCase(), '.mp4', 'only the supplied MP4s are used');
  assert.equal(extname(work.src).toLowerCase(), '.mp4', 'served sources remain MP4s');
  const sourcePath = inside(sourceDirectory, relative(audit.sourceDirectory, entry.sourcePath));
  const posterPath = localAsset(work.poster, '/assets/videos/posters/');
  const original = readFileSync(sourcePath);
  let served;
  if (entry.delivery === 'split-blob') {
    assert.ok(entry.parts.length > 1, `work ${work.id} split delivery includes every ordered part`);
    assert.deepEqual(work.parts, entry.parts.map(part => part.path), `work ${work.id} fetches the audited parts in order`);
    served = Buffer.concat(entry.parts.map(part => {
      const buffer = readDeliveryAsset(part.path);
      assert.equal(buffer.length, part.bytes, `part byte size matches the audit: ${part.path}`);
      assert.equal(sha256(buffer), part.sha256, `part checksum matches the audit: ${part.path}`);
      return buffer;
    }));
  } else {
    assert.equal(entry.delivery, 'file', `work ${work.id} uses direct MP4 delivery`);
    assert.ok(!work.parts?.length && !entry.parts.length, `work ${work.id} direct delivery has no stray parts`);
    served = readDeliveryAsset(work.src);
  }
  const poster = readFileSync(posterPath);
  assert.equal(original.toString('ascii', 4, 8), 'ftyp', `work ${work.id} original is an MP4 container`);
  assert.equal(sha256(original), entry.sha256, `work ${work.id} original matches the audit`);
  assert.equal(sha256(served), entry.sha256, `work ${work.id} served MP4 is unchanged from the original`);
  assert.equal(original.length, entry.bytes, `work ${work.id} video byte size matches the audit`);
  assert.equal(sha256(poster), entry.poster.sha256, `work ${work.id} poster matches the reviewed frame`);
  assert.equal(poster.length, entry.poster.bytes, `work ${work.id} poster byte size matches the audit`);
  assert.equal(poster.toString('ascii', 0, 4), 'RIFF', `work ${work.id} poster is a WebP image`);
  assert.equal(poster.toString('ascii', 8, 12), 'WEBP', `work ${work.id} poster is a WebP image`);
  assert.ok(Number.isFinite(entry.duration) && entry.duration > 0, `work ${work.id} has a measured duration`);
  assert.ok(Number.isInteger(entry.width) && entry.width > 0 && Number.isInteger(entry.height) && entry.height > 0, `work ${work.id} has measured dimensions`);
  assert.ok(Math.abs(entry.width / entry.height - 9 / 16) < 0.01, `work ${work.id} retains its vertical 9:16 presentation`);
  assert.ok(Number.isFinite(entry.poster.timestamp) && entry.poster.timestamp >= 0 && entry.poster.timestamp < entry.duration, `work ${work.id} poster is a frame within its video`);
  assert.ok(entry.poster.width > 0 && entry.poster.height > 0 && Math.abs(entry.poster.width / entry.poster.height - 9 / 16) < 0.01, `work ${work.id} poster retains the video aspect ratio`);
  assert.ok(entry.poster.selectionReason?.trim(), `work ${work.id} records why its representative frame was selected`);
  totalVideoBytes += original.length;
  totalPosterBytes += poster.length;
}
assert.equal(totalVideoBytes, audit.totalVideoBytes, 'total original video size matches the audit');
assert.equal(totalPosterBytes, audit.totalPosterBytes, 'total poster size matches the audit');
// Packaging includes the whole static directory, including an accidental unused
// copy of the oversized MP4. Catch that independently of the selected sources.
const deliveryDirectory = resolve(root, 'dist/assets/videos');
for (const name of readdirSync(deliveryDirectory, { recursive: true })) {
  const file = resolve(deliveryDirectory, name);
  if (!statSync(file).isFile()) continue;
  assert.notEqual(extname(name).toLowerCase(), '.mov', `heavy MOV originals must not enter the published assets: ${name}`);
  assert.ok(statSync(file).size <= maximumStaticAssetBytes, `every packaged video asset fits the 25 MiB hosting limit: ${name}`);
}
console.log('PASS: fifteen supplied MP4s, fifteen unique videos/posters, source-to-work mapping, audited dimensions/durations, byte-identical original/delivery checksums and individual delivery assets within 25 MiB.');
