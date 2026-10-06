/** Solid header on scroll, reading progress, mobile menu, and the current section in the nav. */
export function initNav() {
  const header = document.querySelector('.site-header');
  const burger = document.querySelector('.burger');
  const bar = document.querySelector('.progress');
  const links = [...document.querySelectorAll('.nav ul a[href^="#"]')];
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  const onScroll = () => {
    header.classList.toggle('scrolled', scrollY > 40);
    if (bar) {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
    }
    const y = scrollY + innerHeight * .35;
    let current = -1;
    sections.forEach((s, i) => { if (s.offsetTop <= y) current = i; });
    links.forEach((a, i) => a.classList.toggle('current', i === current));
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  onScroll();

  const close = () => { header.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); };
  burger.addEventListener('click', () => burger.setAttribute('aria-expanded', header.classList.toggle('open')));
  document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', close));
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}
