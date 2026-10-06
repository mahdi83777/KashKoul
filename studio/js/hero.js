import { prefersReducedMotion, animationEnded, wait, onceInView } from './motion.js';
import { HERO_TYPED } from './config.js';

/**
 * Cursor interaction: --x/--y drive the light that reveals the colour photo,
 * --px/--py (-1…1) drive the parallax. See css/sections/hero.css.
 */
export function initHeroPointer() {
  const hero = document.querySelector('.hero');
  if (!hero || prefersReducedMotion) return;
  hero.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    const r = hero.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    hero.style.setProperty('--x', `${x}px`);
    hero.style.setProperty('--y', `${y}px`);
    hero.style.setProperty('--px', (x / r.width - .5) * 2);
    hero.style.setProperty('--py', (y / r.height - .5) * 2);
    hero.classList.add('lit');
  });
  hero.addEventListener('pointerleave', () => {
    hero.classList.remove('lit');
    hero.style.setProperty('--px', 0);
    hero.style.setProperty('--py', 0);
  });
}

/** Types `text` into `el`, one character every `speed` ms. */
const typeInto = (el, text, speed) => new Promise(resolve => {
  let i = 0;
  el.classList.add('typing');
  const tick = () => {
    el.textContent = text.slice(0, ++i);
    if (i < text.length) setTimeout(tick, speed);
    else { el.classList.remove('typing'); resolve(); }
  };
  tick();
});

/**
 * The opening sequence. Acts 1–4 are pure CSS keyed off body.enter (see css/sections/hero-intro.css);
 * this function only sets the class and types the strip of uses at the end.
 */
export async function playOpening() {
  const last = document.querySelector('.polaroid:nth-of-type(3)');
  const typed = document.querySelector('.hero .typed');
  if (!last) return;

  if (prefersReducedMotion) {
    if (typed) typed.textContent = HERO_TYPED;
    document.body.classList.add('enter');
    return;
  }

  document.body.classList.add('enter');              // acts 1–3
  await animationEnded(last, 'flutter', 4600);       // the last polaroid has landed
  await wait(180);
  if (typed) await typeInto(typed, HERO_TYPED, 38);  // act 4
}

/** The dictionary card writes itself the first time it comes into view. */
export function initEntryTyping() {
  const defs = [...document.querySelectorAll('.entry .def[data-type]')];
  if (!defs.length) return;
  const entry = defs[0].closest('.entry');

  if (prefersReducedMotion) {
    defs.forEach(el => { el.textContent = el.dataset.type; });
    return;
  }
  onceInView([entry], async () => {
    for (const el of defs) { await typeInto(el, el.dataset.type, 26); await wait(220); }
  }, .75);
}
