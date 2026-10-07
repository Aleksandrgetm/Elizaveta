import { setupWorld } from './v2-world.js';
import { setupServices } from './v2-services.js?v=services-20261007-5';

/* V2 motion: the document is readable before GSAP loads and with motion disabled. */
const INTRO_KEY = 'liza-portfolio-v2-intro';
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

function rememberIntro() {
  try { sessionStorage.setItem(INTRO_KEY, 'seen'); } catch { /* Private browsing is fine. */ }
}

function hasSeenIntro() {
  try { return sessionStorage.getItem(INTRO_KEY) === 'seen'; } catch { return false; }
}

function intro(gsap, reduced) {
  const reveal = document.querySelector('.hero-reveal');
  const layers = reveal ? [...reveal.children] : [];
  if (reduced || location.hash || hasSeenIntro() || window.scrollY > 30) {
    if (reveal) reveal.style.visibility = 'hidden';
    return;
  }
  rememberIntro();
  const title = document.querySelector('.hero-title');
  const titleParts = title ? [...title.querySelectorAll('img')] : [];
  const timeline = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => { if (reveal) reveal.style.visibility = 'hidden'; },
  });
  if (reveal) gsap.set(reveal, { visibility: 'visible', pointerEvents: 'none' });
  if (layers.length) {
    timeline.fromTo(layers, { scaleX: 0, transformOrigin: 'left center' }, {
      scaleX: 1, duration: 0.36, stagger: 0.10, ease: 'power3.inOut',
    }, 0);
    timeline.to(layers, {
      scaleX: 0, transformOrigin: 'right center', duration: 0.6,
      stagger: 0.09, ease: 'power3.inOut',
    }, 0.47);
  }
  if (document.querySelector('.hero-visual img')) {
    timeline.from('.hero-visual img', { y: 30, duration: 1.05 }, 0.27);
  }
  if (title) {
    timeline.from(titleParts.length ? titleParts : title, {
      y: 28, autoAlpha: 0, duration: 0.75, stagger: 0.08,
    }, 0.48);
  }
  const supporting = document.querySelectorAll('.hero-subtitle, .hero-details');
  if (supporting.length) timeline.from(supporting, {
    y: 15, autoAlpha: 0, duration: 0.64, stagger: 0.1,
  }, 0.94);
}

function setupWork(gsap, { desktop, reduced }) {
  const section = document.querySelector('#work');
  const pin = section?.querySelector('.work-pin');
  const rail = section?.querySelector('.work-rail');
  const track = section?.querySelector('.work-track');
  const cards = [...(section?.querySelectorAll('.work-card') || [])];
  if (!rail || !track || !cards.length) return () => {};

  const progress = section.querySelector('.work-progress-fill');
  const counter = section.querySelector('.work-current');
  const steps = [...section.querySelectorAll('[data-work-step]')];
  const indices = [...section.querySelectorAll('[data-work-index]')];
  const originalOverflow = rail.style.overflowX;
  const originalSnap = rail.style.scrollSnapType;
  const originalScale = cards.map(card => card.style.scale);
  const originalProgress = progress?.style.width;
  const removers = [];
  let tween;
  let active = -1;
  let frame = 0;
  let isPinned = false;

  const overflow = () => Math.max(0, track.scrollWidth - rail.clientWidth);
  const cardPosition = index => clamp(
    cards[index].offsetLeft - track.offsetLeft + cards[index].offsetWidth / 2 - rail.clientWidth / 2,
    0, overflow(),
  );
  const listen = (target, event, handler, options) => {
    target.addEventListener(event, handler, options);
    removers.push(() => target.removeEventListener(event, handler, options));
  };
  function update(position = isPinned ? overflow() * (tween?.progress() || 0) : rail.scrollLeft) {
    const center = position + rail.clientWidth / 2;
    let nearest = 0;
    let distance = Infinity;
    cards.forEach((card, index) => {
      const candidate = Math.abs(card.offsetLeft - track.offsetLeft + card.offsetWidth / 2 - center);
      if (candidate < distance) { nearest = index; distance = candidate; }
    });
    // The edge cards remain reachable even when more than one card is visible.
    if (position <= 2) nearest = 0;
    else if (overflow() > 0 && position >= overflow() - 2) nearest = cards.length - 1;
    if (nearest !== active) {
      active = nearest;
      cards.forEach((card, index) => {
        card.classList.toggle('is-current', index === active);
        if (!reduced) card.style.scale = index === active ? '1' : '0.93';
      });
      if (counter) counter.textContent = String(active + 1).padStart(2, '0');
      indices.forEach(button => {
        button.setAttribute('aria-current', Number(button.dataset.workIndex) === active ? 'true' : 'false');
      });
      steps.forEach(button => {
        button.disabled = Number(button.dataset.workStep) < 0 ? active === 0 : active === cards.length - 1;
      });
    }
    if (progress) {
      const ratio = overflow() > 0 ? clamp(position / overflow(), 0, 1) : 1;
      progress.style.width = `${(1 / cards.length + ratio * (1 - 1 / cards.length)) * 100}%`;
    }
  }
  function goTo(index, immediate = false) {
    const target = clamp(index, 0, cards.length - 1);
    const position = target === 0 ? 0 : target === cards.length - 1 ? overflow() : cardPosition(target);
    const behavior = reduced || immediate ? 'auto' : 'smooth';
    if (isPinned && tween?.scrollTrigger && overflow() > 0) {
      rail.scrollLeft = 0;
      const trigger = tween.scrollTrigger;
      window.scrollTo({ top: trigger.start + position / overflow() * (trigger.end - trigger.start), behavior });
    } else {
      rail.scrollTo({ left: position, behavior });
    }
  }

  if (desktop && !reduced && pin && overflow() > 1) {
    isPinned = true;
    rail.scrollLeft = 0;
    rail.style.overflowX = 'hidden';
    rail.style.scrollSnapType = 'none';
    tween = gsap.to(track, {
      x: () => -overflow(), ease: 'none',
      scrollTrigger: {
        trigger: pin, pin, start: 'top top',
        end: () => `+=${clamp(overflow() * 0.78, 650, 1500)}`,
        scrub: 0.65, anticipatePin: 1, invalidateOnRefresh: true,
        onRefresh: () => update(),
      },
      onUpdate: () => update(),
    });
  }

  listen(rail, 'scroll', () => {
    if (isPinned || frame) return;
    frame = requestAnimationFrame(() => { frame = 0; update(); });
  }, { passive: true });
  steps.forEach(button => listen(button, 'click', () => goTo(active + Number(button.dataset.workStep))));
  indices.forEach(button => listen(button, 'click', () => goTo(Number(button.dataset.workIndex))));
  listen(track, 'focusin', event => {
    if (document.body.classList.contains('modal-open') || document.querySelector('dialog[open]')) return;
    const card = event.target.closest('.work-card');
    const index = cards.indexOf(card);
    if (index === -1) return;
    const bounds = card.getBoundingClientRect();
    const viewport = rail.getBoundingClientRect();
    if (bounds.left < viewport.left - 2 || bounds.right > viewport.right + 2) goTo(index, true);
  });
  listen(window, 'resize', () => {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => { frame = 0; update(); });
  }, { passive: true });
  update();

  return () => {
    removers.forEach(remove => remove());
    if (frame) cancelAnimationFrame(frame);
    rail.style.overflowX = originalOverflow;
    rail.style.scrollSnapType = originalSnap;
    cards.forEach((card, index) => {
      card.style.scale = originalScale[index];
      card.classList.remove('is-current');
    });
    if (progress) progress.style.width = originalProgress || '';
    // matchMedia reverts the tween and its pin spacer after this cleanup.
  };
}

function setupScenes(gsap, compact) {
  const query = selector => document.querySelector(selector);
  const all = selector => [...document.querySelectorAll(selector)];

  const hero = query('#hero') || query('.hero');
  if (hero) {
    const copy = hero.querySelector('.hero-copy');
    const photo = hero.querySelector('.hero-visual img');
    if (copy) gsap.to(copy, { y: compact ? -28 : -90, autoAlpha: 0,
      ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 30%', scrub: true } });
    if (photo) gsap.fromTo(photo, { scale: 1 }, { scale: compact ? 1.045 : 1.11,
      ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }

  const about = query('#about');
  const aboutPhoto = query('.about-photo');
  const aboutCopy = query('.about-copy');
  if (aboutPhoto) gsap.fromTo(aboutPhoto, { rotation: -9, y: compact ? 20 : 55 }, {
    rotation: -4, y: 0, ease: 'none',
    scrollTrigger: { trigger: about || aboutPhoto, start: 'top 90%', end: 'center 65%', scrub: 0.7 },
  });
  const aboutLabel = query('.about-label');
  if (aboutLabel) gsap.from(aboutLabel, { scale: 0.9, rotation: -9, duration: 0.65, ease: 'power2.out',
    scrollTrigger: { trigger: aboutPhoto || aboutLabel, start: 'top 88%', once: true } });
  if (aboutCopy) gsap.from(aboutCopy, { y: compact ? 22 : 48, autoAlpha: 0, duration: 0.75,
    scrollTrigger: { trigger: aboutCopy, start: 'top 91%', once: true } });

  const film = query('.film-scene');
  const filmTrack = query('.film-track');
  if (film && filmTrack) gsap.to(filmTrack, { x: () => {
    const extra = Math.max(0, filmTrack.scrollWidth - film.clientWidth);
    return -Math.min(extra, compact ? 180 : Math.min(extra * 0.45, 650));
  }, ease: 'none', scrollTrigger: {
    trigger: film, start: 'top bottom', end: 'bottom top', scrub: 0.8, invalidateOnRefresh: true,
  } });

  const desk = query('#contents');
  const vinyl = query('.vinyl-image');
  if (desk && vinyl) gsap.fromTo(vinyl, { '--vinyl-rotation': '-30deg' }, {
    '--vinyl-rotation': '100deg', ease: 'none',
    scrollTrigger: { trigger: desk, start: 'top bottom', end: 'bottom top', scrub: 0.7 },
  });
  if (desk) all('#contents .desk-object').forEach(object => {
    const depth = clamp(Number(object.dataset.depth) || 0, -1, 1);
    if (!depth) return;
    gsap.fromTo(object, { y: -depth * (compact ? 6 : 22) }, {
      y: depth * (compact ? 12 : 45), ease: 'none',
      scrollTrigger: { trigger: desk, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
    });
  });

  if (!compact) all('#services .format-row').forEach((row, index) => {
    const word = row.querySelector('.format-word');
    if (word) gsap.from(word, { x: index % 2 ? 35 : -35, ease: 'none',
      scrollTrigger: { trigger: row, start: 'top bottom', end: 'center center', scrub: 0.65 } });
  });

  const letter = query('#contact .letter-scene');
  const sheet = query('#contact .letter-sheet');
  const envelope = query('#contact .letter-envelope');
  if (letter && sheet) gsap.from(sheet, { y: compact ? 45 : 120, rotation: compact ? -2 : -5,
    ease: 'power2.out', scrollTrigger: { trigger: letter, start: 'top 94%', end: 'center 65%', scrub: 0.8 } });
  if (letter && envelope) gsap.from(envelope, { y: compact ? 12 : 30, rotation: 2,
    ease: 'power2.out', scrollTrigger: { trigger: letter, start: 'top 94%', end: 'center 65%', scrub: 0.8 } });
}

export function initMotion() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) {
    const reveal = document.querySelector('.hero-reveal');
    if (reveal) reveal.style.visibility = 'hidden';
    const cleanupWorld = setupWorld(null, null, { desktop: false, reduced: true });
    const cleanupWork = setupWork(null, { desktop: false, reduced: true });
    const cleanupServices = setupServices(null, null, { reduced: true });
    return () => { cleanupServices(); cleanupWork(); cleanupWorld(); };
  }
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  let disposed = false;
  let refreshFrame = 0;
  const refresh = () => {
    if (disposed || refreshFrame) return;
    refreshFrame = requestAnimationFrame(() => {
      refreshFrame = 0;
      if (!disposed) ScrollTrigger.refresh();
    });
  };
  media.add({
    reduced: '(prefers-reduced-motion: reduce)',
    desktop: '(min-width: 1100px) and (min-height: 680px)',
    worldDesktop: '(min-width: 1024px) and (min-height: 700px)',
    servicesDesktop: '(min-width: 1100px) and (min-height: 820px)',
    wide: '(min-width: 768px)',
    compact: '(max-width: 767px)',
  }, context => {
    const { reduced, desktop, compact, worldDesktop, servicesDesktop } = context.conditions;
    intro(gsap, reduced);
    const cleanupWorld = setupWorld(gsap, ScrollTrigger, { desktop: worldDesktop, reduced });
    const cleanupWork = setupWork(gsap, { desktop, reduced });
    const cleanupServices = setupServices(gsap, ScrollTrigger, { desktop: servicesDesktop, reduced });
    if (!reduced) setupScenes(gsap, compact);
    refresh();
    return () => { cleanupServices(); cleanupWork(); cleanupWorld(); };
  });
  const pendingImages = [...document.images].filter(image => !image.complete);
  pendingImages.forEach(image => image.addEventListener('load', refresh, { once: true }));
  document.fonts?.ready.then(refresh);
  window.addEventListener('load', refresh, { once: true });
  return () => {
    disposed = true;
    if (refreshFrame) cancelAnimationFrame(refreshFrame);
    pendingImages.forEach(image => image.removeEventListener('load', refresh));
    window.removeEventListener('load', refresh);
    media.revert();
  };
}
