// HOMEGROWN GROWTH CO. — nav.ts
// Imported once via BaseLayout. Astro bundles via Vite, hashes, and defers.

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget(opts: {
        url: string;
        parentElement: HTMLElement;
        prefill: Record<string, unknown>;
        utm: Record<string, unknown>;
      }): void;
    };
  }
}

(() => {
  // Sticky nav
  const nav = document.querySelector<HTMLElement>('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Mobile menu
  const hamburger = document.querySelector<HTMLButtonElement>('.nav__hamburger');
  const mobileNav = document.querySelector<HTMLElement>('.nav__mobile');
  const mobileLinks = document.querySelectorAll<HTMLElement>('.nav__mobile-link, .nav__mobile-cta');

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
      hamburger.classList.contains('open') ? closeMenu() : openMenu();
    });
    mobileLinks.forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // Services dropdown
  const dropdownWrap = document.querySelector<HTMLElement>('.nav__dropdown-wrap');
  const dropdownTrigger = dropdownWrap?.querySelector<HTMLButtonElement>('.nav__link--has-dropdown') ?? null;
  const dropdownMenu = dropdownWrap?.querySelector<HTMLElement>('.nav__dropdown') ?? null;

  if (dropdownWrap && dropdownTrigger && dropdownMenu) {
    const openDrop = () => {
      dropdownWrap.classList.add('open');
      dropdownTrigger.setAttribute('aria-expanded', 'true');
    };
    const closeDrop = () => {
      dropdownWrap.classList.remove('open');
      dropdownTrigger.setAttribute('aria-expanded', 'false');
    };

    dropdownTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDrop();
        dropdownMenu.querySelector<HTMLElement>('a')?.focus();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrop();
    });
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (target instanceof Node && !dropdownWrap.contains(target)) closeDrop();
    });
    dropdownMenu.addEventListener('keydown', (e) => {
      const items = Array.from(dropdownMenu.querySelectorAll<HTMLElement>('a, button'));
      const active = document.activeElement;
      const idx = active instanceof HTMLElement ? items.indexOf(active) : -1;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[Math.min(idx + 1, items.length - 1)]?.focus();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[Math.max(idx - 1, 0)]?.focus();
      }
    });
  }

  // Mobile services accordion
  const mobileGroupToggle = document.querySelector<HTMLButtonElement>('.nav__mobile-group-toggle');
  const mobileSub = document.querySelector<HTMLElement>('.nav__mobile-sub');
  if (mobileGroupToggle && mobileSub) {
    mobileGroupToggle.addEventListener('click', () => {
      const isOpen = mobileGroupToggle.getAttribute('aria-expanded') === 'true';
      mobileGroupToggle.setAttribute('aria-expanded', String(!isOpen));
      if (isOpen) mobileSub.setAttribute('hidden', '');
      else mobileSub.removeAttribute('hidden');
    });
  }

  // Active nav link is rendered server-side in Nav.astro; no client-side logic needed.

  // Scroll fade-up animations
  const fadeEls = document.querySelectorAll<HTMLElement>('.fade-up');
  if (fadeEls.length > 0) {
    const show = (el: HTMLElement) => el.classList.add('visible');
    const vh = window.innerHeight;
    fadeEls.forEach((el) => {
      if (el.getBoundingClientRect().top < vh) show(el);
    });

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.target instanceof HTMLElement) {
              show(entry.target);
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05 },
      );
      fadeEls.forEach((el) => {
        if (!el.classList.contains('visible')) io.observe(el);
      });
    } else {
      fadeEls.forEach(show);
    }

    // Nuclear fallback: nothing stays invisible after 1.5s
    setTimeout(() => fadeEls.forEach(show), 1500);
  }

  // Calendly embed — only present on /roi-call
  const calendlyTarget = document.getElementById('calendly-embed');
  if (calendlyTarget) {
    const initCalendly = () => {
      if (window.Calendly) {
        window.Calendly.initInlineWidget({
          url: 'https://calendly.com/homegrown-growth-co/homegrown-growth-ian',
          parentElement: calendlyTarget,
          prefill: {},
          utm: {},
        });
      }
    };
    if (window.Calendly) initCalendly();
    else window.addEventListener('load', initCalendly);
  }
})();

export {};
