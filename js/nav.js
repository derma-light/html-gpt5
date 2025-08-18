(function() {
  const header = document.querySelector('[data-header]');
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-nav-toggle]');
  if (!header || !nav || !toggle) return;

  const openNav = () => {
    nav.setAttribute('data-open', 'true');
    toggle.classList.add('is-active');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Menü schließen');
    // Fokustransfer (erste Link)
    const firstLink = nav.querySelector('a');
    if (firstLink) firstLink.focus({ preventScroll: true });
    document.documentElement.style.overflow = 'hidden'; /* Prevent background scroll */
  };

  const closeNav = () => {
    nav.setAttribute('data-open', 'false');
    toggle.classList.remove('is-active');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Menü öffnen');
    document.documentElement.style.overflow = '';
    toggle.focus({ preventScroll: true });
  };

  const toggleNav = () => {
    const isOpen = nav.getAttribute('data-open') === 'true';
    isOpen ? closeNav() : openNav();
  };

  toggle.addEventListener('click', toggleNav);

  // Close on Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (nav.getAttribute('data-open') === 'true') {
        closeNav();
      }
    }
  });

  // Close when clicking outside (mobile)
  document.addEventListener('click', (e) => {
    if (window.matchMedia('(min-width:900px)').matches) return;
    if (nav.getAttribute('data-open') !== 'true') return;
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      closeNav();
    }
  });

  // Scroll Detection (Shadow / Solid)
  let lastScrollY = window.scrollY;
  const onScroll = () => {
    const current = window.scrollY;
    if (current > 8) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
    lastScrollY = current;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Prevent focus trap issues: simple approach (no full trap)
  // Optional: implement full trap if viele interaktive Elemente.
})();
