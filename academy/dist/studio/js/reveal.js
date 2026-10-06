import { onceInView } from './motion.js';

/** Sections marked .rise fade up the first time they appear. */
export function initReveal() {
  onceInView([...document.querySelectorAll('.rise')], el => el.classList.add('in'));
}
