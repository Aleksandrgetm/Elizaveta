/**
 * Read-only browser audit for the current rendered viewport.
 * Run auditV2BrowserDocument through the approved CUA browser evaluate API.
 * This file does not launch/control a browser or require another dependency.
 * Repeat at 1440x900, 390x844, 320x740 and 768x1024 with normal/reduced motion;
 * scroll each scene into view first so native lazy images have loaded.
 */
export function auditV2BrowserDocument() {
  const all = selector => [...document.querySelectorAll(selector)];
  const root = document.documentElement;
  const bounds = element => {
    const rect = element.getBoundingClientRect();
    return { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) };
  };
  const visible = element => {
    const style = getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && element.getBoundingClientRect().height > 0;
  };
  const ids = all('[id]').map(element => element.id);
  return {
    viewport: { width: innerWidth, height: innerHeight },
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
    horizontalOverflow: root.scrollWidth - root.clientWidth,
    duplicateIds: ids.filter((id, index) => ids.indexOf(id) !== index),
    brokenAnchors: all('a[href^="#"]').filter(link => !document.getElementById(link.hash.slice(1))).map(link => link.hash),
    images: {
      total: document.images.length,
      complete: [...document.images].filter(image => image.complete && image.naturalWidth > 0).length,
      broken: [...document.images].filter(image => image.complete && !image.naturalWidth).map(image => image.currentSrc || image.src),
      pending: [...document.images].filter(image => !image.complete).map(image => image.currentSrc || image.src),
    },
    videoElements: document.querySelectorAll('video').length,
    videoRequests: performance.getEntriesByType('resource').filter(entry => /\.(mp4|webm|mov)(?:[?#]|$)/i.test(entry.name)).map(entry => entry.name),
    dialog: {
      open: Boolean(document.querySelector('#media-dialog')?.open),
      title: document.querySelector('#dialog-title')?.textContent,
      counter: document.querySelector('#dialog-counter')?.textContent,
      focusedId: document.activeElement?.id || '',
      focusInside: Boolean(document.querySelector('#media-dialog')?.contains(document.activeElement)),
    },
    selectedCategory: document.querySelector('.world-tab[aria-selected="true"]')?.dataset.category || '',
    currentChapter: document.querySelector('.chapter-link[aria-current="location"]')?.hash || '',
    workRail: (() => {
      const rail = document.querySelector('.work-rail');
      const track = document.querySelector('.work-track');
      return rail && track ? {
        overflowX: getComputedStyle(rail).overflowX,
        snap: getComputedStyle(rail).scrollSnapType,
        scrollLeft: rail.scrollLeft,
        scrollWidth: rail.scrollWidth,
        width: rail.clientWidth,
        trackTransform: getComputedStyle(track).transform,
        activeCard: document.querySelector('.work-card.is-current')?.dataset.workCard,
      } : null;
    })(),
    sections: all('main section').map(section => ({ id: section.id, ...bounds(section), visible: visible(section) })),
    pins: all('.pin-spacer').length,
    cursorVisible: Boolean(document.querySelector('#cursor') && visible(document.querySelector('#cursor'))),
  };
}
