/* The mobile menu owns its animation and native-dialog lifecycle only. */
export function initMobileNavigation(lockPage) {
  const dialog = document.querySelector('#mobile-navigation');
  const toggle = document.querySelector('#mobile-menu-toggle');
  const closeButton = document.querySelector('#mobile-menu-close');
  const header = document.querySelector('.site-header');
  if (!dialog || !toggle || !closeButton || !header || !dialog.showModal) return () => {};

  const mobile = matchMedia('(max-width: 768px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const links = [...dialog.querySelectorAll('.mobile-menu-links>a')];
  const decor = [...dialog.querySelectorAll('.mobile-menu-decor')];
  const fawn = dialog.querySelector('.mobile-menu-fawn');
  const bottom = dialog.querySelector('.mobile-menu-bottom');
  const star = dialog.querySelector('.mobile-menu-star');
  const root = document.documentElement;
  const removers = [];
  let phase = 'closed';
  let generation = 0;
  let animations = [];
  let reaction;
  let unlock;
  let destination = null;
  let scrollFrame = 0;
  let navigationFrame = 0;
  let previousY = window.scrollY;
  let reactedLink;

  root.classList.add('has-mobile-navigation');
  const listen = (element, type, handler, options) => {
    element.addEventListener(type, handler, options);
    removers.push(() => element.removeEventListener(type, handler, options));
  };
  const cancelAnimations = () => {
    animations.forEach(animation => animation.cancel());
    animations = [];
  };
  const animate = (element, frames, options) => {
    if (!element?.animate) return Promise.resolve();
    const animation = element.animate(frames, { fill: 'both', easing: 'cubic-bezier(.22,.68,0,1)', ...options });
    animations.push(animation);
    return animation.finished.catch(() => {});
  };
  const markExpanded = expanded => {
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute('aria-label', expanded ? 'Закрыть меню' : 'Открыть меню');
    toggle.classList.toggle('is-open', expanded);
    closeButton.classList.toggle('is-open', expanded);
  };

  function markCurrent() {
    const marker = header.getBoundingClientRect().height + Math.min(150, window.innerHeight * 0.2);
    let current;
    let nearest = -Infinity;
    // Menu order intentionally differs from document order for the two services.
    links.forEach(link => {
      const target = document.getElementById(link.hash.slice(1));
      if (!target) return;
      const top = target.getBoundingClientRect().top;
      if (top <= marker && top > nearest) { current = link; nearest = top; }
    });
    links.forEach(link => {
      if (link === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function scrollToSection(target) {
    if (reduced.matches) { target.scrollIntoView({ behavior: 'instant', block: 'start' }); return; }
    const start = window.scrollY;
    const started = performance.now();
    const step = time => {
      navigationFrame = 0;
      const progress = reduced.matches ? 1 : Math.min(1, (time - started) / 600);
      const padding = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
      const end = window.scrollY + target.getBoundingClientRect().top - padding;
      // Lazy-photo refreshes may interrupt native smooth scrolling. This short
      // menu-owned tween follows the live anchor while section motion stays intact.
      window.scrollTo({ top: start + (end - start) * (1 - (1 - progress) ** 3), behavior: 'instant' });
      if (progress < 1) navigationFrame = requestAnimationFrame(step);
    };
    navigationFrame = requestAnimationFrame(step);
  }

  function finishClose() {
    generation += 1;
    cancelAnimations();
    reaction?.cancel();
    markExpanded(false);
    phase = 'closed';
    if (dialog.open) dialog.close();
    const restore = mobile.matches ? toggle : header.querySelector('.wordmark');
    unlock?.(restore);
    unlock = null;
    document.body.classList.remove('mobile-menu-open');
    previousY = window.scrollY;
    const hash = destination;
    destination = null;
    if (navigationFrame) cancelAnimationFrame(navigationFrame);
    navigationFrame = requestAnimationFrame(() => {
      navigationFrame = 0;
      window.ScrollTrigger?.refresh();
      if (!hash) return;
      // ScrollTrigger restores recorded scroll positions on its next frame.
      // Let that restoration finish before starting native anchor scrolling.
      navigationFrame = requestAnimationFrame(() => {
        navigationFrame = 0;
        const target = document.getElementById(hash.slice(1));
        if (!target) return;
        if (location.hash !== hash) history.pushState(null, '', hash);
        scrollToSection(target);
      });
    });
  }

  function close({ immediate = false, hash = null } = {}) {
    if (phase === 'closed') return;
    if (hash) destination = hash;
    if (immediate || reduced.matches || !dialog.animate) { finishClose(); return; }
    if (phase === 'closing') return;
    const clip = getComputedStyle(dialog).clipPath;
    const opacity = links.map(link => getComputedStyle(link).opacity);
    const version = ++generation;
    cancelAnimations();
    phase = 'closing';
    markExpanded(false);
    links.forEach((link, index) => animate(link, [
      { opacity: opacity[index], transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-8px)' },
    ], { duration: 145, delay: (links.length - index - 1) * 12 }));
    animate(bottom, [{ opacity: 1 }, { opacity: 0 }], { duration: 140 });
    decor.forEach(element => animate(element, [{ opacity: 1 }, { opacity: 0 }], { duration: 120 }));
    animate(dialog, [{ clipPath: clip === 'none' ? 'inset(0)' : clip },
      { clipPath: `inset(0 0 calc(100% - ${header.offsetHeight}px) 0)` }],
    { duration: 280, easing: 'cubic-bezier(.65,0,.35,1)' }).then(() => {
      if (version === generation) finishClose();
    });
  }

  function open() {
    if (!mobile.matches || phase === 'open' || phase === 'opening') return;
    if (document.querySelector('#media-dialog[open]')) return;
    if (navigationFrame) { cancelAnimationFrame(navigationFrame); navigationFrame = 0; }
    const version = ++generation;
    cancelAnimations();
    destination = null;
    if (!dialog.open) {
      markCurrent();
      dialog.classList.toggle('is-compact', header.classList.contains('is-compact'));
      unlock = lockPage();
      try { dialog.showModal(); }
      catch { unlock(toggle); unlock = null; return; }
      dialog.querySelector('.mobile-menu-body').scrollTop = 0;
    }
    phase = 'opening';
    document.body.classList.add('mobile-menu-open');
    // Read the initial two-line pose before applying the shared X state.
    closeButton.getBoundingClientRect();
    markExpanded(true);
    (links.find(link => link.getAttribute('aria-current')) || links[0]).focus({ preventScroll: true });
    if (reduced.matches || !dialog.animate) { phase = 'open'; return; }
    const jobs = [animate(dialog, [
      { clipPath: `inset(0 0 calc(100% - ${header.offsetHeight}px) 0)` },
      { clipPath: 'inset(0)' },
    ], { duration: 420 }), animate(fawn, [
      { opacity: 0, transform: 'translateY(-3px) scale(.94)' },
      { opacity: 1, transform: 'translateY(0) scale(1)' },
    ], { duration: 330, delay: 55 })];
    links.forEach((link, index) => jobs.push(animate(link, [
      { opacity: 0, transform: 'translateY(18px)', clipPath: 'inset(0 0 100% 0)' },
      { opacity: 1, transform: 'translateY(0)', clipPath: 'inset(0)' },
    ], { duration: 320, delay: 100 + index * 42 })));
    jobs.push(animate(bottom, [{ opacity: 0, transform: 'translateY(10px)' },
      { opacity: 1, transform: 'translateY(0)' }], { duration: 280, delay: 300 }));
    decor.forEach((element, index) => jobs.push(animate(element, [
      { opacity: 0, transform: 'translateY(8px) rotate(-7deg) scale(.92)' },
      { opacity: 1, transform: 'translateY(0) rotate(0deg) scale(1)' },
    ], { duration: 260, delay: 390 + index * 35 })));
    Promise.all(jobs).then(() => {
      if (version !== generation) return;
      phase = 'open';
      cancelAnimations();
    });
  }

  const updateHeader = () => {
    scrollFrame = 0;
    if (!mobile.matches || dialog.open || document.body.classList.contains('modal-open')) return;
    const y = Math.max(0, window.scrollY);
    if (y < 24) header.classList.remove('is-compact');
    else if (Math.abs(y - previousY) > 3) header.classList.toggle('is-compact', y > previousY);
    previousY = y;
  };
  listen(window, 'scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateHeader);
  }, { passive: true });
  const interruptScroll = () => {
    if (navigationFrame) { cancelAnimationFrame(navigationFrame); navigationFrame = 0; }
  };
  listen(window, 'wheel', interruptScroll, { passive: true });
  listen(window, 'touchstart', interruptScroll, { passive: true });
  listen(window, 'keydown', event => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) interruptScroll();
  });
  listen(toggle, 'click', open);
  listen(closeButton, 'click', () => phase === 'closing' ? open() : close());
  listen(dialog, 'cancel', event => { event.preventDefault(); close(); });
  listen(dialog, 'close', () => { if (!dialog.open && phase !== 'closed') finishClose(); });
  listen(dialog, 'click', event => {
    const link = event.target.closest('a[href]');
    if (!link || !dialog.contains(link)) return;
    const href = link.getAttribute('href');
    if (href.startsWith('#')) { event.preventDefault(); close({ hash: href }); }
    else close();
  });
  listen(dialog, 'keydown', event => {
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('a[href],button:not(:disabled)')];
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  const react = event => {
    const link = event.target.closest('.mobile-menu-links>a');
    if (!link || link === reactedLink || reduced.matches || phase === 'closing') return;
    reactedLink = link;
    reaction?.cancel();
    reaction = star?.animate?.([{ transform: 'rotate(0deg)' }, { transform: 'rotate(12deg)' },
      { transform: 'rotate(0deg)' }], { duration: 420, easing: 'ease-out' });
  };
  listen(dialog, 'pointerover', react);
  listen(dialog, 'pointerdown', react);
  listen(dialog, 'focusin', react);
  listen(mobile, 'change', () => {
    if (!mobile.matches) { close({ immediate: true }); header.classList.remove('is-compact'); }
    previousY = window.scrollY;
  });
  listen(reduced, 'change', () => {
    if (!reduced.matches) return;
    if (phase === 'closing') finishClose();
    else { generation += 1; cancelAnimations(); reaction?.cancel(); if (dialog.open) phase = 'open'; }
  });
  listen(window, 'pagehide', () => close({ immediate: true }));

  return () => {
    destination = null;
    if (phase !== 'closed') finishClose();
    cancelAnimations(); reaction?.cancel();
    if (scrollFrame) cancelAnimationFrame(scrollFrame);
    if (navigationFrame) cancelAnimationFrame(navigationFrame);
    removers.forEach(remove => remove());
    root.classList.remove('has-mobile-navigation');
    header.classList.remove('is-compact');
  };
}
