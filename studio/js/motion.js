/** True when the visitor asked the OS/browser for less motion — every animation checks this. */
export const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Resolves when `name` finishes on `el`, or after `fallbackMs` if the event never fires. */
export const animationEnded = (el, name, fallbackMs) => Promise.race([
  new Promise(resolve => el.addEventListener('animationend', e => { if (e.animationName === name) resolve(); })),
  new Promise(resolve => setTimeout(resolve, fallbackMs)),
]);

export const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calls `fn(el)` once each element has risen above `ratio` of the viewport height.
 *
 * This deliberately measures on scroll rather than using IntersectionObserver: a single jump
 * (End key, anchor link, trackpad flick) can carry an element from below the fold to above it
 * without ever crossing a threshold, so the observer reports nothing and the element stays hidden
 * for good. A rAF-throttled check can't be skipped, and it unhooks itself once everything is out.
 */
export function onceInView(els, fn, ratio = .88) {
  const pending = new Set(els);
  let queued = false;

  const check = () => {
    queued = false;
    for (const el of pending) {
      if (el.getBoundingClientRect().top < innerHeight * ratio) { fn(el); pending.delete(el); }
    }
    if (!pending.size) {
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
    }
  };
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(check); } };

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  check();
}
