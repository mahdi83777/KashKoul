import { prefersReducedMotion, animationEnded, wait } from './motion.js';

/**
 * Cursor interaction: --x/--y drive the colour-reveal mask, --px/--py (-1…1) drive the parallax.
 * See css/sections/hero.css.
 */
export function initHeroPointer() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  hero.addEventListener('pointermove', e => {
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

/** Types `el.dataset.type` into `el`, one character every `speed` ms. */
const typeInto = (el, speed) => new Promise(resolve => {
  const text = el.dataset.type;
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
 * The opening sequence. Acts 1–3 are pure CSS keyed off body.enter, act 4 off body.landed
 * (see css/sections/hero-intro.css); this function only sets the classes at the right moments
 * and types the definition once the notebook has landed.
 */
export async function playOpening() {
  const entry = document.getElementById('entry');
  const stamp = document.querySelector('.stamp');
  const defs = [...document.querySelectorAll('.entry .def')];
  if (!entry || !stamp) return;

  const finish = () => entry.classList.add('done');

  if (prefersReducedMotion) {
    defs.forEach(el => { el.textContent = el.dataset.type; });
    document.body.classList.add('enter', 'landed');
    finish();
    return;
  }

  document.body.classList.add('enter');                 // acts 1–3
  await animationEnded(entry, 'flutter', 4200);         // the notebook has landed
  document.body.classList.add('landed');                // act 4: the stamp thuds on
  await animationEnded(stamp, 'thud', 1200);
  await wait(250);
  for (const el of defs) { await typeInto(el, 42); await wait(300); }   // act 5
  finish();                                             // act 6: the button
}
