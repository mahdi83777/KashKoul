/** Click (or Enter on) anything with [data-zoom] to see the photo full size. */
export function initLightbox() {
  const box = document.querySelector('.lightbox');
  if (!box) return;
  const img = box.querySelector('img');
  const cap = box.querySelector('figcaption');
  let items = [], i = 0, lastFocus = null;

  const collect = () => { items = [...document.querySelectorAll('[data-zoom]')]; };

  const render = () => {
    const el = items[i];
    img.src = el.dataset.zoom;
    img.alt = el.dataset.caption || '';
    cap.textContent = el.dataset.caption || '';
  };
  const open = el => {
    collect();
    i = Math.max(0, items.indexOf(el));
    lastFocus = document.activeElement;
    render();
    box.classList.add('open');
    document.body.style.overflow = 'hidden';
    box.querySelector('.close').focus();
  };
  const close = () => {
    box.classList.remove('open');
    document.body.style.overflow = '';
    lastFocus?.focus();
  };
  const step = n => { i = (i + n + items.length) % items.length; render(); };

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-zoom]');
    if (el) { e.preventDefault(); open(el); }
  });
  document.addEventListener('keydown', e => {
    const el = e.target.closest?.('[data-zoom]');
    if (el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(el); return; }
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
  box.querySelector('.close').addEventListener('click', close);
  box.querySelector('.next').addEventListener('click', () => step(1));
  box.querySelector('.prev').addEventListener('click', () => step(-1));
  box.addEventListener('click', e => { if (e.target === box) close(); });
}
