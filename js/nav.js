(function() {
  const header = document.querySelector('[data-header]');
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-nav-toggle]');
  if (!nav || !toggle) return;

  const html = document.documentElement;
  const body = document.body;
  const firstLink = nav.querySelector('a');
  let lastFocusedBeforeOpen = null;

  const isOpen = () => nav.getAttribute('data-state') === 'open';

  const openNav = () => {
    lastFocusedBeforeOpen = document.activeElement;
    nav.setAttribute('data-state', 'open');
    toggle.classList.add('is-active');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Menü schließen');
    html.setAttribute('data-nav-open', 'true');
    body.classList.add('body--nav-open');
    if (firstLink) firstLink.focus({ preventScroll: true });
  };

  const closeNav = (returnFocus = true) => {
    nav.setAttribute('data-state', 'closed');
    toggle.classList.remove('is-active');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Menü öffnen');
    html.removeAttribute('data-nav-open');
    body.classList.remove('body--nav-open');
    if (returnFocus && lastFocusedBeforeOpen) {
      toggle.focus({ preventScroll: true });
    }
  };

  const toggleNav = () => {
    isOpen() ? closeNav(true) : openNav();
  };

  toggle.addEventListener('click', toggleNav);

  // Ensure keyboard activation works consistently across browsers
  toggle.addEventListener('keydown', (e) => {
    const isEnter = e.key === 'Enter';
    const isSpace = e.key === ' ' || e.key === 'Spacebar' || e.code === 'Space';
    if (isEnter || isSpace) {
      e.preventDefault();
      toggleNav();
    }
  });

  // ESC schließt
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      closeNav(true);
    }
  });

  // Close when clicking outside (mobile)
  document.addEventListener('click', (e) => {
    if (window.matchMedia('(min-width:900px)').matches) return;
    if (!isOpen()) return;
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      closeNav(true);
    }
  });

  // Scroll Detection (Shadow / Solid)
  if (header) {
    const onScroll = () => {
      const current = window.scrollY;
      if (current > 8) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
