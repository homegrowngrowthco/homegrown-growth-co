/* ============================================================
   HOMEGROWN GROWTH CO. — analytics.js
   Loaded by every page with `defer`, so the work runs after HTML
   parsing but before DOMContentLoaded. Replaces the previously
   inline GA + Clarity bootstrap snippets.
   ============================================================ */

(function () {
  'use strict';

  /* Google Analytics 4 (gtag.js loads separately via <script async>) */
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-4QR1JQK9QL');

  /* Microsoft Clarity — injects the Clarity SDK script tag */
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', 'wgqsqcvysb');

})();
