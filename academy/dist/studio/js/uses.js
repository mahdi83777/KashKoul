import { USES } from './config.js';
import { waLink } from './whatsapp.js';
import { prefersReducedMotion } from './motion.js';

/** Renders the "what people book it for" list and keeps the preview photo in step with it. */
export function initUses() {
  const list = document.getElementById('uses-list');
  const frame = document.getElementById('uses-frame');
  if (!list || !frame) return;

  list.innerHTML = USES.map((u, i) => `
    <li${i === 0 ? ' class="active"' : ''} data-i="${i}">
      <a href="${waLink(u.wa)}" target="_blank" rel="noopener">
        <span><b>${u.title}</b><span>${u.note}</span></span>
        <em>Ask on WhatsApp →</em>
      </a>
    </li>`).join('');

  frame.insertAdjacentHTML('afterbegin', USES.map((u, i) =>
    `<img src="assets/photos/${u.img}" alt="${u.caption}" class="${i === 0 ? 'on' : ''}" loading="lazy">`).join(''));

  const imgs = [...frame.querySelectorAll('img')];
  const cap = frame.querySelector('figcaption');
  cap.textContent = USES[0].caption;

  const show = i => {
    list.querySelectorAll('li').forEach(li => li.classList.toggle('active', +li.dataset.i === i));
    imgs.forEach((im, n) => im.classList.toggle('on', n === i));
    cap.textContent = USES[i].caption;
  };

  list.querySelectorAll('li').forEach(li => {
    const i = +li.dataset.i;
    li.addEventListener('mouseenter', () => { if (!prefersReducedMotion) show(i); });
    li.addEventListener('focusin', () => show(i));
    li.addEventListener('click', () => show(i));
  });
}
