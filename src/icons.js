/* ============================================================
   ICON SPRITE
   ------------------------------------------------------------
   One <symbol> per icon, injected once, referenced with <use>.
   The horseshoe path is 2,860 characters — inlined on 25 rating
   buttons that is ~74KB of duplicated markup, so it lives here
   once instead.

   Icons inherit currentColor, so a parent setting color tints
   them. That is what lets .star.on keep working unchanged.

   Brittany is building the full icon library in the Figma design
   system; this is the runtime side of it. New icons: export the
   vector as SVG from Figma, add a <symbol> below with an i- id,
   and reference it as <svg class="ico"><use href="#i-name"/></svg>.
   ============================================================ */
(function (d) {
  'use strict';
  var ICONS = {
    /* Horseshoe — Brittany, 27 Oct. Replaces the placeholder stars on the
       candidate rating. Chosen over ribbons because at 27x31 the simpler
       shape reads, and a rosette's placing colours would have said
       "third place" rather than "three out of five". */
    'i-horseshoe': { vb: '0 0 28 31', d: 'M24.8381 1.99483C25.4711 3.06448 24.4053 3.7601 24.2765 4.04674C24.23 4.15161 24.3338 4.39979 24.4124 4.53612C26.3331 7.84645 27.5527 11.4364 27.7208 15.2781C27.8424 18.0745 27.2666 20.7731 26.1149 23.2865C24.0977 27.6909 19.8952 30.5678 14.9702 30.9558C10.7998 31.2844 6.66881 29.7708 3.87189 26.7121C2.5843 25.2999 1.70445 23.7094 1.06424 21.9302C-0.613201 17.2671 -0.205465 12.7123 1.57212 8.13658C2.08715 6.80826 2.70948 5.63723 3.38547 4.38931C3.49992 4.17608 3.43196 3.94187 3.2424 3.77408C2.86328 3.43501 2.54138 2.88271 2.75598 2.37934C3.07072 1.63129 3.44269 0.967123 3.91481 0.285483C4.38692 -0.396157 6.52932 0.285483 7.62377 1.08597C8.87201 1.99483 8.44639 3.80554 7.69172 5.20727C6.19312 7.98627 5.20597 10.9296 4.88407 14.0756C4.28678 19.9482 7.36625 25.9956 13.8078 26.027C20.3887 26.0585 23.5147 19.8433 22.828 13.8763C22.4918 10.968 21.6191 8.24844 20.2707 5.65121C19.4052 3.98382 18.5861 1.9389 20.4066 0.883229C21.4868 0.257518 23.4217 -0.389166 23.8223 0.288979L24.8381 1.99483ZM3.1959 11.8454L3.74313 9.96128C3.78963 9.79699 3.51422 9.53482 3.36401 9.48588C3.21379 9.43694 2.7524 9.48937 2.70591 9.65017L2.15153 11.5972C2.10146 11.7685 2.44481 12.0516 2.61649 12.0726C2.77029 12.0901 3.15299 11.9957 3.1959 11.8454ZM25.5892 11.5658L25.0133 9.64318C24.9668 9.48937 24.5197 9.44393 24.3695 9.49287C24.2193 9.54181 23.9403 9.80398 23.9868 9.95429L24.5698 11.8908C24.6163 12.0412 25.0348 12.0901 25.1886 12.0551C25.3424 12.0202 25.6428 11.744 25.5892 11.5658ZM2.79175 16.5295L2.81678 14.5021C2.81678 14.3238 2.43766 14.163 2.27671 14.163C2.11576 14.163 1.75095 14.3343 1.7438 14.4916C1.71161 15.2186 1.6973 15.8688 1.76526 16.554C1.8046 16.9245 2.78459 16.928 2.78817 16.533L2.79175 16.5295ZM26.0005 16.526L25.9933 14.4811C25.9933 14.3168 25.5999 14.1665 25.4389 14.163C25.278 14.1595 24.8989 14.3343 24.906 14.53L24.9561 16.5435C24.9668 16.9035 25.8574 16.9315 26.0005 16.526ZM3.71452 21.0248L3.12795 19.1162C3.08503 18.9764 2.65941 18.924 2.50919 18.9519C2.35897 18.9799 2.07284 19.2316 2.11576 19.3819L2.64153 21.3639C2.77386 21.4932 3.1816 21.5457 3.34612 21.4932C3.49992 21.4443 3.75744 21.1786 3.71094 21.0248H3.71452ZM25.0956 21.287L25.6249 19.3889C25.6678 19.2351 25.3567 18.9764 25.2065 18.9554C25.0562 18.9345 24.695 18.9974 24.5913 19.1197L23.9868 21.0773C24.0584 21.259 24.2801 21.4723 24.4375 21.5142C24.5949 21.5562 25.0491 21.4513 25.0956 21.2905V21.287ZM6.07867 25.0343L4.81969 23.3634C4.64444 23.3005 4.31181 23.3529 4.1759 23.4368C4.03999 23.5207 3.88262 23.9297 3.98992 24.073L5.1702 25.632C5.27392 25.7683 5.71385 25.6984 5.84976 25.6145C5.98567 25.5306 6.18239 25.1706 6.07867 25.0343ZM22.5741 25.6145L23.7436 24.059C23.9296 23.8143 23.6077 23.4088 23.3573 23.3459C23.0283 23.262 22.8602 23.4193 22.6349 23.7199L21.637 25.0413C21.5368 25.1741 21.7336 25.5306 21.8695 25.625C22.0054 25.7194 22.4596 25.7683 22.5741 25.6145Z' }
  };

  function mount() {
    if (d.getElementById('es-sprite')) return;
    var ns = 'http://www.w3.org/2000/svg';
    var svg = d.createElementNS(ns, 'svg');
    svg.id = 'es-sprite';
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden');
    Object.keys(ICONS).forEach(function (k) {
      var sym = d.createElementNS(ns, 'symbol');
      sym.setAttribute('id', k);
      sym.setAttribute('viewBox', ICONS[k].vb);
      var p = d.createElementNS(ns, 'path');
      p.setAttribute('d', ICONS[k].d);
      p.setAttribute('fill', 'currentColor');
      sym.appendChild(p);
      svg.appendChild(sym);
    });
    d.body.insertBefore(svg, d.body.firstChild);
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', mount); else mount();
})(document);
