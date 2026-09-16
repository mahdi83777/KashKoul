import { prefersReducedMotion } from './motion.js';

/** Header turns solid once scrolled, brand logo returns to top, burger toggles the mobile menu. */
export function initNav() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  header.querySelector('.brand')?.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    history.replaceState(null, '', location.pathname);
  });

  const burger = header.querySelector('.burger');
  const setOpen = open => { header.classList.toggle('open', open); burger.setAttribute('aria-expanded', String(open)); };
  burger.addEventListener('click', () => setOpen(!header.classList.contains('open')));
  header.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => setOpen(false)));
}
