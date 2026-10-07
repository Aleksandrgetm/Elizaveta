/* The same five panels power scroll storytelling and the native touch carousel. */
const rememberedSelection = new WeakMap();
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const portraitPositions = [77, 22, 52, 84, 24];
const portraitScales = [1, 0.96, 0.97, 0.95, 0.95];
const portraitRotations = [-3, 2, -2, 3, -2];

export function setupWorld(gsap, ScrollTrigger, { desktop = false, reduced = false } = {}) {
  const section = document.querySelector('.world');
  const pin = section?.querySelector('.world-pin');
  const stage = section?.querySelector('.world-stage');
  const rail = section?.querySelector('.world-slides');
  const nav = section?.querySelector('.world-nav');
  const portrait = section?.querySelector('.world-portrait');
  const panels = [...(section?.querySelectorAll('.world-state') || [])];
  const tabs = [...(section?.querySelectorAll('.world-tab') || [])];
  if (!pin || !stage || !rail || !nav || !panels.length || tabs.length !== panels.length) return () => {};

  const enhanced = Boolean(desktop && !reduced && gsap && ScrollTrigger);
  const initialClass = section.classList.contains('is-story-desktop');
  const initialCategory = section.getAttribute('data-world-active');
  const panelAttributes = panels.map(panel => ({
    hidden: panel.getAttribute('aria-hidden'), inert: panel.inert,
    active: panel.classList.contains('is-active'),
  }));
  const tabAttributes = tabs.map(tab => ({
    selected: tab.getAttribute('aria-selected'), tabIndex: tab.getAttribute('tabindex'),
    active: tab.classList.contains('is-active'),
  }));
  const removers = [];
  let active = clamp(rememberedSelection.get(section) || 0, 0, panels.length - 1);
  let frame = 0;
  let alive = true;
  let trigger;
  let transition;
  let motionContext;
  let nativeTarget = null;

  const listen = (element, type, handler, options) => {
    element.addEventListener(type, handler, options);
    removers.push(() => element.removeEventListener(type, handler, options));
  };
  const schedule = callback => {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (alive) callback();
    });
  };
  const restoreAttribute = (element, name, value) => {
    if (value === null) element.removeAttribute(name);
    else element.setAttribute(name, value);
  };
  const panelOffset = index => {
    const maximum = Math.max(0, rail.scrollWidth - rail.clientWidth);
    const position = panels[index].getBoundingClientRect().left - rail.getBoundingClientRect().left + rail.scrollLeft;
    return clamp(position, 0, maximum);
  };
  function revealTab(index, immediate = false) {
    if (nav.scrollWidth <= nav.clientWidth) return;
    const bounds = tabs[index].getBoundingClientRect();
    const viewport = nav.getBoundingClientRect();
    let offset = 0;
    if (bounds.left < viewport.left + 8) offset = bounds.left - viewport.left - 8;
    else if (bounds.right > viewport.right - 8) offset = bounds.right - viewport.right + 8;
    if (offset) nav.scrollTo({ left: nav.scrollLeft + offset, behavior: reduced || immediate ? 'instant' : 'smooth' });
  }
  function paint(index, immediate = false) {
    const previousPanel = panels[active];
    const restoreFocus = index !== active && previousPanel.contains(document.activeElement);
    active = clamp(index, 0, panels.length - 1);
    rememberedSelection.set(section, active);
    section.dataset.worldActive = panels[active].dataset.category || String(active);
    tabs.forEach((tab, item) => {
      const current = item === active;
      tab.classList.toggle('is-active', current);
      tab.setAttribute('aria-selected', String(current));
      tab.tabIndex = current ? 0 : -1;
    });
    panels.forEach((panel, item) => {
      const current = item === active;
      panel.classList.toggle('is-active', current);
      panel.setAttribute('aria-hidden', String(!current));
      panel.inert = !current;
    });
    if (restoreFocus) tabs[active].focus({ preventScroll: true });
    revealTab(active, immediate);
  }
  const portraitPose = index => ({
    xPercent: -50,
    x: stage.clientWidth * ((portraitPositions[index] ?? 50) / 100 - 0.5),
    scale: portraitScales[index] ?? 1,
    rotation: portraitRotations[index] ?? 0,
  });

  section.classList.toggle('is-story-desktop', enhanced);
  paint(active, true);

  if (enhanced) {
    // Event-created timelines belong to this context as well, so a breakpoint
    // change restores CSS transforms, clip paths and opacity without residue.
    motionContext = gsap.context(() => {}, section);
    motionContext.add('showState', (index, immediate = false) => {
      const previous = active;
      transition?.kill();
      transition = null;
      paint(index, immediate);
      panels.forEach((panel, item) => {
        gsap.set(panel, { autoAlpha: item === active || (!immediate && item === previous) ? 1 : 0, y: 0 });
      });
      const incoming = panels[active];
      const picture = incoming.querySelector('.world-category-image');
      const copy = incoming.querySelector('.world-state-copy');
      const words = copy ? [...copy.children] : [];
      if (immediate || previous === active) {
        if (picture) gsap.set(picture, { clipPath: 'inset(0% 0% 0% 0%)', y: 0, scale: 1 });
        if (words.length) gsap.set(words, { autoAlpha: 1, y: 0 });
        if (portrait) gsap.set(portrait, portraitPose(active));
        return;
      }
      transition = gsap.timeline({ defaults: { ease: 'power2.out' } });
      transition.to(panels[previous], { autoAlpha: 0, y: -12, duration: 0.3 }, 0);
      if (picture) transition.fromTo(picture, {
        clipPath: 'inset(0% 0% 100% 0%)', y: 22, scale: 1.045,
      }, {
        clipPath: 'inset(0% 0% 0% 0%)', y: 0, scale: 1, duration: 0.72,
      }, 0.04);
      if (words.length) transition.fromTo(words, { autoAlpha: 0, y: 17 }, {
        autoAlpha: 1, y: 0, duration: 0.48, stagger: 0.07,
      }, 0.15);
      if (portrait) transition.to(portrait, { ...portraitPose(active), duration: 0.74, ease: 'power2.inOut' }, 0);
    });
    motionContext.showState(active, true);
    motionContext.add('intro', () => {
      const heading = section.querySelectorAll('.section-marker, .world-heading');
      const portraitLayers = section.querySelectorAll('.world-face, .world-frame');
      const entrance = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: { trigger: section, start: 'top 80%', once: true },
      });
      if (heading.length) entrance.from(heading, { y: 12, duration: 0.38, stagger: 0.07 }, 0);
      if (portraitLayers.length) entrance.from(portraitLayers, {
        scale: 0.96, transformOrigin: '50% 50%', duration: 0.48, stagger: 0.04,
      }, 0.12);
      entrance.from(nav, { clipPath: 'inset(0% 100% 0% 0%)', duration: 0.4 }, 0.32);
    });
    motionContext.intro();
    const indexAt = progress => clamp(Math.round(progress * (panels.length - 1)), 0, panels.length - 1);
    trigger = ScrollTrigger.create({
      trigger: pin, pin, start: 'top top',
      end: () => `+=${Math.round(window.innerHeight * 2.4)}`,
      anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: self => {
        const index = indexAt(self.progress);
        if (index !== active) motionContext.showState(index);
      },
      onRefresh: self => motionContext.showState(indexAt(self.progress), true),
    });
  }

  function select(index) {
    const target = clamp(index, 0, panels.length - 1);
    if (enhanced && trigger) {
      if (target !== active) motionContext.showState(target);
      const distance = trigger.end - trigger.start;
      const offset = clamp(target / Math.max(1, panels.length - 1) * distance, 1, Math.max(1, distance - 1));
      // Jump directly to the matching scroll state; smooth vertical travel
      // would pass through intermediate categories and interrupt the reveal.
      window.scrollTo({ top: trigger.start + offset, behavior: 'instant' });
      ScrollTrigger.update();
      revealTab(target);
    } else {
      nativeTarget = target;
      paint(target);
      rail.scrollTo({ left: panelOffset(target), behavior: reduced ? 'instant' : 'smooth' });
    }
  }
  tabs.forEach((tab, index) => {
    listen(tab, 'click', () => select(index));
    listen(tab, 'keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      tabs[next].focus({ preventScroll: true });
      select(next);
    });
  });

  if (!enhanced) {
    const syncFromSwipe = () => {
      // A tab jump can pass several slides. Keep its requested tab selected
      // until arrival; a new touch or wheel gesture immediately takes control.
      if (nativeTarget !== null) {
        if (Math.abs(rail.scrollLeft - panelOffset(nativeTarget)) > 2) return;
        nativeTarget = null;
      }
      const viewport = rail.getBoundingClientRect();
      const center = viewport.left + rail.clientWidth / 2;
      let nearest = active;
      let distance = Infinity;
      panels.forEach((panel, index) => {
        const bounds = panel.getBoundingClientRect();
        const delta = Math.abs(bounds.left + bounds.width / 2 - center);
        if (delta < distance) { nearest = index; distance = delta; }
      });
      if (nearest !== active) paint(nearest);
    };
    listen(rail, 'scroll', () => schedule(syncFromSwipe), { passive: true });
    listen(rail, 'pointerdown', () => { nativeTarget = null; }, { passive: true });
    listen(rail, 'wheel', () => { nativeTarget = null; }, { passive: true });
    listen(rail, 'scrollend', () => { nativeTarget = null; schedule(syncFromSwipe); }, { passive: true });
    listen(window, 'resize', () => schedule(() => {
      nativeTarget = null;
      rail.scrollTo({ left: panelOffset(active), behavior: 'instant' });
      revealTab(active, true);
    }), { passive: true });
    // The first layout after a mode change has the native panel widths.
    schedule(() => rail.scrollTo({ left: panelOffset(active), behavior: 'instant' }));
  }

  return () => {
    alive = false;
    rememberedSelection.set(section, active);
    removers.forEach(remove => remove());
    if (frame) cancelAnimationFrame(frame);
    transition?.kill();
    trigger?.kill(true);
    motionContext?.revert();
    section.classList.toggle('is-story-desktop', initialClass);
    restoreAttribute(section, 'data-world-active', initialCategory);
    panels.forEach((panel, index) => {
      restoreAttribute(panel, 'aria-hidden', panelAttributes[index].hidden);
      panel.inert = panelAttributes[index].inert;
      panel.classList.toggle('is-active', panelAttributes[index].active);
    });
    tabs.forEach((tab, index) => {
      restoreAttribute(tab, 'aria-selected', tabAttributes[index].selected);
      restoreAttribute(tab, 'tabindex', tabAttributes[index].tabIndex);
      tab.classList.toggle('is-active', tabAttributes[index].active);
    });
  };
}
