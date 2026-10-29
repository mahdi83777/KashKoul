// Kashkoul, site-wide. On computers (990px and wider) Horizon's cart drawer squeezes the page instead of covering it,
// so there's no backdrop to click: close the open cart when the visitor clicks anywhere on the page outside it.
// (On phones the drawer covers the page and Horizon already closes it on a tap outside.)
document.addEventListener('click', (event) => {
  const drawer = document.querySelector('theme-drawer#cart-drawer');
  if (!drawer?.isOpen || typeof drawer.close !== 'function') return;

  const target = event.target;
  if (!(target instanceof Element)) return;
  if (drawer.contains(target)) return;
  // the cart icon toggles the drawer itself; add-to-cart buttons may (re)open it
  if (target.closest('[aria-controls="cart-drawer"], add-to-cart-component, .add-to-cart-button, quick-add-component')) return;
  // clicks inside another open dialog (search, quick add, zoom) belong to that dialog
  if (target.closest('dialog[open]')) return;

  drawer.close();
});

// The cart doesn't follow you to the next page (no-persist in snippets/cart-drawer.liquid). Pressing Back can still
// bring a page back from the browser's memory with the cart open: close it as the page is left, and again on return.
const closeCartDrawer = () => {
  const drawer = document.querySelector('theme-drawer#cart-drawer');
  if (drawer?.isOpen && typeof drawer.close === 'function') drawer.close();
};
window.addEventListener('pagehide', closeCartDrawer);
window.addEventListener('pageshow', (event) => { if (event.persisted) closeCartDrawer(); });

// The header's Shop menu: the +/− next to a category opens or closes its sub-categories (snippets/mega-menu-list.liquid).
document.addEventListener('click', (event) => {
  const toggle = event.target instanceof Element ? event.target.closest('.kk-subtoggle') : null;
  if (!toggle) return;
  event.preventDefault();
  toggle.setAttribute('aria-expanded', String(toggle.getAttribute('aria-expanded') !== 'true'));
});

// Phones, shop page: the "Category" button opens the categories sheet (snippets/kashkoul-category-sheet.liquid); a tap
// on the dimmed page or the × closes it.
document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;
  const sheet = document.getElementById('kk-csheet');
  if (!(sheet instanceof HTMLDialogElement)) return;
  if (target.closest('[data-kk-csheet-open]')) sheet.showModal();
  else if (target.closest('[data-kk-csheet-close]') || target === sheet) sheet.close();
});

// Phones, shop page: once the "Category · Filter & sort" bar is scrolled past, it stays pinned at the top (below the
// header when it slides back in) until the products end. The spot before it keeps its height so nothing jumps.
(() => {
  const phone = window.matchMedia('(max-width: 749px)');
  let queued = false;
  const update = () => {
    queued = false;
    const spot = document.querySelector('.kk-ftoggle-spot');
    const bar = spot?.nextElementSibling;
    const wrapper = spot?.closest('.collection-wrapper');
    if (!bar || !wrapper) return;
    const header = document.getElementById('header-component');
    const top = header?.dataset.stickyState === 'active' ? header.getBoundingClientRect().bottom : 0;
    const pinned = phone.matches && spot.getBoundingClientRect().top < top && wrapper.getBoundingClientRect().bottom > top + bar.offsetHeight * 2;
    if (pinned && !bar.classList.contains('kk-pinned')) spot.style.height = `${bar.offsetHeight}px`;
    if (!pinned) spot.style.height = '';
    bar.classList.toggle('kk-pinned', pinned);
    bar.style.setProperty('--kk-pin-top', `${Math.max(0, top)}px`);
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
})();
