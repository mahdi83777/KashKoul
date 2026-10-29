// Product page: keeps Kashkoul's variant-dependent blocks (availability line, deposit line) in step with the
// selected variant, and shows the chosen variant's photo straight away. Horizon only refreshes its own parts on a
// variant change; this does the same for any <kk-live data-block-id="…"> by morphing it from the section HTML
// Horizon has already fetched.
import { morph } from '@theme/morph';
import { StandardEvents } from '@shopify/events';

class KashkoulLive extends HTMLElement {
  connectedCallback() {
    this.section = this.closest('.shopify-section, dialog');
    this.section?.addEventListener(StandardEvents.productSelect, this.#onSelect);
  }

  disconnectedCallback() {
    this.section?.removeEventListener(StandardEvents.productSelect, this.#onSelect);
  }

  #onSelect = (event) => {
    if (!(event.target instanceof Element) || event.target.closest('product-card')) return;

    event.promise
      .then(({ detail }) => {
        const fresh = detail?.html?.querySelector(`kk-live[data-block-id="${this.dataset.blockId}"]`);
        if (fresh) morph(this, fresh, { childrenOnly: true });
      })
      .catch((error) => {
        if (error?.name !== 'AbortError') console.warn('[kk-live]', error);
      });
  };
}

if (!customElements.get('kk-live')) customElements.define('kk-live', KashkoulLive);

// Horizon only changes the photo after re-loading the whole product section from the server, which feels slow.
// Show the chosen variant's photo at once, in the gallery already on the page; Horizon's refresh then lands on the
// same photo. The variant → photo list is in blocks/kashkoul-availability.liquid.
document.addEventListener('change', (event) => {
  const input = event.target;
  const picker = input instanceof Element ? input.closest('variant-picker') : null;
  if (!picker || picker.closest('product-card')) return;

  const variantId = input instanceof HTMLSelectElement ? input.selectedOptions[0]?.dataset.variantId : input.dataset?.variantId;
  const section = picker.closest('.shopify-section, dialog');
  const list = section?.querySelector('[data-kk-variant-media]');
  if (!variantId || !list) return;

  let mediaId;
  try {
    mediaId = JSON.parse(list.textContent)[variantId];
  } catch {
    return;
  }
  const slideshow = section.querySelector('media-gallery slideshow-component');
  if (!mediaId || !slideshow?.select) return;

  const slides = [...slideshow.querySelectorAll('slideshow-slide')];
  const index = slides.findIndex((slide) => slide.querySelector(`[data-media-id="${mediaId}"]`));
  if (index > -1) slideshow.select(index, undefined, { animate: false });
});
