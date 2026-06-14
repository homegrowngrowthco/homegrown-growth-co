/* ============================================================
   HOMEGROWN GROWTH CO. — analytics.js
   Loaded with `defer`, this only registers triggers. The heavy
   third-party scripts (gtag.js ~160KB + Microsoft Clarity) load
   on the first user interaction OR after the page goes idle,
   whichever comes first, so they never block the mobile
   critical-render path. Hosts are already in the netlify.toml CSP.

   Tradeoff: a visitor who bounces within a few seconds without
   interacting is not counted. Chosen deliberately for mobile speed.
   ============================================================ */

(function () {
  'use strict';

  var GA_ID = 'G-4QR1JQK9QL';
  var CLARITY_ID = 'wgqsqcvysb';
  var FALLBACK_MS = 3000; // idle fallback so non-interacting visitors still register
  var loaded = false;

  var triggers = ['scroll', 'pointerdown', 'keydown', 'touchstart', 'mousemove'];
  var listenerOpts = { once: true, passive: true, capture: true };

  function removeTriggers() {
    triggers.forEach(function (evt) {
      window.removeEventListener(evt, load, listenerOpts);
    });
  }

  function load() {
    if (loaded) return;
    loaded = true;
    removeTriggers();

    /* Google Analytics 4: load the gtag library, then configure. */
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);

    /* Microsoft Clarity — injects the Clarity SDK script tag. */
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
  }

  /* Load on the first meaningful interaction... */
  triggers.forEach(function (evt) {
    window.addEventListener(evt, load, listenerOpts);
  });

  /* ...or once the page has settled, whichever happens first. */
  function scheduleIdle() {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(load, { timeout: FALLBACK_MS });
    } else {
      window.setTimeout(load, FALLBACK_MS);
    }
  }
  if (document.readyState === 'complete') {
    scheduleIdle();
  } else {
    window.addEventListener('load', scheduleIdle, { once: true });
  }
})();
