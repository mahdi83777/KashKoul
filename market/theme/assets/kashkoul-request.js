// "Request a product" (sections/kashkoul-request.liquid). WhatsApp messages carry what the customer typed: the
// intro line, then each filled field under its label (link, size/color/version, quantity, name, anything else), in
// the visitor's language.
// - "Send it on WhatsApp" beside the form: built from the form at the moment it's pressed (the short message when
//   nothing is typed yet).
// - "Also send it on WhatsApp" after sending: the page reloads after the form is sent, so the message is kept in the
//   browser for this visit and put on that button.
// An optional email the customer typed becomes the request's reply-to address instead of the shop's own.
(() => {
  const KEY = 'kk-request-message';
  const FIELDS = ['Amazon link', 'Size, color or version', 'Quantity', 'name', 'body'];
  const form = document.getElementById('kk-request');

  /** @param {HTMLFormElement} f */
  const buildMessage = (f) => {
    const lines = [];
    for (const name of FIELDS) {
      const input = f.querySelector(`[name="contact[${name}]"]`);
      if (!(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement)) continue;
      const value = input.value.trim();
      if (!value || (name === 'Quantity' && !lines.length)) continue;
      const label = f.querySelector(`label[for="${input.id}"]`)?.cloneNode(true);
      label?.querySelector('.kk-req__opt')?.remove();
      lines.push(`${label?.textContent.trim() ?? name}: ${value}`);
    }
    if (!lines.length) return null;
    const intro = f.querySelector('[data-kk-request-intro]')?.dataset.kkRequestIntro ?? '';
    return [intro, ...lines].filter(Boolean).join('\n');
  };

  /** @param {HTMLAnchorElement} link @param {string} text */
  const setText = (link, text) => {
    const url = new URL(link.href);
    url.searchParams.set('text', text);
    link.href = url.toString();
  };

  if (form instanceof HTMLFormElement) {
    form.addEventListener('submit', () => {
      const email = form.querySelector('[name="contact[Customer email]"]');
      const replyTo = form.querySelector('[data-kk-request-email]');
      if (email instanceof HTMLInputElement && replyTo instanceof HTMLInputElement && email.value.trim()) replyTo.value = email.value.trim();
      const message = buildMessage(form);
      try {
        if (message) sessionStorage.setItem(KEY, message);
      } catch {}
    });

    // the WhatsApp way beside the form
    const direct = document.querySelector('[data-kk-request-direct]');
    if (direct instanceof HTMLAnchorElement) {
      const fallback = direct.href;
      direct.addEventListener('click', () => {
        const message = buildMessage(form);
        if (message) setText(direct, message);
        else direct.href = fallback;
      });
    }
  }

  // after sending
  const sent = document.querySelector('[data-kk-request-wa]');
  if (!(sent instanceof HTMLAnchorElement)) return;
  let message = null;
  try {
    message = sessionStorage.getItem(KEY);
  } catch {}
  if (message) setText(sent, message);
})();
