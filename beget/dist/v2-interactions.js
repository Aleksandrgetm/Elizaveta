import { videos, photos } from './content.js?v=ugc-20261005';
import { photo, esc } from './v2-components.js?v=ugc-20261005';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
let mediaReady = false;
let interactionsReady = false;

// Fixed-body locking also keeps iOS Safari from moving the page behind a dialog.
export function lockPage(className = 'modal-open') {
  const body = document.body;
  const root = document.documentElement;
  const x = window.scrollX;
  const y = window.scrollY;
  const saved = [];
  const set = (element, property, value) => {
    saved.push([element, property, element.style.getPropertyValue(property), element.style.getPropertyPriority(property)]);
    element.style.setProperty(property, value);
  };
  const scrollbar = Math.max(0, window.innerWidth - root.clientWidth);
  const padding = parseFloat(getComputedStyle(body).paddingRight) || 0;
  set(root, 'scroll-behavior', 'auto');
  set(body, 'position', 'fixed');
  set(body, 'top', `${-y}px`);
  set(body, 'left', `${-x}px`);
  set(body, 'right', '0');
  set(body, 'width', '100%');
  set(body, 'overflow', 'hidden');
  if (scrollbar) set(body, 'padding-right', `${padding + scrollbar}px`);
  body.classList.add(className);
  return (trigger) => {
    // Keep instant scrolling until both the page position and focus are restored.
    const rootStyle = saved.shift();
    saved.reverse().forEach(([element, property, value, priority]) => {
      if (value) element.style.setProperty(property, value, priority);
      else element.style.removeProperty(property);
    });
    window.scrollTo(x, y);
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    window.scrollTo(x, y);
    body.classList.remove(className);
    const [element, property, value, priority] = rootStyle;
    if (value) element.style.setProperty(property, value, priority);
    else element.style.removeProperty(property);
  };
}

export function initMediaDialog() {
  const dialog = document.querySelector('#media-dialog');
  const media = document.querySelector('#dialog-media');
  if (mediaReady || !dialog || !media) return;
  mediaReady = true;
  const title = document.querySelector('#dialog-title');
  const description = document.querySelector('#dialog-description');
  const meta = document.querySelector('#dialog-meta');
  const counter = document.querySelector('#dialog-counter');
  const closeButton = document.querySelector('#close-dialog');
  const previousButton = document.querySelector('#previous-media');
  const nextButton = document.querySelector('#next-media');
  let index = 0;
  let trigger;
  let unlock;
  let generation = 0;
  let entrance;
  let pendingFetch;
  let objectURL;

  const releaseVideo = (video) => {
    video.pause();
    video.removeAttribute('src');
    video.querySelectorAll('source').forEach(source => source.removeAttribute('src'));
    video.load();
  };
  const clean = () => {
    generation += 1;
    pendingFetch?.abort();
    pendingFetch = null;
    media.querySelectorAll('video').forEach(releaseVideo);
    if (objectURL) URL.revokeObjectURL(objectURL);
    objectURL = null;
    media.replaceChildren();
    media.classList.remove('is-loading', 'is-ready', 'is-play-blocked');
    media.setAttribute('aria-busy', 'false');
  };
  const describe = (text = '') => {
    description.textContent = text;
    description.hidden = !text.trim();
  };
  const preview = (key, label = '') => {
    media.innerHTML = photo(key, '(min-width: 800px) 520px, 90vw') +
      (label ? `<span class="preview-label">${esc(label)}</span>` : '');
    const image = media.querySelector('img');
    if (image) image.loading = 'eager';
  };
  const render = () => {
    clean();
    const item = videos[index];
    const source = item.src?.trim() || '';
    const parts = Array.isArray(item.parts) ? item.parts : [];
    const currentGeneration = generation;
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(videos.length).padStart(2, '0')}`;
    meta.textContent = item.category;
    title.textContent = item.title;
    describe(item.description || '');
    previousButton.disabled = nextButton.disabled = videos.length < 2;

    if (!source && !parts.length) {
      preview(item.poster, 'ВИДЕО НЕДОСТУПНО');
      describe('Видео пока недоступно. Попробуйте открыть его позже.');
      return;
    }

    // This branch only runs after an explicit media selection. No video or
    // source element exists in the page before then.
    const video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.preload = 'none';
    video.setAttribute('aria-label', item.title);
    video.poster = photos[item.poster]
      ? `/assets/photos/liza-${photos[item.poster].id}-960.webp`
      : item.poster || '';
    const loading = document.createElement('div');
    loading.className = 'video-loading';
    // Loading artwork never intercepts native controls, including on iOS.
    loading.style.pointerEvents = 'none';
    if (video.poster) {
      const poster = document.createElement('img');
      poster.className = 'video-loading-poster';
      poster.src = video.poster;
      poster.alt = '';
      poster.setAttribute('aria-hidden', 'true');
      loading.append(poster);
    }
    const status = document.createElement('span');
    status.className = 'video-loading-status';
    status.setAttribute('role', 'status');
    status.textContent = 'Загрузка видео…';
    loading.append(status);

    const current = () => currentGeneration === generation && dialog.open && media.contains(video);
    const revealPlayer = (blocked = false) => {
      if (!current()) return;
      media.classList.remove('is-loading');
      media.classList.add(blocked ? 'is-play-blocked' : 'is-ready');
      media.setAttribute('aria-busy', 'false');
      status.hidden = true;
      loading.setAttribute('aria-hidden', 'true');
      // A rejected autoplay attempt can happen before canplay. Remove the
      // overlay immediately so the native poster and play control are exposed.
      if (blocked) loading.hidden = true;
    };
    const fail = () => {
      if (!current()) return;
      clean();
      preview(item.poster, 'ВИДЕО НЕДОСТУПНО');
      describe('Не удалось загрузить видео. Попробуйте открыть его позже.');
    };
    video.addEventListener('canplay', () => revealPlayer(), { once: true });
    video.addEventListener('playing', () => {
      if (!current()) return;
      media.classList.remove('is-play-blocked');
      revealPlayer();
    });
    video.addEventListener('error', fail, { once: true });
    media.append(video, loading);
    media.classList.add('is-loading');
    media.setAttribute('aria-busy', 'true');
    const playRejected = (error) => {
      if (!current()) return;
      if (error?.name === 'NotSupportedError') fail();
      else revealPlayer(true);
    };
    const requestPlayback = () => {
      // Safari may require a native Play tap after async source preparation;
      // neither that rejection nor an old promise breaks the viewer.
      try {
        video.play()?.catch(playRejected);
      } catch (error) {
        playRejected(error);
      }
    };
    if (parts.length) {
      // One original exceeds the static host's per-file limit. Its byte-exact
      // parts are fetched only for this selection, then joined without encoding.
      const controller = new AbortController();
      pendingFetch = controller;
      Promise.all(parts.map(async path => {
        const response = await fetch(path, { signal: controller.signal });
        if (!response.ok) throw new Error(`Video part failed: ${response.status}`);
        return response.arrayBuffer();
      })).then(buffers => {
        if (!current() || controller.signal.aborted) return;
        pendingFetch = null;
        objectURL = URL.createObjectURL(new Blob(buffers, { type: 'video/mp4' }));
        video.src = objectURL;
        requestPlayback();
      }).catch(() => {
        if (!controller.signal.aborted) fail();
      });
    } else {
      video.src = source;
      requestPlayback();
    }
  };
  const open = (requestedIndex, button) => {
    if (!Number.isInteger(requestedIndex) || !videos[requestedIndex]) return;
    index = requestedIndex;
    trigger = button;
    if (!dialog.open) {
      unlock = lockPage();
      try {
        dialog.showModal();
      } catch {
        unlock(trigger);
        unlock = null;
        return;
      }
    }
    render();
    document.querySelector('#cursor')?.classList.remove('is-visible', 'is-active');
    closeButton.focus({ preventScroll: true });
    entrance?.cancel();
    if (!reducedMotion.matches && dialog.animate) {
      entrance = dialog.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 180,
        easing: 'ease-out',
      });
    }
  };
  const step = (direction) => {
    const length = videos.length;
    if (!dialog.open || length < 2) return;
    index = (index + direction + length) % length;
    render();
  };
  const close = () => {
    if (dialog.open) {
      clean();
      dialog.close();
    }
  };

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-video]');
    if (!button || dialog.contains(button)) return;
    open(Number(button.dataset.video), button);
  });
  previousButton.addEventListener('click', () => step(-1));
  nextButton.addEventListener('click', () => step(1));
  closeButton.addEventListener('click', close);
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    close();
  });
  dialog.addEventListener('close', () => {
    entrance?.cancel();
    clean();
    unlock?.(trigger);
    unlock = null;
  });
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) close();
  });
  dialog.addEventListener('keydown', (event) => {
    // Keep the keyboard cycle inside the viewer, including Shift+Tab from Close.
    if (event.key === 'Tab') {
      const focusable = [...dialog.querySelectorAll('button:not([disabled]), a[href], video[controls], [tabindex]:not([tabindex="-1"])')]
        .filter(element => element.getClientRects().length);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (first && event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (first && !event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
      return;
    }
    // Native media controls own arrow keys while the video has focus.
    if (event.target.closest('video, input, textarea, select') || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
  });
  reducedMotion.addEventListener('change', () => entrance?.cancel());
}

function initChapters() {
  const links = [...document.querySelectorAll('.chapter-link[href^="#"]')];
  if (!links.length) return;
  const targets = new Set(links.map(link => link.hash.slice(1)));
  const alias = { world: 'niches', contents: 'niches' };
  const sections = [...document.querySelectorAll('[data-chapter]')]
    .map(element => {
      const name = element.dataset.chapter || element.id;
      return { element, name: alias[name] || name };
    }).filter(section => targets.has(section.name));
  if (!sections.length) return;
  let frame = 0;
  let active = '';
  const update = () => {
    frame = 0;
    if (document.querySelector('#media-dialog[open]')) return;
    const marker = window.innerHeight * 0.35;
    let next = sections[0].name;
    for (const section of sections) {
      if (section.element.getBoundingClientRect().top <= marker) next = section.name;
    }
    if (next === active) return;
    active = next;
    links.forEach(link => {
      const current = link.hash.slice(1) === active;
      link.classList.toggle('is-active', current);
      if (current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(schedule, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
    sections.forEach(({ element }) => observer.observe(element));
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('hashchange', schedule);
  document.fonts?.ready.then(schedule);
  update();
}

function initPointerEnhancements() {
  const cursor = document.querySelector('#cursor');
  const cursorLabel = cursor?.querySelector('span');
  const scenes = [...document.querySelectorAll('.hero, .desk-stage')].map(element => ({
    element,
    bounds: null,
    layers: [...element.querySelectorAll(element.matches('.hero') ? '.hero-visual' : '.desk-object')]
      .map(layer => {
        const depth = Number(layer.dataset.depth);
        const amplitude = layer.matches('.hero-visual') ? 6
          : Math.max(-8, Math.min(8, (Number.isFinite(depth) ? depth : 1) * 8));
        return { layer, amplitude };
      }),
  }));
  const layers = scenes.flatMap(scene => scene.layers.map(({ layer }) => layer));
  let controller;
  let frame = 0;
  let position = { x: 0, y: 0 };
  const pending = new Map();
  const draw = () => {
    frame = 0;
    if (cursor) cursor.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
    pending.forEach(({ x, y }, layer) => {
      layer.style.setProperty('--pointer-x', `${x.toFixed(2)}px`);
      layer.style.setProperty('--pointer-y', `${y.toFixed(2)}px`);
    });
    pending.clear();
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
  const hideCursor = () => cursor?.classList.remove('is-visible', 'is-active');
  const configure = () => {
    controller?.abort();
    cancelAnimationFrame(frame);
    frame = 0;
    pending.clear();
    hideCursor();
    scenes.forEach(scene => { scene.bounds = null; });
    layers.forEach(layer => {
      layer.style.removeProperty('--pointer-x');
      layer.style.removeProperty('--pointer-y');
    });
    if (!finePointer.matches || reducedMotion.matches) return;
    controller = new AbortController();
    const options = { passive: true, signal: controller.signal };
    if (cursor) {
      cursor.setAttribute('aria-hidden', 'true');
      document.addEventListener('pointermove', (event) => {
        if (event.pointerType === 'touch' || document.querySelector('#media-dialog[open]')) {
          hideCursor();
          return;
        }
        position = { x: event.clientX, y: event.clientY };
        const target = event.target.closest('[data-cursor]');
        const label = target?.dataset.cursor?.toUpperCase() || '';
        if (cursorLabel) cursorLabel.textContent = label;
        cursor.classList.toggle('is-active', Boolean(label));
        cursor.classList.add('is-visible');
        schedule();
      }, options);
      document.documentElement.addEventListener('pointerleave', hideCursor, options);
      window.addEventListener('blur', hideCursor, options);
      window.addEventListener('scroll', hideCursor, options);
    }
    const resetScene = (scene) => {
      scene.bounds = null;
      scene.layers.forEach(({ layer }) => pending.set(layer, { x: 0, y: 0 }));
      schedule();
    };
    scenes.forEach((scene) => {
      // The scene receives events even when decorative layers deliberately use
      // pointer-events:none, or sit underneath the hero's copy and shade.
      scene.element.addEventListener('pointerenter', () => {
        scene.bounds = scene.element.getBoundingClientRect();
      }, options);
      scene.element.addEventListener('pointermove', (event) => {
        if (event.pointerType === 'touch') return;
        const bounds = scene.bounds ||= scene.element.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        const clamp = value => Math.max(-1, Math.min(1, value));
        const x = clamp((event.clientX - bounds.left) / bounds.width * 2 - 1);
        const y = clamp((event.clientY - bounds.top) / bounds.height * 2 - 1);
        scene.layers.forEach(({ layer, amplitude }) => {
          pending.set(layer, { x: x * amplitude, y: y * amplitude });
        });
        schedule();
      }, options);
      scene.element.addEventListener('pointerleave', () => resetScene(scene), options);
    });
    const resetScenes = () => scenes.forEach(resetScene);
    window.addEventListener('scroll', resetScenes, options);
    window.addEventListener('resize', resetScenes, options);
  };
  finePointer.addEventListener('change', configure);
  reducedMotion.addEventListener('change', configure);
  configure();
}

export function initInteractions() {
  if (interactionsReady) return;
  interactionsReady = true;
  initChapters();
  initPointerEnhancements();
}
