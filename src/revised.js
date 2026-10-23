/* ============================================================
   REVISION MARKER — a review aid, not part of the product.
   ------------------------------------------------------------
   Carrington asked to be able to see at a glance which screens
   changed in a round and what changed on them, without reading a
   changelog in another window. A page opts in with:

       <script src="src/revised.js"></script>
       <script>REVISED('23 Oct', ['what changed', 'and this']);</script>

   Delete the two lines from each page (and this file) before launch.
   Everything it renders is namespaced .rv- so it cannot collide with
   the site's own styles — the .doors/.door incident on 22 Oct is why.
   ============================================================ */
(function (w, d) {
  'use strict';
  var CSS = ''
  + '.rv-pill{position:fixed;left:18px;bottom:18px;z-index:9000;display:inline-flex;align-items:center;'
  + 'gap:8px;background:#B5731A;color:#fff;border:0;border-radius:99px;padding:11px 17px;cursor:pointer;'
  + "font:700 13px/1 'Lato',system-ui,sans-serif;letter-spacing:.02em;box-shadow:0 6px 20px rgba(11,37,69,.3)}"
  + '.rv-pill:hover{background:#9C6315}'
  + '.rv-pill:focus-visible{outline:3px solid #BDE3FF;outline-offset:2px}'
  + '.rv-dot{width:7px;height:7px;border-radius:50%;background:#FFF2E0}'
  + '.rv-panel{position:fixed;left:18px;bottom:72px;z-index:9001;width:min(380px,calc(100vw - 36px));'
  + 'background:#fff;border:2px solid #B5731A;border-radius:14px;padding:20px 22px;'
  + 'box-shadow:0 14px 44px rgba(11,37,69,.28);color:#16202C;'
  + "font:400 14.5px/1.55 'Lato',system-ui,sans-serif}"
  + '.rv-panel h4{margin:0 0 4px;font:900 15px/1.2 inherit;color:#0B2545}'
  + '.rv-panel .rv-when{display:block;font:600 11.5px/1 ui-monospace,Menlo,monospace;color:#8C7A68;'
  + 'letter-spacing:.06em;text-transform:uppercase;margin-bottom:13px}'
  + '.rv-panel ul{margin:0;padding:0;list-style:none}'
  + '.rv-panel li{padding:9px 0;border-top:1px solid #E6DCCB}'
  + '.rv-panel li:first-child{border-top:0;padding-top:0}'
  + '.rv-close{margin-top:14px;width:100%;background:#0B2545;color:#fff;border:0;border-radius:8px;'
  + "padding:10px;cursor:pointer;font:700 13px/1 'Lato',system-ui,sans-serif}"
  + '@media print{.rv-pill,.rv-panel{display:none!important}}';

  w.REVISED = function (when, items) {
    if (!items || !items.length) return;
    var st = d.createElement('style'); st.textContent = CSS; d.head.appendChild(st);

    var pill = d.createElement('button');
    pill.type = 'button';
    pill.className = 'rv-pill';
    pill.setAttribute('aria-expanded', 'false');
    pill.innerHTML = '<span class="rv-dot"></span>Revised ' + when
                   + ' &middot; ' + items.length + (items.length === 1 ? ' change' : ' changes');

    var panel = d.createElement('div');
    panel.className = 'rv-panel';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'What changed on this screen');

    var h = d.createElement('h4'); h.textContent = 'What changed on this screen';
    var wn = d.createElement('span'); wn.className = 'rv-when'; wn.textContent = when + ' design round';
    var ul = d.createElement('ul');
    items.forEach(function (t) { var li = d.createElement('li'); li.textContent = t; ul.appendChild(li); });
    var close = d.createElement('button');
    close.type = 'button'; close.className = 'rv-close'; close.textContent = 'Close';

    panel.appendChild(h); panel.appendChild(wn); panel.appendChild(ul); panel.appendChild(close);

    function toggle(open) {
      panel.hidden = !open;
      pill.setAttribute('aria-expanded', String(open));
      if (open) close.focus();
    }
    pill.addEventListener('click', function () { toggle(panel.hidden); });
    close.addEventListener('click', function () { toggle(false); pill.focus(); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { toggle(false); pill.focus(); } });

    function mount() { d.body.appendChild(pill); d.body.appendChild(panel); }
    if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', mount); else mount();
  };
})(window, document);
