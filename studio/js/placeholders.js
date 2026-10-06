/** A switch that highlights everything still to confirm with Kashkoul. Remove once the copy is final. */
export function initPlaceholders() {
  const btn = document.getElementById('ph-toggle');
  if (!btn) return;
  const count = document.querySelectorAll('.ph').length;
  const label = on => `${on ? 'Hide' : 'Show'} placeholders (${count})`;
  btn.textContent = label(false);
  btn.addEventListener('click', () => btn.textContent = label(document.body.classList.toggle('show-ph')));
}
