/* ============================================================
   FIND WORK BY STATE — interactive map (Kaitlin, 31 Oct: "can we make
   this an interactive map instead?").
   ------------------------------------------------------------
   The open-role counts live in the HTML, on the chip list under the map
   (a[data-st][data-n]). That list is the source of truth and the no-JS
   fallback; this script only draws the map from it, so a count is ever
   changed in one place.

   Shapes come from src/usmap-data.js (window.US_STATES), which is local:
   nothing is fetched at runtime.
   ============================================================ */
(function () {
  'use strict';
  var host = document.querySelector('[data-usmap]');
  if (!host || !window.US_STATES) return;
  var root = host.closest('.states') || document;
  var NS = 'http://www.w3.org/2000/svg';

  // Counts, read from the chips.
  var counts = {};
  root.querySelectorAll('[data-st]').forEach(function (a) {
    counts[a.getAttribute('data-st')] = parseInt(a.getAttribute('data-n'), 10) || 0;
  });

  // Colour scale: five steps of the brand blue, light to deep. Zero is neutral.
  // Steps must match the legend in index.html.
  function bucket(n) { return !n ? 0 : n <= 3 ? 1 : n <= 6 ? 2 : n <= 11 ? 3 : n <= 19 ? 4 : 5; }
  function phrase(n) { return n ? n + (n === 1 ? ' open role' : ' open roles') : 'no open roles right now'; }

  // The smallest north-east states get a labelled box out in the Atlantic,
  // so they can be hovered, tapped and read. Box y is the top edge.
  var CALLOUT = { VT: 108, NH: 138, MA: 168, RI: 198, CT: 228, NJ: 258, MD: 288, DE: 318 };
  var BX = 952, BW = 52, BH = 24;
  // Where a shape's own centre sits awkwardly for a number (Florida's falls on
  // the panhandle seam), the label is placed by hand.
  var LABEL_AT = { FL: [786, 548], LA: [566, 482] };

  function el(tag, attrs) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  var svg = el('svg', { viewBox: '0 0 1010 610', class: 'usm__svg', role: 'group',
    'aria-label': 'Map of the United States. Each state links to its open roles.' });
  var gStates = el('g', { class: 'usm__states' });
  var gLabels = el('g', { class: 'usm__labels', 'aria-hidden': 'true' });
  var byCode = {};

  window.US_STATES.forEach(function (s) {
    var name = s[0], code = s[1], n = counts[code] || 0, b = bucket(n);
    var a = el('a', { href: 'jobs.html?state=' + code, class: 'usm__st', 'data-b': b,
      'data-st': code, 'aria-label': name + ', ' + phrase(n) });
    var path = el('path', { d: s[2], id: 'usm-' + code });
    a.appendChild(path);

    if (CALLOUT[code] != null) {
      var y = CALLOUT[code];
      a.appendChild(el('line', { class: 'usm__lead', x1: s[3], y1: s[4], x2: BX, y2: y + BH / 2 }));
      a.appendChild(el('rect', { class: 'usm__box', x: BX, y: y, width: BW, height: BH, rx: 5 }));
      var t = el('text', { class: 'usm__boxt', x: BX + BW / 2, y: y + BH / 2 + 4.5, 'aria-hidden': 'true' });
      t.textContent = code + (n ? ' ' + n : '');
      a.appendChild(t);
    } else if (n) {
      var at = LABEL_AT[code] || [s[3], s[4]];
      var lt = el('text', { class: 'usm__n', 'data-b': b, x: at[0], y: at[1] + 4.5 });
      lt.textContent = n;
      gLabels.appendChild(lt);
    }
    gStates.appendChild(a);
    byCode[code] = { a: a, path: path, name: name, n: n };
  });

  // Highlight drawn on top of everything, so a neighbour never covers the edge.
  var halo = el('use', { class: 'usm__halo', href: '#usm-AL' });
  var ring = el('use', { class: 'usm__ring', href: '#usm-AL' });
  svg.appendChild(gStates); svg.appendChild(gLabels); svg.appendChild(halo); svg.appendChild(ring);

  var tip = document.createElement('div');
  tip.className = 'usm__tip'; tip.setAttribute('aria-hidden', 'true');
  host.appendChild(svg); host.appendChild(tip);
  host.classList.add('is-drawn');

  var focused = null, hovered = null;

  function show(code, x, y) {
    var s = byCode[code]; if (!s) return;
    halo.setAttribute('href', '#usm-' + code); ring.setAttribute('href', '#usm-' + code);
    svg.classList.add('has-hl');
    tip.innerHTML = '<b></b> · <span></span>';
    tip.firstChild.textContent = s.name;
    tip.lastChild.textContent = s.n ? phrase(s.n) : 'No open roles right now';
    var hb = host.getBoundingClientRect();
    if (x == null) {   // keyboard or chip: sit above the state itself
      var r = s.path.getBoundingClientRect();
      x = r.left + r.width / 2; y = r.top;
    }
    tip.classList.add('is-on');
    var w = tip.offsetWidth, h = tip.offsetHeight;
    var left = Math.max(4, Math.min(hb.width - w - 4, x - hb.left - w / 2));
    var top = y - hb.top - h - 12;
    if (top < 4) top = y - hb.top + 24;
    tip.style.transform = 'translate(' + Math.round(left) + 'px,' + Math.round(top) + 'px)';
  }
  function hide() { svg.classList.remove('has-hl'); tip.classList.remove('is-on'); }
  function rest() { if (focused) show(focused); else hide(); }

  svg.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    var a = e.target.closest && e.target.closest('.usm__st');
    if (!a) { if (hovered) { hovered = null; rest(); } return; }
    hovered = a.getAttribute('data-st');
    show(hovered, e.clientX, e.clientY);
  });
  svg.addEventListener('pointerleave', function () { hovered = null; rest(); });
  svg.addEventListener('focusin', function (e) {
    var a = e.target.closest('.usm__st'); if (!a) return;
    focused = a.getAttribute('data-st');
    if (!hovered) show(focused);
  });
  svg.addEventListener('focusout', function () { focused = null; if (!hovered) hide(); });

  // The chips point back at the map: hover or focus one and its state lights up.
  root.querySelectorAll('[data-st]').forEach(function (c) {
    if (c.closest('[data-usmap]')) return;
    var code = c.getAttribute('data-st');
    function on() { if (host.offsetParent !== null) show(code); }
    c.addEventListener('mouseenter', on); c.addEventListener('focus', on);
    c.addEventListener('mouseleave', rest); c.addEventListener('blur', rest);
  });
  window.addEventListener('resize', function () { if (focused) show(focused); else hide(); });
})();
