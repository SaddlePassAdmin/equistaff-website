/* ============================================================
   "Other", with somewhere to put it.
   ------------------------------------------------------------
   Kaitlin's taxonomies are long but not exhaustive — 186 skills and
   seven role types still strand a farrier or a carriage driver. An
   "Other" option that leads nowhere is worse than none: the person
   picks it, we learn nothing, and the filter quietly lies.

   Any <select data-other> gets a text box that appears only when
   Other is chosen, and is required once it is. Namespaced .of- so it
   cannot collide with the site's own classes.
   ============================================================ */
(function (w, d) {
  'use strict';
  var CSS = '.of__extra{margin-top:8px;display:none}'
          + '.of__extra.on{display:block}'
          + '.of__extra input{width:100%;padding:11px 14px;border-radius:var(--r-md);'
          + 'border:1.5px solid var(--border-subtle);background:var(--surface-raised);'
          + 'color:var(--text-primary);font:400 var(--t-small)/1.3 var(--font-body)}'
          + '.of__extra input:focus{outline:3px solid var(--baby-300);outline-offset:1px}';

  function wire(sel) {
    var box = d.createElement('div');
    box.className = 'of__extra';
    var input = d.createElement('input');
    input.type = 'text';
    input.placeholder = sel.getAttribute('data-other') || 'Tell us which';
    input.setAttribute('aria-label', input.placeholder);
    box.appendChild(input);
    sel.parentNode.insertBefore(box, sel.nextSibling);

    function sync() {
      var on = /^other\b/i.test(sel.value || '');
      box.classList.toggle('on', on);
      input.required = on;
      if (!on) input.value = '';
    }
    sel.addEventListener('change', sync);
    sync();
  }

  function init() {
    if (!d.querySelector('select[data-other]')) return;
    var st = d.createElement('style'); st.textContent = CSS; d.head.appendChild(st);
    Array.prototype.forEach.call(d.querySelectorAll('select[data-other]'), wire);
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init); else init();
})(window, document);
