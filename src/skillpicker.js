/* ============================================================
   SKILL PICKER — one control, 186 options.
   ------------------------------------------------------------
   A flat cloud of checkboxes worked at sixteen skills. At 186 it
   stops being a choice and becomes a reading task, so this does
   three things instead:

     search   — type two letters and the list collapses to matches
     groups   — collapsed by default, so the page opens at 14 rows
                rather than 186 checkboxes
     chips    — what you picked stays visible at the top, removable,
                because the whole point is reviewing your own answer

   No hard cap. Kaitlin's list rewards honesty and a cap would make
   people drop real experience to stay under a number — but the
   counter nudges once someone is past fifteen.
   ============================================================ */
(function (w, d) {
  'use strict';

  function el(tag, cls, text) {
    var n = d.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  w.mountSkillPicker = function (host, picked, onChange) {
    host = typeof host === 'string' ? d.getElementById(host) : host;
    if (!host || !w.SKILLS) return;
    var open = {};

    function fire() { if (onChange) onChange(picked.slice()); }
    function has(s) { return picked.indexOf(s) > -1; }
    function toggle(s) {
      var i = picked.indexOf(s);
      if (i > -1) picked.splice(i, 1); else picked.push(s);
      fire(); render();
    }

    var search = el('input', 'sp__search');
    search.type = 'search';
    search.placeholder = 'Search ' + w.SKILLS.count + ' skills — try "braiding", "sales", "vet"';
    search.setAttribute('aria-label', 'Search skills');
    search.addEventListener('input', render);

    var chips  = el('div', 'sp__chips');
    var count  = el('p',   'sp__count');
    var body   = el('div', 'sp__body');

    function render() {
      var q = search.value.trim();
      var hits = w.SKILLS.search(q);

      // chips for what is already chosen
      chips.innerHTML = '';
      if (picked.length) {
        picked.forEach(function (s) {
          var b = el('button', 'sp__chip');
          b.type = 'button';
          b.innerHTML = '<span></span>' + s.replace(/&/g, '&amp;') + ' <i aria-hidden="true">&times;</i>';
          b.setAttribute('aria-label', 'Remove ' + s);
          b.addEventListener('click', function () { toggle(s); });
          chips.appendChild(b);
        });
      } else {
        chips.appendChild(el('p', 'sp__none', 'Nothing picked yet. Tick anything you have genuinely done.'));
      }

      count.textContent = picked.length === 0 ? ''
        : picked.length + (picked.length === 1 ? ' skill picked.' : ' skills picked.')
          + (picked.length > 15 ? ' That is a lot — the ones you want to be hired for matter more than the full list.' : '');

      // groups
      body.innerHTML = '';
      var names = hits.map(function (h) { return h.name; });
      Object.keys(w.SKILLS.groups).forEach(function (g) {
        var inGroup = w.SKILLS.groups[g].filter(function (s) { return names.indexOf(s) > -1; });
        if (!inGroup.length) return;
        var mine = w.SKILLS.groups[g].filter(has).length;
        var isOpen = q ? true : (open[g] || mine > 0);

        var head = el('button', 'sp__gh');
        head.type = 'button';
        head.setAttribute('aria-expanded', String(isOpen));
        head.innerHTML = '<span class="sp__gn">' + g + '</span>'
          + '<span class="sp__gm">' + (mine ? mine + ' of ' : '') + inGroup.length + '</span>'
          + '<span class="sp__gc" aria-hidden="true">' + (isOpen ? '&minus;' : '+') + '</span>';
        head.addEventListener('click', function () { open[g] = !isOpen; render(); });

        var wrap = el('div', 'sp__g');
        wrap.appendChild(head);

        if (isOpen) {
          var list = el('div', 'sp__list');
          inGroup.forEach(function (s) {
            var lab = el('label', 'sp__opt' + (has(s) ? ' is-on' : ''));
            var cb = d.createElement('input');
            cb.type = 'checkbox';
            cb.checked = has(s);
            cb.addEventListener('change', function () { toggle(s); });
            lab.appendChild(cb);
            lab.appendChild(el('span', null, s));
            list.appendChild(lab);
          });
          wrap.appendChild(list);
        }
        body.appendChild(wrap);
      });

      if (!hits.length) {
        body.appendChild(el('p', 'sp__none', 'Nothing matches “' + q + '”. Try a shorter word.'));
      }
    }

    host.classList.add('sp');
    host.appendChild(chips);
    host.appendChild(count);
    host.appendChild(search);
    host.appendChild(body);
    render();
    return { render: render, picked: picked };
  };
})(window, document);
