/* ============================================================
   Chat — Design drawer (prototype only)
   ------------------------------------------------------------
   A small panel beside the live chat for trying looks and settings
   without touching code: colour theme, launcher shape and label, which
   side it sits on, panel size, the assistant's name and greeting, typing
   speed, the avatar, and an optional "nudge" bubble (the Phase 2
   proactive opener). Choices are remembered in this browser only, so a
   reviewer can set something up, click around the site, and it stays.

   Opened from "Design" in the chat's prototype bar, or ?chattweaks=1.
   None of this ships; it's for deciding what should.
   ============================================================ */
(function (w, d) {
  'use strict';
  var C = w.ESChat; if (!C || w.__esTweaks) return; w.__esTweaks = true;
  var KEY = 'equistaff.chat.tweaks.v2'; // v2: Evie became the default (29 Oct)
  var DEF = {
    theme: 'navy', shape: 'pill', label: 'Ask EquiStaff', side: 'right', size: 'standard',
    name: 'Evie at EquiStaff', tagline: 'An AI assistant, not a person',
    greeting: 'Hi! I’m Evie at EquiStaff. What brings you here today?',
    avatar: 'evie', speed: 'normal', marks: 'show', human: 'top', nudge: 'off'
  };
  function load() { try { return Object.assign({}, DEF, JSON.parse(w.localStorage.getItem(KEY) || '{}')); } catch (e) { return Object.assign({}, DEF); } }
  function save(t) { try { w.localStorage.setItem(KEY, JSON.stringify(t)); } catch (e) {} }
  var t = load();

  var CHOICES = [
    ['theme', 'Colour', [['navy', 'Navy'], ['light', 'Light'], ['sand', 'Sand']]],
    ['shape', 'Launcher', [['pill', 'Pill + label'], ['round', 'Round icon']]],
    ['side', 'Side', [['right', 'Right'], ['left', 'Left']]],
    ['size', 'Panel size', [['compact', 'Compact'], ['standard', 'Standard'], ['tall', 'Tall']]],
    ['avatar', 'Avatar', [['evie', 'Evie'], ['logo', 'Logo'], ['horseshoe', 'Horseshoe'], ['kaitlin', 'Kaitlin']]],
    ['human', '“Talk to a person”', [['top', 'Banner'], ['icon', 'Icon only']]],
    ['speed', 'Typing', [['off', 'Instant'], ['normal', 'Normal'], ['slow', 'Slow']]],
    ['marks', 'Reviewer tags', [['show', 'Show'], ['hide', 'Hide']]],
    ['nudge', 'Nudge bubble', [['off', 'Off'], ['on', 'After 4s']]]
  ];
  var TEXTS = [
    ['label', 'Launcher label', ['Ask EquiStaff', 'Ask Evie', 'Chat with Evie', 'Questions? Ask us']],
    ['name', 'Assistant name', ['Evie at EquiStaff', 'Evie', 'EquiStaff Assistant']],
    ['tagline', 'Line under the name', ['An AI assistant, not a person', 'Answers in seconds · Kaitlin’s team behind it']],
    ['greeting', 'First message', ['Hi! I’m Evie at EquiStaff. What brings you here today?', 'Hi, I’m Evie! Are you hiring, or looking for your next job?', 'Hi! Welcome to EquiStaff. What brings you here today?']]
  ];
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- the drawer ---------- */
  var box = d.createElement('aside');
  box.className = 'chatTweaks'; box.hidden = true;
  box.setAttribute('aria-label', 'Chat design settings');
  box.innerHTML =
    '<div class="chatTweaks__hd"><b>Design the chat</b><span>Prototype only · saved in this browser</span>' +
      '<button type="button" class="chatTweaks__x" aria-label="Close design settings">&times;</button></div>' +
    '<div class="chatTweaks__bd">' +
      CHOICES.map(function (c) {
        return '<fieldset><legend>' + c[1] + '</legend><div class="seg">' + c[2].map(function (o) {
          return '<button type="button" data-k="' + c[0] + '" data-v="' + o[0] + '">' + o[1] + '</button>';
        }).join('') + '</div></fieldset>';
      }).join('') +
      TEXTS.map(function (x) {
        var id = 'tw_' + x[0];
        return '<div class="tw"><label for="' + id + '">' + x[1] + '</label><input id="' + id + '" data-t="' + x[0] + '" list="' + id + '_l">' +
          '<datalist id="' + id + '_l">' + x[2].map(function (v) { return '<option value="' + esc(v) + '">'; }).join('') + '</datalist></div>';
      }).join('') +
    '</div>' +
    '<div class="chatTweaks__ft"><button type="button" data-restart>Restart chat</button><button type="button" data-defaults>Reset to defaults</button></div>';
  d.body.appendChild(box);

  /* ---------- apply ---------- */
  var root = d.documentElement;
  function apply() {
    ['theme', 'shape', 'side', 'size', 'speed', 'marks', 'human'].forEach(function (k) {
      [].slice.call(root.classList).forEach(function (c) { if (c.indexOf('chat-' + k + '-') === 0) root.classList.remove(c); });
      root.classList.add('chat-' + k + '-' + t[k]);
    });
    var lab = C.launch.querySelector('.chatLaunch__label'); if (lab) lab.textContent = t.label;
    C.launch.setAttribute('aria-label', t.label);
    var nm = C.dock.querySelector('.chat__name'); if (nm) nm.textContent = t.name;
    var tg = C.dock.querySelector('.chat__who > div > span'); if (tg) tg.textContent = t.tagline;
    var mk = C.dock.querySelector('.chat__mark');
    if (mk) mk.innerHTML = t.avatar === 'evie' ? '<img src="img/evie.jpg" alt="" width="38" height="38">'
      : t.avatar === 'kaitlin' ? '<img src="img/kaitlin.jpg" alt="" width="38" height="38">'
      : t.avatar === 'horseshoe' ? '<svg class="chat__markHs" aria-hidden="true" focusable="false"><use href="#i-horseshoe"/></svg>'
      : '<img src="assets/logo-icon.svg" alt="" width="26" height="26">';
    box.querySelectorAll('[data-k]').forEach(function (b) { var on = t[b.dataset.k] === b.dataset.v; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
    box.querySelectorAll('[data-t]').forEach(function (i) { if (d.activeElement !== i) i.value = t[i.dataset.t]; });
    nudge();
  }

  box.addEventListener('click', function (e) {
    var b = e.target.closest('[data-k]');
    if (b) { t[b.dataset.k] = b.dataset.v; save(t); apply(); return; }
    if (e.target.closest('[data-restart]')) { C.restart(); return; }
    if (e.target.closest('[data-defaults]')) { t = Object.assign({}, DEF); save(t); apply(); C.restart(); return; }
    if (e.target.closest('.chatTweaks__x')) toggle(false);
  });
  box.addEventListener('input', function (e) {
    var i = e.target.closest('[data-t]'); if (!i) return;
    t[i.dataset.t] = i.value; save(t); apply();
  });
  // A new greeting only shows on a fresh conversation.
  box.addEventListener('change', function (e) { if (e.target.dataset && e.target.dataset.t === 'greeting') C.restart(); });

  /* ---------- open / close ---------- */
  var btn = C.dock.querySelector('.chat__design');
  function toggle(open) {
    box.hidden = !open;
    if (btn) { btn.setAttribute('aria-expanded', String(open)); btn.classList.toggle('is-on', open); }
    root.classList.toggle('chat-tweaking', open);
    if (open) { if (!C.isOpen()) C.open(); box.querySelector('button').focus(); }
    else if (btn) btn.focus();
  }
  if (btn) btn.addEventListener('click', function () { toggle(box.hidden); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) { e.stopImmediatePropagation(); toggle(false); } }, true);

  /* ---------- the nudge bubble (Phase 2 idea, here to judge the feel) ---------- */
  var bubble = null, timer = null;
  function nudge() {
    clearTimeout(timer);
    if (bubble) { bubble.remove(); bubble = null; }
    if (t.nudge !== 'on' || C.isOpen()) return;
    timer = setTimeout(function () {
      if (C.isOpen()) return;
      bubble = d.createElement('div'); bubble.className = 'chatNudge';
      bubble.innerHTML = '<div class="chatNudge__who"><img src="img/evie.jpg" alt=""><b>Evie at EquiStaff</b></div><p>Hiring, or looking for work? I can point you the right way.</p>' +
        '<div><button type="button" data-go>Ask a question</button><button type="button" data-no>Not now</button></div>';
      d.body.appendChild(bubble);
      bubble.addEventListener('click', function (e) {
        if (e.target.closest('[data-go]')) C.open();
        if (e.target.closest('[data-go],[data-no]')) { bubble.remove(); bubble = null; }
      });
    }, 4000);
  }
  C.launch.addEventListener('click', function () { if (bubble) { bubble.remove(); bubble = null; } clearTimeout(timer); });

  apply();
  if (new URLSearchParams(location.search).get('chattweaks')) toggle(true);
})(window, document);
