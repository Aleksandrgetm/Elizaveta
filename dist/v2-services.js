/* Four services share one visual stage; touch layouts keep native accordions. */
const lastService = new WeakMap();

export function setupServices(gsap, ScrollTrigger, { desktop = false, reduced = false } = {}) {
  const section = document.querySelector('#service-index');
  if (!section) return () => {};
  const rows = [...section.querySelectorAll('.service-item')];
  const buttons = rows.map(row => row.querySelector('.service-toggle'));
  const panels = rows.map(row => row.querySelector('.service-panel'));
  const sequential = reduced || !gsap || !ScrollTrigger;
  const pinned = desktop && !sequential;
  const dialog = document.querySelector('#media-dialog');
  const modalOpen = () => document.body?.classList.contains('modal-open') || dialog?.open;
  let restoreAfterModal = Boolean(modalOpen());
  let restoring = false;
  let active = -1;
  let trigger;
  let entrance;
  let heightTween;
  let lineContext;
  let refreshFrame = 0;
  const removers = [];

  section.classList.toggle('is-services-desktop', pinned);
  section.classList.toggle('is-services-sequential', sequential);

  function clearEntrance() {
    entrance?.revert();
    entrance = null;
    heightTween?.kill();
    heightTween = null;
    panels.forEach(panel => { panel.style.height = ''; panel.style.overflow = ''; });
  }

  function refresh() {
    if (refreshFrame) cancelAnimationFrame(refreshFrame);
    refreshFrame = requestAnimationFrame(() => {
      refreshFrame = 0;
      ScrollTrigger?.refresh();
    });
  }

  function reveal(index) {
    const row = rows[index];
    const panel = panels[index];
    entrance = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline.from(row.querySelector('.service-name'), {
        y: 10, clipPath: 'inset(0 0 100% 0)', duration: 0.42,
      }, 0);
      timeline.from(panel.querySelector('.service-description'), {
        y: 15, autoAlpha: 0, duration: 0.45,
      }, 0.06);
      const reel = panel.querySelector('.service-reel');
      if (reel) timeline.from(reel, {
        clipPath: 'inset(0 0 100% 0)', y: 20, scale: 1.035, duration: 0.65,
      }, 0.05);
      const stories = [...panel.querySelectorAll('.service-story')];
      if (stories.length) timeline.from(stories, {
        x: -32, y: 25, rotation: 0, autoAlpha: 0, duration: 0.55, stagger: 0.12,
      }, 0.27);
      const photos = [...panel.querySelectorAll('.service-photo')];
      photos.forEach((photo, photoIndex) => {
        // Bring the individual print centres together before fanning them out.
        const frame = photo.parentElement;
        const x = frame.clientWidth / 2 - photo.offsetLeft - photo.offsetWidth / 2;
        const y = frame.clientHeight / 2 - photo.offsetTop - photo.offsetHeight / 2;
        timeline.from(photo, {
          x, y, rotation: (photoIndex - 1) * 3, scale: 0.91,
          duration: 0.7,
        }, 0.07 + photoIndex * 0.08);
      });
      const decor = panel.querySelector('.service-decor');
      if (decor) timeline.from(decor, { scale: 0.9, y: 10, autoAlpha: 0, duration: 0.45 }, 0.25);
      timeline.from(panel.querySelectorAll('.service-feature'), {
        y: 12, autoAlpha: 0, duration: 0.36, stagger: 0.055,
      }, 0.18);
    }, section);
  }

  function select(index, animate = true) {
    if (index === active) return;
    clearEntrance();
    active = index;
    lastService.set(section, index);
    rows.forEach((row, rowIndex) => {
      const open = rowIndex === index;
      const panel = panels[rowIndex];
      if (!open && panel.contains(document.activeElement)) buttons[rowIndex].focus({ preventScroll: true });
      row.classList.toggle('is-active', open);
      buttons[rowIndex].setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      panel.inert = !open;
    });
    if (animate && index >= 0) reveal(index);
  }

  if (sequential) {
    buttons.forEach((button, index) => {
      button.disabled = true;
      button.setAttribute('aria-expanded', 'true');
      panels[index].hidden = false;
      panels[index].inert = false;
    });
  } else {
    // -2 ensures the mobile -1 state closes every panel on first setup.
    active = -2;
    select(restoreAfterModal ? (lastService.get(section) ?? (pinned ? 0 : -1)) : (pinned ? 0 : -1), false);
    lineContext = gsap.context(() => {
      gsap.from(rows, {
        '--service-line': 0, duration: 0.65, stagger: 0.07, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 78%', once: true },
      });
    }, section);

    if (pinned) {
      trigger = ScrollTrigger.create({
        trigger: section.querySelector('.service-pin'),
        pin: true, start: 'top top', end: () => `+=${Math.round(window.innerHeight * 1.8)}`,
        anticipatePin: 1, invalidateOnRefresh: true,
        onEnter: () => { if (!modalOpen() && !restoring && active === 0) { clearEntrance(); reveal(0); } },
        onUpdate: self => { if (!modalOpen() && !restoring) select(Math.min(rows.length - 1, Math.floor(self.progress * rows.length))); },
        onRefresh: self => { if (!modalOpen() && !restoring) select(Math.min(rows.length - 1, Math.floor(self.progress * rows.length)), false); },
      });
    }

    buttons.forEach((button, index) => {
      const click = () => {
        if (pinned) {
          // Aim at the middle of each scene so rounding never picks its neighbour.
          const position = trigger.start + (index + 0.45) / rows.length * (trigger.end - trigger.start);
          select(index);
          window.scrollTo({ top: position, behavior: 'instant' });
          ScrollTrigger.update();
          return;
        }
        const before = button.getBoundingClientRect().top;
        const next = active === index ? -1 : index;
        select(next);
        // Closing an earlier panel should keep the tapped heading in place.
        const delta = button.getBoundingClientRect().top - before;
        if (before >= 0 && before < window.innerHeight && Math.abs(delta) > 1) {
          window.scrollTo({ top: window.scrollY + delta, behavior: 'instant' });
        }
        if (next < 0) { refresh(); return; }
        const panel = panels[next];
        const height = panel.scrollHeight;
        panel.style.overflow = 'hidden';
        heightTween = gsap.fromTo(panel, { height: 0 }, {
          height, duration: 0.34, ease: 'power2.out',
          onComplete: () => {
            panel.style.height = '';
            panel.style.overflow = '';
            heightTween = null;
            refresh();
          },
        });
      };
      button.addEventListener('click', click);
      removers.push(() => button.removeEventListener('click', click));
    });
  }

  // The existing viewer locks the body. Preserve its opener through scroll
  // resets and responsive re-initialisation, then restore the new geometry.
  if (dialog) {
    const closed = () => {
      if (restoreAfterModal && section.contains(document.activeElement)) {
        const index = lastService.get(section);
        restoring = true;
        ScrollTrigger?.refresh();
        if (index >= 0 && pinned && trigger) {
          window.scrollTo({ top: trigger.start + (index + 0.45) / rows.length * (trigger.end - trigger.start), behavior: 'instant' });
        } else if (index >= 0) {
          buttons[index].scrollIntoView({ behavior: 'instant', block: 'start' });
        }
        restoring = false;
        ScrollTrigger?.update();
      }
      restoreAfterModal = false;
    };
    dialog.addEventListener('close', closed);
    removers.push(() => dialog.removeEventListener('close', closed));
  }

  return () => {
    removers.forEach(remove => remove());
    if (refreshFrame) cancelAnimationFrame(refreshFrame);
    clearEntrance();
    trigger?.kill(true);
    lineContext?.revert();
    section.classList.remove('is-services-desktop', 'is-services-sequential');
    rows.forEach((row, index) => {
      row.classList.remove('is-active');
      buttons[index].disabled = false;
      buttons[index].setAttribute('aria-expanded', 'true');
      panels[index].hidden = false;
      panels[index].inert = false;
    });
  };
}
