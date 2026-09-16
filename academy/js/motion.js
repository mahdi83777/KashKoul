/** True when the visitor asked the OS/browser for less motion — every animation checks this. */
export const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Resolves when `name` finishes on `el`, or after `fallbackMs` if the event never fires. */
export const animationEnded = (el, name, fallbackMs) => Promise.race([
  new Promise(resolve => el.addEventListener('animationend', e => { if (e.animationName === name) resolve(); })),
  new Promise(resolve => setTimeout(resolve, fallbackMs)),
]);

export const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
