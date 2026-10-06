import { SHEET } from './config.js';

/** Renders the contact sheet and makes it drag-scrollable with a mouse. */
export function initGallery() {
  const strip = document.getElementById('sheet-strip');
  if (!strip) return;

  strip.innerHTML = SHEET.map(s => `
    <figure data-zoom="assets/photos/${s.img}" data-caption="${s.caption}" tabindex="0" role="button" aria-label="Enlarge: ${s.caption}">
      <img src="assets/photos/${s.img}" alt="${s.caption}" loading="lazy">
      <figcaption>${s.caption}</figcaption>
    </figure>`).join('');

  let down = false, startX = 0, startLeft = 0, moved = 0;
  strip.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse') return;
    down = true; moved = 0; startX = e.clientX; startLeft = strip.scrollLeft;
    strip.classList.add('dragging');
  });
  strip.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    moved = Math.max(moved, Math.abs(dx));
    strip.scrollLeft = startLeft - dx;
  });
  const up = () => { down = false; strip.classList.remove('dragging'); };
  strip.addEventListener('pointerup', up);
  strip.addEventListener('pointerleave', up);
  // a drag shouldn't also open the lightbox
  strip.addEventListener('click', e => { if (moved > 6) { e.stopPropagation(); e.preventDefault(); } }, true);
}
