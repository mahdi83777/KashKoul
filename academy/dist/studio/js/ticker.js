import { TICKER } from './config.js';

/** Fills the fact strip twice over, so the loop has something to scroll into. */
export function initTicker() {
  const track = document.getElementById('ticker');
  if (!track) return;
  const row = TICKER.map(f => `<span>${f}</span>`).join('');
  track.innerHTML = row + row;
}
