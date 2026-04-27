/* ============================================================
   HOMEGROWN GROWTH CO. — script.js
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     STICKY NAV
  ---------------------------------------------------------- */
  const nav = document.querySelector('.nav');

  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 8) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ----------------------------------------------------------
     MOBILE MENU
  ---------------------------------------------------------- */
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileNav = document.querySelector('.nav__mobile');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link, .nav__mobile-cta');

  if (hamburger && mobileNav) {
    const openMenu = () => {
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('open');
      isOpen ? closeMenu() : openMenu();
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ----------------------------------------------------------
     SERVICES DROPDOWN
  ---------------------------------------------------------- */
  const servicePages = [
    'fractional-revops', 'crm-implementation', 'process-automation',
    'reporting-analytics', 'tech-stack-audit', 'sales-comp-enablement'
  ];

  const dropdownWrap = document.querySelector('.nav__dropdown-wrap');
  const dropdownTrigger = dropdownWrap && dropdownWrap.querySelector('.nav__link--has-dropdown');
  const dropdownMenu = dropdownWrap && dropdownWrap.querySelector('.nav__dropdown');

  if (dropdownWrap && dropdownTrigger && dropdownMenu) {
    const openDrop = () => {
      dropdownWrap.classList.add('open');
      dropdownTrigger.setAttribute('aria-expanded', 'true');
    };
    const closeDrop = () => {
      dropdownWrap.classList.remove('open');
      dropdownTrigger.setAttribute('aria-expanded', 'false');
    };

    // Keyboard: Enter/Space opens, Escape closes, Tab closes
    dropdownTrigger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDrop(); dropdownMenu.querySelector('a').focus(); }
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrop(); });

    // Click outside closes
    document.addEventListener('click', e => {
      if (!dropdownWrap.contains(e.target)) closeDrop();
    });

    // Arrow-key nav within dropdown
    dropdownMenu.addEventListener('keydown', e => {
      const items = [...dropdownMenu.querySelectorAll('a, button')];
      const idx = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); items[Math.min(idx + 1, items.length - 1)].focus(); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); items[Math.max(idx - 1, 0)].focus(); }
    });
  }

  /* ----------------------------------------------------------
     MOBILE SERVICES ACCORDION
  ---------------------------------------------------------- */
  const mobileGroupToggle = document.querySelector('.nav__mobile-group-toggle');
  const mobileSub = document.querySelector('.nav__mobile-sub');

  if (mobileGroupToggle && mobileSub) {
    mobileGroupToggle.addEventListener('click', () => {
      const isOpen = mobileGroupToggle.getAttribute('aria-expanded') === 'true';
      mobileGroupToggle.setAttribute('aria-expanded', String(!isOpen));
      isOpen ? mobileSub.setAttribute('hidden', '') : mobileSub.removeAttribute('hidden');
    });
  }

  /* ----------------------------------------------------------
     ACTIVE NAV LINK
  ---------------------------------------------------------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const currentSlug = currentPath.replace(/\.html$/, '');
  const navLinks = document.querySelectorAll('.nav__link, .nav__link--has-dropdown');

  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Mark Services as active when on any service sub-page
  if (servicePages.includes(currentSlug) && dropdownTrigger) {
    dropdownTrigger.classList.add('active');
  }

  /* ----------------------------------------------------------
     SCROLL ANIMATIONS — Intersection Observer
     Strategy:
       1. Immediately show anything already in/above the viewport
       2. Observe everything else with a lenient threshold
       3. Hard fallback: show all after 1.5s regardless
  ---------------------------------------------------------- */
  const fadeEls = document.querySelectorAll('.fade-up');

  if (fadeEls.length > 0) {
    const show = el => el.classList.add('visible');

    // Step 1: show elements already at or above the fold right now
    const vh = window.innerHeight;
    fadeEls.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < vh) show(el);
    });

    // Step 2: watch remaining elements with a lenient threshold
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              show(entry.target);
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05 }   // just 5% visible is enough
      );

      fadeEls.forEach(el => {
        if (!el.classList.contains('visible')) io.observe(el);
      });
    } else {
      fadeEls.forEach(show);
    }

    // Step 3: nuclear fallback — nothing stays invisible after 1.5s
    setTimeout(() => fadeEls.forEach(show), 1500);
  }

  /* ----------------------------------------------------------
     CALENDLY EMBED INIT
     Only runs on roi-call.html where the placeholder exists
  ---------------------------------------------------------- */
  const calendlyTarget = document.getElementById('calendly-embed');

  if (calendlyTarget) {
    // Wait for Calendly script to load
    const initCalendly = () => {
      if (typeof Calendly !== 'undefined') {
        Calendly.initInlineWidget({
          url: 'https://calendly.com/homegrown-growth-co/homegrown-growth-ian',
          parentElement: calendlyTarget,
          prefill: {},
          utm: {},
        });
      }
    };

    // If script already loaded, init immediately; otherwise wait
    if (typeof Calendly !== 'undefined') {
      initCalendly();
    } else {
      window.addEventListener('load', initCalendly);
    }
  }

})();
