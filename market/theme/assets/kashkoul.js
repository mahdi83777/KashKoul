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
