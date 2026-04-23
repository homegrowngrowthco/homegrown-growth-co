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
     ACTIVE NAV LINK
  ---------------------------------------------------------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav__link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

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

  /* ----------------------------------------------------------
     RESOURCES — Email capture (mailto fallback)
  ---------------------------------------------------------- */
  const notifyForm = document.getElementById('notify-form');

  if (notifyForm) {
    notifyForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailInput = notifyForm.querySelector('input[type="email"]');
      const email = emailInput ? emailInput.value.trim() : '';
      if (email) {
        window.location.href = `mailto:ian@homegrowngrowth.co?subject=Notify%20me%20about%20new%20resources&body=Please%20add%20me%20to%20your%20resources%20notification%20list.%0A%0AEmail%3A%20${encodeURIComponent(email)}`;
      }
    });
  }

})();
