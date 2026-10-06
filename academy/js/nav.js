import { prefersReducedMotion } from './motion.js';

/**
 * The header: solid once scrolled, the reading-progress tape, the current section underlined, the logo back to
 * the top, and the phone menu (burger, Esc to close). Same file on the Academy and the Studio.
 */
export function initNav() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const burger = header.querySelector('.burger');
  const bar = document.querySelector('.progress');
  const links = [...header.querySelectorAll('.nav ul a[href^="#"]')];
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  const onScroll = () => {
    header.classList.toggle('scrolled', scrollY > 40);
    if (bar) {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
    }
    const y = scrollY + innerHeight * .35;
    let current = -1;
    sections.forEach((s, i) => { if (s.offsetParent && s.offsetTop <= y) current = i; });
    links.forEach(a => a.classList.toggle('current', current >= 0 && a.getAttribute('href') === `#${sections[current].id}`));
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  onScroll();

  header.querySelector('.brand')?.addEventListener('click', e => {
    e.preventDefault();
    scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    history.replaceState(null, '', location.pathname);
  });

  const setOpen = open => { header.classList.toggle('open', open); burger.setAttribute('aria-expanded', String(open)); };
  burger.addEventListener('click', () => setOpen(!header.classList.contains('open')));
  header.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
}
