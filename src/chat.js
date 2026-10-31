/* ============================================================
   ES — AI concierge, clickable prototype
   ------------------------------------------------------------
   A scripted walk-through of the chatbot engineering handoff
   (Claude Doc: "EquiStaff Chatbot: Engineering Handoff (V1)") and the
   client sign-off version. It is deliberately NOT an AI: every path is
   written in advance, which is the V1 decision ("an interactive FAQ"),
   and it means anyone can test it and get the same answer twice.

   - Turns the existing .chatLaunch link into a real chat panel, or adds a
     launcher on pages that don't have one.
   - Reads the page it is on: signed-in portal pages skip the opening
     question, the job page answers about that job, employer pages start on
     the employer path.
   - Writes the same records as the rest of the prototype (src/state.js):
     EmployerInquiry via ES.addInquiry, saved roles via ES.toggleSave.
   - Anything Kaitlin hasn't decided yet is marked "Kaitlin to confirm".

   Rule numbers (R1–R12) refer to the handoff's Hard rules table.

   31 Oct (Kaitlin's V3 notes): Evie is on every page again, portals
   included; job suggestions ask two qualifying questions first; "I need a
   job" can no longer land on the hiring path; cancelling offers a message or
   pro@equistaff.com instead of a call; no $1,000 up front; the team is "the
   EquiStaff Recruiting Team".

   29 Oct: brought forward from the parked PR #1 onto current main, with
   the copy updated to what changed since (prices, "since 1982", no
   confidential badge), plus a Design drawer (src/chat-tweaks.js) for
   trying looks and settings live.
   ============================================================ */
(function (w, d) {
  'use strict';
  if (w.__esChat) return; w.__esChat = true;

  var ES = w.ES || null;
  var LS = {
    get: function (k, f) { try { var v = w.localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch (e) { return f; } },
    set: function (k, v) { try { w.localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var K_PERSONA = 'equistaff.chat.persona', K_LOG = 'equistaff.chat.unanswered', K_HAND = 'equistaff.chat.handoffs', K_INTAKE = 'equistaff.chat.intake';
  // Review mode (?review=1, see revised.js): shows the prototype bar, the
  // "Kaitlin to confirm" tags and the rule tags. Off by default, so the chat
  // looks exactly like the product.
  var review = (function () {
    try {
      var q = new URLSearchParams(location.search).get('review');
      if (q === '1') localStorage.setItem('equistaff.review', '1');
      if (q === '0') localStorage.removeItem('equistaff.review');
      return localStorage.getItem('equistaff.review') === '1';
    } catch (e) { return false; }
  })();
  if (review) d.documentElement.classList.add('es-review');
  var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- where are we? ---------- */
  var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var deep = d.documentElement.getAttribute('data-mode') === 'deep';
  var EMPLOYER_PAGES = ['employer.html', 'my-jobs.html', 'post-job.html', 'applicants.html', 'candidate.html', 'company.html', 'billing.html', 'request-talent.html'];
  var pageRole = EMPLOYER_PAGES.indexOf(page) > -1 ? 'employer' : (deep ? 'seeker' : 'visitor');
  var onJob = page === 'job-detail.html';
  var qs = new URLSearchParams(location.search);
  var fromSocial = /instagram|facebook|social|tiktok/i.test((qs.get('utm_source') || '') + (qs.get('from') || '')) ||
                   /instagram|facebook|t\.co|tiktok/i.test(d.referrer || '');

  /* ---------- content (from Kaitlin's Oct 15 answers) ---------- */
  var JOBS = [
    { title: 'Barn Manager', family: 'Grooms & Barn Staff', org: '24-horse hunter/jumper barn', where: 'Ocala, FL', state: 'FL', pay: '$55,000 – $68,000', housing: 'On-site, 1 bed', horses: '24 · hunter/jumper', days: 'Two, rotating', start: 'Flexible, ideally November', discipline: 'Hunter / Jumper', type: 'Full time', managed: true, intl: 'Case by case', day: 'Running the daily schedule (turnout, feed, farrier, vet and training), leading a team of four, and keeping competition records. The horses compete most weekends through the winter season.' },
    { title: 'Show Manager', family: 'Show Facility Staff', org: 'International show jumping team', where: 'Wellington, FL', state: 'FL', pay: '$70,000 – $85,000', housing: 'Included', discipline: 'Show Jumping', type: 'Full time', managed: true },
    { title: 'Assistant Trainer', family: 'Riders, Trainers & Instructors', org: 'Bridlewood Farm', where: 'Wellington, FL', state: 'FL', pay: '$42,000 – $52,000', housing: null, horses: '18', discipline: 'Hunter / Jumper', type: 'Full time', managed: false },
    { title: 'Head Groom', family: 'Grooms & Barn Staff', org: 'Clearwater Sport Horses', where: 'Lexington, KY', state: 'KY', pay: '$38,000 – $46,000', housing: 'Available', discipline: 'Dressage', type: 'Full time', managed: false },
    { title: 'Facility Director', family: 'Executive', org: 'Eventing farm, 60+ horses', where: 'Middleburg, VA', state: 'VA', pay: '$78,000 – $92,000', housing: null, horses: '60+', discipline: 'Eventing', type: 'Full time', managed: true },
    { title: 'Working Student', family: 'Riders, Trainers & Instructors', org: 'Live Oak Stables', where: 'Ocala, FL', state: 'FL', pay: 'Stipend', housing: 'Housing and board included', discipline: 'Eventing', type: 'Seasonal', managed: false }
  ];
  var PRICES = [ // pricing.html, Kaitlin's list
    ['Job board · 1 month', '3 job posts · unlimited searches', '$50'],
    ['Job board · 1 month, featured', '3 job posts · featured bar', '$69.99'],
    ['Job board · 3 months', '3 job posts · unlimited searches', '$140'],
    ['Job board · 1 year', '5 job posts · unlimited searches', '$460']
  ];
  // 31 Oct: no money up front (Kaitlin doesn't always collect it), and the
  // percentage itself is never stated (R3).
  var DIRECT_HIRE = 'Direct hire is quoted per role, as a percentage of the first-year salary, due on your new hire’s first day.';
  // Kaitlin's role families (V3 notes). A seeker picks one before Evie
  // suggests anything, and the sample jobs are filtered by it.
  var FAMILIES = ['Grooms & Barn Staff', 'Riders, Trainers & Instructors', 'Sales, Customer Service & Marketing', 'Show Facility Staff', 'Veterinary Staff', 'Executive', 'Other'];
  var TEAM = 'the EquiStaff Recruiting Team';
  var PRO_EMAIL = 'pro@equistaff.com';
  var VISA = 'EquiStaff can’t sponsor visas. Whether an employer will consider international applicants is up to each employer, and it’s shown on the job post when they’ve told us.';
  var ROLES = ['Stall cleaner','Groom','Hotwalker','Barn manager','Flat rider','Exercise rider','Pony rider','Outrider','Assistant trainer','Trainer','Night watch','Foreman','General manager','Property manager','Maintenance manager','Bloodstock agent','Breeding manager','Loper','Assistant manager','Instructor','Equestrian director','Vet assistant','Vet technician','Veterinarian','Admin assistant','Practice manager','Customer service','Inside sales','Outside sales','Account manager','Show secretary','Course designer','Farrier','Massage therapist','Rehab specialist','PATH instructor','Office manager','Estate manager','Working student','Facility director','Head groom'];
  var DISCIPLINES = ['Hunter / Jumper','Dressage','Eventing','Show Jumping','Reining','Barrel Racing','Polo','Thoroughbred Industry','Quarter Horse Racing','Western Pleasure','Cutting','Breeding','Equine Assisted Therapy','Veterinary Medicine','Feed & Nutrition Sales','Pharmaceutical Sales','Marketing','Office / Admin','Private Country Club','Summer Camps'];

  /* ---------- styles + DOM ---------- */
  if (!d.querySelector('link[href$="chat.css"]')) {
    var l = d.createElement('link'); l.rel = 'stylesheet'; l.href = 'src/chat.css'; d.head.appendChild(l);
  }
  /* 31 Oct — Evie is on every page again, signed-in portals included
     (Kaitlin, V3 notes; reverses the 30 Oct public-only rule from PR #31).
     On portal pages the launcher goes compact (icon only, see chat.css
     .chat-portal) so it takes up as little of the working screen as
     possible. The dismiss control still works everywhere. */
  var IS_PORTAL = d.body.classList.contains('portal');
  if (IS_PORTAL) d.body.classList.add('chat-portal');
  var HIDE_KEY  = 'equistaff.evie.hidden';
  function dismissed() {
    try { return localStorage.getItem(HIDE_KEY) === '1'; } catch (e) { return false; }
  }

  var launch = d.querySelector('.chatLaunch:not([data-specimen])'); // the spec page shows a static specimen
  if (dismissed()) {
    if (launch && launch.parentNode) launch.parentNode.removeChild(launch);
    d.body.classList.remove('has-chat');
    return;                      // nothing else on this page needs the widget
  }
  if (!launch) {
    launch = d.createElement('button');
    launch.className = 'chatLaunch';
    launch.innerHTML = '<svg class="chatLaunch__hs" aria-hidden="true" focusable="false"><use href="#i-horseshoe"/></svg> <span class="chatLaunch__label">Ask Evie</span>';
  }

  /* The launcher is an <a>/<button>, so the dismiss control cannot nest inside
     it — invalid, and a click would hit both. It sits beside it in a dock. */
  var dock = d.createElement('div');
  dock.className = 'evieDock';          // NOT chatDock — that is the chat panel
  if (launch.parentNode) launch.parentNode.removeChild(launch);
  dock.appendChild(launch);

  var x = d.createElement('button');
  x.type = 'button';
  x.className = 'evieDock__x';
  x.setAttribute('aria-label', 'Hide the assistant');
  x.title = 'Hide the assistant';
  x.innerHTML = '&times;';
  x.addEventListener('click', function (ev) {
    ev.preventDefault(); ev.stopPropagation();
    try { localStorage.setItem(HIDE_KEY, '1'); } catch (e) {}
    [].slice.call(d.querySelectorAll('.evieDock')).forEach(function (n) { n.remove(); });
    var stray = d.querySelector('.chatLaunch:not([data-specimen])');
    if (stray && stray.parentNode) stray.parentNode.removeChild(stray);
    d.body.classList.remove('has-chat');
  });
  dock.appendChild(x);

  d.body.appendChild(dock);
  d.body.classList.add('has-chat');
  /* 31 Oct: on a phone the fixed launcher passes over full-width form fields
     (post-job, profile). While someone is typing in a page field it tucks
     away (chat.css, max-width 620px) and comes back when they leave it. */
  d.addEventListener('focusin', function (e) {
    var t = e.target;
    if (t && t.matches && t.matches('input, textarea, select') && !t.closest('.chatDock, .evieDock')) d.body.classList.add('evie-tucked');
  });
  d.addEventListener('focusout', function () { d.body.classList.remove('evie-tucked'); });
  if (!d.getElementById('es-sprite') && !d.querySelector('script[src$="icons.js"]')) {
    var ic = d.createElement('script'); ic.src = 'src/icons.js'; d.body.appendChild(ic);
  }
  // Wrap the text so the Design drawer can relabel it.
  if (!launch.querySelector('.chatLaunch__label')) {
    [].slice.call(launch.childNodes).forEach(function (n) {
      if (n.nodeType === 3 && n.textContent.trim()) { var sp = d.createElement('span'); sp.className = 'chatLaunch__label'; sp.textContent = n.textContent.trim(); launch.replaceChild(sp, n); }
    });
  }
  launch.setAttribute('role', 'button');
  if (!launch.getAttribute('aria-label')) launch.setAttribute('aria-label', 'Ask Evie, the EquiStaff assistant');
  launch.setAttribute('aria-haspopup', 'dialog');
  launch.setAttribute('aria-expanded', 'false');

  var dock = d.createElement('div');
  dock.className = 'chatDock';
  dock.hidden = true;
  dock.innerHTML =
    '<section class="chat chat--live" role="dialog" aria-modal="false" aria-labelledby="esChatTitle">' +
      '<header class="chat__hdr">' +
        '<div class="chat__who">' +
          '<span class="chat__mark" aria-hidden="true"><img src="img/evie.jpg" alt="" width="38" height="38"></span>' +
          '<div><b id="esChatTitle" class="chat__name">Evie at EquiStaff</b><span>An AI assistant, not a person</span></div>' +
          '<button class="chat__x" type="button" aria-label="Close chat">&times;</button>' +
        '</div>' +
        '<button class="chat__human" type="button"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg> Talk to a person · EquiStaff Recruiting Team</button>' +
      '</header>' +
      '<div class="chat__body" aria-live="polite"></div>' +
      '<form class="chat__foot">' +
        '<label class="sr" for="esChatIn">Message</label>' +
        '<input id="esChatIn" autocomplete="off" placeholder="Type a message…">' +
        '<button class="chat__send" type="submit" aria-label="Send"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>' +
      '</form>' +
      '<div class="chat__demo"><span>Try as</span>' +
        '<button type="button" data-p="visitor">Visitor</button>' +
        '<button type="button" data-p="seeker">Job seeker</button>' +
        '<button type="button" data-p="employer">Employer</button>' +
        '<button type="button" data-reset>Restart</button>' +
        '<button type="button" class="chat__design" aria-expanded="false">Design</button>' +
        '<p class="chat__demoNote">Prototype · name and voice: <em class="tbc">Kaitlin to confirm</em></p>' +
      '</div>' +
    '</section>';
  d.body.appendChild(dock);

  var body = dock.querySelector('.chat__body');
  var input = dock.querySelector('#esChatIn');
  // On portal pages the page decides (an employer page is always the employer);
  // a saved "Try as" choice only applies on public pages. Fixes testers who
  // tried "Visitor" once and then got the visitor greeting inside a portal.
  var persona = pageRole !== 'visitor' ? pageRole : (LS.get(K_PERSONA, null) || pageRole);
  var misses = 0, started = false, path = null;
  var waiting = null; // a function that consumes the next free-text answer

  /* Design drawer settings (src/chat-tweaks.js writes them). */
  function tweak(k) { var t = LS.get('equistaff.chat.tweaks.v2', {}) || {}; return t[k]; }
  function speed() { var v = tweak('speed'); return v === 'off' ? 0 : v === 'slow' ? 1100 : 420; }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function scroll() { requestAnimationFrame(function () { body.scrollTop = body.scrollHeight; }); }
  function tbc(t) { return '<em class="tbc">' + esc(t || 'Kaitlin to confirm') + '</em>'; }

  function me(text) {
    var m = d.createElement('div'); m.className = 'msg msg--me'; m.textContent = text;
    body.appendChild(m); scroll();
  }
  var queue = Promise.resolve();
  function bot(html, chips) {
    queue = queue.then(function () {
      return new Promise(function (res) {
        var t = d.createElement('div'); t.className = 'msg msg--bot msg--typing'; t.innerHTML = '<span></span><span></span><span></span>';
        body.appendChild(t); scroll();
        setTimeout(function () {
          t.className = 'msg msg--bot'; t.innerHTML = html;
          if (chips && chips.length) {
            var row = d.createElement('div'); row.className = 'chips2';
            chips.forEach(function (c) {
              var b = d.createElement('button'); b.type = 'button'; b.textContent = c[0];
              b.addEventListener('click', function () {
                if (row.dataset.used) return; row.dataset.used = '1';
                row.querySelectorAll('button').forEach(function (x) { x.disabled = true; if (x === b) x.classList.add('is-picked'); });
                me(c[0]); waiting = null; c[1]();
              });
              row.appendChild(b);
            });
            body.appendChild(row);
          }
          scroll(); res();
        }, reduce ? 0 : speed());
      });
    });
    return queue;
  }
  function card(html) {
    queue = queue.then(function () { var c = d.createElement('div'); c.innerHTML = html; body.appendChild(c.firstChild); scroll(); });
    return queue;
  }
  function ask(html, chips, onText) { waiting = onText || null; return bot(html, chips); }

  /* ---------- free text: match to the fixed intent list (R11) ---------- */
  /* Order matters: first match wins. 31 Oct — "I need a job" used to hit the
     hiring rule (its "need a" caught it), and "not hiring" contains "hiring".
     Explicit job-seeker phrases now run before anything about hiring, the
     hiring rule ignores "not hiring", and "call" / "account" only fire on
     phrases that mean it, so "account manager jobs" is a job search. */
  var SEEKER_RX = /\b(i'?m not hiring|i am not hiring|not hiring|no,? i need|(i )?need (a |some )?(job|work)|looking for (a |some )?(job|jobs|work|position)|find (me )?(a )?(job|work)|job ?seeker|looking for work|want (a )?job)\b/i;
  var INTENTS = [
    [/\b(are you|is this) (a )?(real|human|person|bot|ai|robot)\b/i, function () { bot('I’m Evie, EquiStaff’s AI assistant. I’m not a person, but ' + TEAM + ' is one tap away whenever you want them.', [['Talk to a person', function () { handoff('asked'); }], ['Keep going', hello]]); }],
    [/\b(call me|phone call|(talk|speak) (to|with) (a |an |the )?(real )?(person|human|someone|somebody|kaitlin|team|recruiter)|call (someone|somebody|a person|you|kaitlin|the team)|speak to|a real person|representative)\b/i, function () { handoff('asked'); }],
    [SEEKER_RX, seeker],
    [/\b(visa|sponsor|international|work permit|authori[sz]ation)\b/i, visa],
    [/\b(how long|timeline|when will i|guarantee)\b.*\b(place|hire|job|placement)\b|\bplacement\b.*\b(how long|time)\b/i, function () { refuse('I can’t promise a placement or a timeline for one. Every search is different, so the recruiting team is the right one to ask.', 'R2'); }],
    [/\b(my search|search cost|what would .* cost|fee for|recruiting fee|percentage|commission)\b/i, function () { refuse('Recruiting fees depend on the role, so I don’t quote them. Here’s how direct hire works:<p>' + DIRECT_HIRE + '</p>The exact figure comes from the recruiting team.', 'R3'); }],
    [/\b(price|pricing|cost|how much|plans?|subscription)\b/i, function () { pricing(); }],
    [/\b(cancel|unsubscribe|refund|billing)\b/i, cancel],
    [/\b(my account|log ?in|sign ?in|password|locked out|account (trouble|help|locked|issue|problem))\b/i, account],
    [/\b(rejected|why didn.?t|turned down)\b/i, function () { refuse('I can’t see or explain decisions on applications. The recruiting team can talk it through with you.', 'Hand-off'); }],
    [/\b(how many|open jobs|numbers|stats|job ?seekers)\b/i, liveNumbers],
    [/(?<!not )(?<!n.t )\b(hiring|hire|recruit|need (someone|somebody|staff|help in the barn)|need (a|an) (groom|manager|barn manager|rider|trainer|instructor|vet tech|assistant)|looking for (a|an) (groom|manager|rider|trainer|instructor))\b/i, employer],
    [/\b(job|jobs|work|position|role|career|resume)\b/i, seeker],
    [/\b(about|who are you|equistaff|how does it work|process)\b/i, about]
  ];
  // A correction mid-way through the hiring path ("no", "I need a job",
  // "I'm not hiring") switches to the job-seeker path instead of being
  // captured as an answer.
  function correctsEmployer(t) { return path === 'employer' && (SEEKER_RX.test(t) || /^\s*(no|nope|nah)[\s.!,]*$/i.test(t)); }
  function freeText(t) {
    if (correctsEmployer(t)) {
      if (waiting) me(t);
      waiting = null; misses = 0; path = null;
      return bot('Sorry about that, let’s find you a job instead.').then(function () { seeker(); });
    }
    if (waiting) { var f = waiting; waiting = null; return f(t); }
    for (var i = 0; i < INTENTS.length; i++) if (INTENTS[i][0].test(t)) { misses = 0; return INTENTS[i][1](); }
    misses++;
    var log = LS.get(K_LOG, []); log.unshift({ text: t, page: page, at: Date.now() }); LS.set(K_LOG, log.slice(0, 50));
    if (misses >= 2) return bot('I still can’t tell, and I don’t want to guess. Let me put you with a person.').then(function () { handoff('no_match'); });
    bot('I didn’t quite catch that. Which of these is closest?', mainChips());
  }

  /* ---------- the hand-off (R11: never guess) ---------- */
  /* 31 Oct: calls are an hour and booked by email after the team has read
     the note, so the card asks for a call rather than opening a calendar. */
  function handoff(reason, audience) {
    audience = audience || path || (persona === 'employer' ? 'employer' : persona === 'seeker' ? 'seeker' : null);
    if (!audience) {
      return ask('Happy to connect you with ' + TEAM + '. So I send this to the right people: are you hiring, or looking for work?',
        [['I’m hiring', function () { handoff(reason, 'employer'); }], ['Looking for work', function () { handoff(reason, 'seeker'); }]]);
    }
    card('<div class="handoff"><div class="handoff__top"><img src="img/kaitlin.jpg" alt=""><div><b>EquiStaff Recruiting Team</b><span>Placing equine professionals since 1982</span></div></div>' +
      '<p class="handoff__note">Tell me a little about what you need and the team will email you to book a call. Your conversation goes with you, so you won’t have to repeat yourself.</p></div>');
    bot('Want me to pass this to the team?', [['Request a call', function () { leaveMessage(audience, reason, true); }], ['Leave a message', function () { leaveMessage(audience, reason); }], ['Back to the start', hello]]);
  }
  function leaveMessage(audience, reason, wantsCall) {
    var h = { audience: audience, reason: reason, page: page, call: !!wantsCall };
    ask('What’s your name?', null, function (t) { me(t); h.name = t;
      ask('And the best email to reach you?', null, function (t2) { me(t2); h.email = t2;
        ask('What would you like the team to know?', null, function (t3) { me(t3); h.question = t3; h.at = Date.now();
          var all = LS.get(K_HAND, []); all.unshift(h); LS.set(K_HAND, all);
          if (ES) ES.notify('Message sent to the recruiting team');
          bot(wantsCall
            ? 'Sent. The team will read it and email <b>' + esc(h.email) + '</b> to book a call.'
            : 'Sent. The team will reply to <b>' + esc(h.email) + '</b>.', [['Back to the start', hello]]);
        });
      });
    });
  }
  function refuse(html, rule) {
    bot(html + ' <span class="ruleTag">' + esc(rule) + '</span>', [['Talk to the team', function () { handoff('rule'); }], ['Something else', hello]]);
  }

  /* ---------- entry ---------- */
  function mainChips() {
    return [['Looking for work', seeker], ['I’m hiring', employer], ['I just have a question', questions], ['Something else', somethingElse]];
  }
  function hello() {
    misses = 0; path = null;
    if (persona === 'seeker') {
      var p = ES ? ES.profile() : { name: 'Dana Whitfield' };
      return bot('Welcome back, ' + esc(p.name.split(' ')[0]) + '! Is there anything I can help you with today?', seekerNeeds());
    }
    if (persona === 'employer') return bot('Welcome back! Is there anything I can help you with today?', employerNeeds()); // Kaitlin's wording, 26 Oct
    if (fromSocial && !hello.socialAsked) {
      hello.socialAsked = true;
      return bot('Hi! Are you looking for a job you saw on social media? ' + tbc('opener: Kaitlin’s idea, to confirm'),
        [['Yes', pickJob], ['No', function () { fromSocial = false; hello(); }]]);
    }
    if (onJob && !hello.jobAsked) {
      hello.jobAsked = true;
      return bot('Hi! I’m Evie, EquiStaff’s assistant. Want to ask about this <b>Barn Manager</b> role?',
        [['Ask about this job', function () { jobQuestions(JOBS[0]); }], ['Something else', function () { hello(); }]]);
    }
    bot(esc(tweak('greeting') || 'Hi! I’m Evie at EquiStaff. What brings you here today?'), mainChips());
  }
  function somethingElse() { bot('Sure, tell me in your own words.'); input.focus(); }

  /* ---------- job seeker ---------- */
  function seekerNeeds() {
    return [['Find me a job', findJob], ['Help with my profile', profileHelp], ['Question about a job', pickJob], ['Account help', account]];
  }
  function seeker() {
    path = 'seeker';
    var have = LS.get(K_INTAKE, null);
    if (have || pageRole === 'seeker') return bot('What do you need?', seekerNeeds());
    bot('Great. A few quick questions so I can match you, one at a time. You can skip any of them.',
      [['Let’s go', intake], ['Skip, show me jobs', findJob]]);
  }
  function intake() {
    var r = {};
    var steps = [
      function (n) { ask('What kind of role are you after?', chipsFrom(FAMILIES, function (v) { r.family = v; n(); }),
        function (t) { me(t); r.role = t; r.family = familyOf(t); n(); }).then(function () { hint('Or type any role, from stall cleaner to vet tech.'); }); },
      function (n) { ask('Which discipline or industry?', chipsFrom(['Hunter / Jumper', 'Dressage', 'Eventing', 'Western', 'Racing'], function (v) { r.discipline = v; n(); }).concat([['Skip', n]]), function (t) { me(t); r.discipline = t; n(); }); },
      function (n) { ask('Where are you based? Type your city or state.', [['Skip', n]], function (t) { me(t); r.location = t; n(); }); },
      function (n) { ask('Would you relocate?', chipsFrom(['Yes', 'No', 'Maybe'], function (v) { r.relocate = v; n(); })); },
      function (n) { ask('Are you looking for remote work?', chipsFrom(['Yes', 'No', 'Open to either'], function (v) { r.remote = v; n(); })); },
      function (n) { ask('What’s your experience level?', chipsFrom(['Beginner', 'Intermediate', 'Advanced', 'FEI / World-Class'], function (v) { r.level = v; n(); }).concat([['Skip', n]])); },
      function (n) { ask('Do you need housing?', [['Yes', function () { r.housing = 'Yes'; ask('Will anyone else, people or pets, need housing too?', chipsFrom(['Just me', 'Pets', 'People', 'Both'], function (v) { r.housing_for_others = v; n(); })); }], ['No', function () { r.housing = 'No'; n(); }], ['Skip', n]]); },
      function (n) { ask('What pay range are you looking for?', chipsFrom(['Under $40k', '$40k – $60k', '$60k – $90k', '$90k+'], function (v) { r.pay = v; n(); }).concat([['Skip', n]])); },
      function (n) { ask('When could you start?', chipsFrom(['Now', 'Within 2 weeks', 'Within a month', 'Later'], function (v) { r.start = v; n(); })); },
      function (n) { ask('What kind of work?', chipsFrom(['Full-time', 'Part-time', 'Seasonal', 'Freelance or event', 'Contract or remote'], function (v) { r.work_type = v; n(); }).concat([['Skip', n]])); }
    ];
    var i = 0;
    (function next() {
      if (i < steps.length) return steps[i++](next);
      LS.set(K_INTAKE, r);
      if (ES && r.location) ES.setProfile({ intake: r });
      bot('Thanks, that’s everything. What would you like to do?', seekerNeeds());
    })();
  }
  function chipsFrom(list, fn) { return list.map(function (v) { return [v, function () { fn(v); }]; }); }
  function hint(t) { queue = queue.then(function () { var h = d.createElement('p'); h.className = 'chat__hint'; h.textContent = t; body.appendChild(h); scroll(); }); }

  /* 31 Oct (Kaitlin: "what information does it use to recommend positions?")
     Evie asks at least two things before suggesting anything: the role family
     and where they want to work (or whether they'd move). The sample jobs are
     filtered by both, and nothing is called a match unless it is one. */
  function familyOf(t) {
    t = String(t || '').toLowerCase();
    if (/groom|barn|stall|hotwalk|night watch|foreman|maintenance|loper|working student/.test(t)) return 'Grooms & Barn Staff';
    if (/rider|trainer|instructor|coach|jockey|pony|outrider|equestrian director|path/.test(t)) return 'Riders, Trainers & Instructors';
    if (/sales|customer|marketing|account manager|admin|office/.test(t)) return 'Sales, Customer Service & Marketing';
    if (/show|course designer|secretary|facility/.test(t)) return 'Show Facility Staff';
    if (/vet|rehab|massage|farrier|practice/.test(t)) return 'Veterinary Staff';
    if (/director|general manager|executive|ceo|president|head of/.test(t)) return 'Executive';
    return 'Other';
  }
  var STATES = { fl: 'florida', ky: 'kentucky', va: 'virginia', tx: 'texas', ca: 'california', ny: 'new york', nc: 'north carolina', sc: 'south carolina', ga: 'georgia', md: 'maryland', pa: 'pennsylvania', nj: 'new jersey', tn: 'tennessee', ok: 'oklahoma', co: 'colorado', az: 'arizona' };
  function inPlace(j, loc) {
    loc = String(loc || '').toLowerCase();
    if (!loc) return false;
    var st = j.state.toLowerCase(), city = j.where.split(',')[0].toLowerCase();
    return loc.indexOf(city) > -1 || new RegExp('\\b' + st + '\\b').test(loc) || (STATES[st] && loc.indexOf(STATES[st]) > -1);
  }
  function findJob() {
    var r = LS.get(K_INTAKE, {}) || {};
    function save() { LS.set(K_INTAKE, r); }
    if (!r.family) {
      return ask('Quick question first, so I only show you jobs that fit. What kind of role are you after?',
        chipsFrom(FAMILIES, function (v) { r.family = v; save(); findJob(); }),
        function (t) { me(t); r.role = t; r.family = familyOf(t); save(); findJob(); });
    }
    if (!r.location && r.relocate !== 'Yes' && r.relocate !== 'Maybe') {
      return ask('And where do you want to work? Type a city or state, or tell me if you’d move for the right job.',
        [['Anywhere, I’d relocate', function () { r.relocate = 'Yes'; r.location = ''; save(); findJob(); }]],
        function (t) { me(t); r.location = t; save();
          if (r.relocate) return showJobs(r);
          ask('Would you relocate for the right job?', chipsFrom(['Yes', 'No'], function (v) { r.relocate = v; save(); showJobs(r); }));
        });
    }
    showJobs(r);
  }
  function showJobs(r) {
    var anywhere = r.relocate === 'Yes' || r.relocate === 'Maybe';
    var fits = JOBS.filter(function (j) {
      if (r.family && r.family !== j.family) return false;
      if (r.location && !anywhere && !inPlace(j, r.location)) return false;
      if (!r.location && !anywhere) return false;
      return true;
    }).map(function (j) {
      var s = 0;
      if (inPlace(j, r.location)) s += 3;
      if (r.housing === 'Yes' && j.housing) s += 2;
      if (r.discipline && j.discipline.toLowerCase().indexOf(String(r.discipline).toLowerCase().split(/[ /]/)[0]) > -1) s += 2;
      if (r.work_type && j.type.toLowerCase().indexOf(r.work_type.toLowerCase().split(/[- ]/)[0]) > -1) s += 1;
      return { j: j, s: s };
    }).sort(function (a, b) { return b.s - a.s; });
    var where = r.location ? 'in ' + esc(r.location) + (anywhere ? ' or further afield' : '') : 'anywhere';
    var what = r.family === 'Other' ? 'your kind of role' : '<b>' + esc(r.family) + '</b>';
    var next = [['Help with my profile', profileHelp], ['Change my answers', function () { LS.set(K_INTAKE, null); findJob(); }], ['Back to the start', hello]];
    if (!fits.length) {
      return bot('I don’t have an open role right now that fits ' + what + ' ' + where + '. The job board has every live posting, and a free profile means the recruiting team can find you when one comes in.',
        [['Browse the job board', function () { location.href = 'jobs.html'; }]].concat(next));
    }
    var top = fits.slice(0, 2); // never a shortlist: at most 2 (handoff JS-1)
    bot((top.length === 1 ? 'One open role fits ' : 'These ' + top.length + ' open roles fit ') + what + ' ' + where + '.');
    top.forEach(function (x) { card(jobCard(x.j)); });
    bot('Complete profiles are seen first by the recruiting team, so finishing yours helps.', [['Question about one of these', pickJob], ['Browse the job board', function () { location.href = 'jobs.html'; }]].concat(next));
  }
  function jobCard(j) {
    var saved = ES && ES.isSaved(j.title);
    return '<div class="jobMini"><b>' + esc(j.title) + '</b><span>' + (j.managed ? 'Recruiter-managed · ' : esc(j.org) + ' · ') + esc(j.where) + '</span>' +
      '<span class="jobMini__pay">' + esc(j.pay) + (j.housing ? ' · housing' : '') + '</span>' +
      '<div class="jobMini__act"><a href="job-detail.html">View role</a><button type="button" data-save="' + esc(j.title) + '">' + (saved ? 'Saved' : 'Save') + '</button><button type="button" data-share="' + esc(j.title) + '">Share</button></div></div>';
  }
  body.addEventListener('click', function (e) {
    var s = e.target.closest('[data-save]'), sh = e.target.closest('[data-share]');
    if (s && ES) { var j = JOBS.filter(function (x) { return x.title === s.dataset.save; })[0]; s.textContent = ES.toggleSave(j) ? 'Saved' : 'Save'; }
    if (sh) { var url = location.origin + location.pathname.replace(/[^/]*$/, 'job-detail.html');
      try { navigator.clipboard.writeText(sh.dataset.share + ' on EquiStaff: ' + url); sh.textContent = 'Link copied'; } catch (er) { sh.textContent = 'Copy failed'; } }
  });

  function profileHelp() {
    if (pageRole === 'seeker' || persona === 'seeker') {
      var p = ES ? ES.profile() : { strength: 70 };
      bot('Your profile is at <span class="liveFig">' + (p.strength || 70) + '%</span>. Still missing: <b>your goals and interests</b>, <b>your availability</b> and <b>your housing preference</b>. Complete profiles are seen first by the recruiting team.',
        [['Open my profile', function () { location.href = 'profile.html'; }], ['I don’t have a resume', resumeHelp], ['Back to the start', hello]]);
    } else {
      bot('A free profile is how the recruiting team finds you. It takes about 3 minutes.', [['Create my profile', function () { location.href = 'signup.html'; }], ['I don’t have a resume', resumeHelp]]);
    }
  }
  function resumeHelp() {
    // 31 Oct: Evie doesn't build it in the chat; she points to the builder.
    bot('No problem. Let me show you where you can build one. It’s quick, free and easy!',
      [['Build my resume', function () { location.href = 'resume.html'; }], ['Maybe later', hello]]);
  }
  function pickJob() {
    bot('Which job?', JOBS.slice(0, 5).map(function (j) { return [j.title + ' · ' + j.where.split(',')[0], function () { jobQuestions(j); }]; }));
  }
  function jobQuestions(j) {
    var A = {
      'Pay': function () { return j.pay ? 'The posting lists <b>' + esc(j.pay) + '</b>.' : null; },
      'Horses': function () { return j.horses ? '<b>' + esc(j.horses) + '</b> horses.' : null; },
      'Days off': function () { return j.days ? 'Days off: <b>' + esc(j.days) + '</b>.' : null; },
      'Housing': function () { return j.housing ? 'Housing: <b>' + esc(j.housing) + '</b>.' : null; },
      'Start date': function () { return j.start ? 'Start: <b>' + esc(j.start) + '</b>.' : null; },
      'Day in the life': function () { return j.day ? esc(j.day) : null; },
      'Who’s the employer?': function () { return j.managed ? '__R1' : 'It’s <b>' + esc(j.org) + '</b>.'; },
      'International applicants?': function () { return j.intl == null ? '__INTL' : 'International applicants: <b>' + esc(j.intl) + '</b>, so it’s the employer’s call. EquiStaff itself can’t sponsor visas.'; }
    };
    (function menu(first) {
      bot(first ? 'What would you like to know about <b>' + esc(j.title) + '</b>? I answer only from what the employer put in the posting.' : 'Anything else about this role?',
        Object.keys(A).map(function (k) { return [k, function () {
          var a = A[k]();
          if (a === '__R1') return bot('This is a recruiter-managed search, so the employer is introduced once your application is in. <span class="ruleTag">R1</span>', [['Apply', function () { location.href = 'job-detail.html#apply'; }], ['Ask something else', function () { menu(false); }]]);
          if (a === '__INTL') return bot('This employer hasn’t said whether they’ll consider international applicants. In general: ' + VISA, [['Ask the team', function () { handoff('blank_field', 'seeker'); }], ['Ask something else', function () { menu(false); }]]);
          if (!a) return bot('That isn’t listed for this job, and I won’t guess. The recruiting team can find out.', [['Ask the team', function () { handoff('blank_field', 'seeker'); }], ['Ask something else', function () { menu(false); }]]);
          bot(a, [['Ask something else', function () { menu(false); }], ['Apply', function () { location.href = 'job-detail.html#apply'; }], ['Done', hello]]);
        }]; }));
    })(true);
  }
  function account() {
    bot('What’s going on with your account?', [
      ['Reset my password', function () { bot('You can reset it here; the link arrives by email in a minute or two.', [['Reset password', function () { location.href = 'forgot.html'; }], ['Back to the start', hello]]); }],
      ['Subscriptions', function () { pricing(); }],
      ['Cancel', cancel],
      ['Search tips', function () { bot('<p>Filter by <b>housing</b> and <b>commitment</b> first; they rule the most roles in or out.</p><p>Recruiter-managed roles hide the employer’s name until you apply. That’s normal, not a red flag.</p>', [['Find me a job', findJob], ['Back to the start', hello]]); }]
    ]);
  }

  /* ---------- employer ---------- */
  function employerNeeds() {
    return [['Request talent', requestTalent], ['Post a job', postJob], ['Services and pricing', function () { pricing(); }], ['Billing or cancel', cancel]];
  }
  function employer() {
    path = 'employer';
    bot('Happy to help you hire. Most clients start with <b>Request talent</b>: tell me about the role and the recruiting team takes it from there.', employerNeeds());
  }
  function requestTalent() {
    path = 'employer';
    var q = { tags: ['request_talent'], status: 'new', source: 'chat' };
    var fields = [
      ['business_name', 'Barn or business name, and where are you?', 'Barn'],
      ['role', 'What role are you filling?', 'Role'],
      ['duties', 'What are the main duties?', 'Duties'],
      ['pay', 'What is your compensation range? And any perks you provide?', 'Pay & perks'], // Kaitlin's wording, 26 Oct
      ['contact_name', 'Your name?', 'Name'],
      ['email', 'And the best way to reach you, email or phone?', 'Contact']
    ];
    var shown = d.createElement('div');
    function render() {
      return '<dl class="leadCard">' + fields.map(function (f) {
        return '<div class="leadRow' + (q[f[0]] ? '' : ' leadRow--todo') + '"><dt>' + f[2] + '</dt><dd>' + (q[f[0]] ? esc(q[f[0]]) : 'still to ask') + '</dd></div>';
      }).join('') + '</dl>';
    }
    var i = 0;
    bot('Six quick questions. This becomes the request the recruiting team reads, and it saves as you go.');
    queue = queue.then(function () { shown.innerHTML = render(); body.appendChild(shown); scroll(); });
    (function next() {
      if (i < fields.length) {
        var f = fields[i++];
        return ask(f[1], null, function (t) { me(t); q[f[0]] = t; shown.innerHTML = render(); next(); });
      }
      if (ES) ES.addInquiry(q);
      bot('That’s in. <b>The recruiting team reads every request</b> and decides whether it’s full-service recruiting or a job board post. They’ll email you to book a call.',
        [['Talk to the team now', function () { handoff('request_talent', 'employer'); }], ['Add more detail (optional)', function () { optionalDetail(q); }], ['I’m done', hello]]);
    })();
  }
  function optionalDetail(q) {
    ask('Tell me about your program: discipline and number of staff.', [['Skip', hello]], function (t) { me(t); q.program = t;
      ask('What does a day in the life look like in this role?', [['Skip', hello]], function (t2) { me(t2); q.day_in_life = t2;
        bot('Thanks, that’s added to your request. It saves the team a question on your first call.', [['Back to the start', hello]]); }); });
  }
  function postJob() {
    path = 'employer';
    bot('You can post it yourself; I’ll check it for anything missing as you go (pay, housing, horses, days off, a day in the life). There’s also a new field: <b>open to international applicants</b>.',
      [['Start a posting', function () { location.href = 'post-job.html'; }], ['Have the team write it for me', function () {
        if (ES) ES.addInquiry({ business_name: 'From chat', role: 'Job description writing', tags: ['jd_writing'], status: 'new', source: 'chat' });
        bot('Done, I’ve asked the recruiting team. They’ll be in touch to get the details.', [['Back to the start', hello]]);
      }], ['Pricing first', function () { pricing('post'); }]]);
  }
  /* 31 Oct: "Pricing first" read as a dead end (the card arrived with no
     lead-in and the reply sounded like a deflection). Now: say what's coming,
     show the prices, then the next step for where they came from. */
  function pricing(from) {
    var fromPost = from === 'post';
    bot('Here’s what the job board costs:');
    card('<div class="priceCard">' + PRICES.map(function (p) { return '<div class="priceRow"><div><b>' + p[0] + '</b><span>' + p[1] + '</span></div><span class="liveFig">' + p[2] + '</span></div>'; }).join('') +
      '<div class="priceRow priceRow--dh"><div><b>Direct hire recruiting</b><span>' + DIRECT_HIRE + '</span></div></div></div>');
    var chips = fromPost
      ? [['Start a posting', function () { location.href = 'post-job.html'; }], ['Request talent instead', requestTalent], ['See full pricing', function () { location.href = 'pricing.html'; }]]
      : [['Post a job', postJob], ['Request talent', requestTalent], ['See full pricing', function () { location.href = 'pricing.html'; }]];
    bot((fromPost ? 'Ready to post? ' : 'What next? ') + 'For full-service recruiting, the team quotes each search based on the role and the current market. <span class="ruleTag">R3</span>',
      chips.concat([['Back to the start', hello]])).then(function () {
      // Bring the prices themselves into view, not just the chips under them.
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        var all = body.querySelectorAll('.priceCard'), pc = all[all.length - 1];
        if (pc) body.scrollTop += pc.getBoundingClientRect().top - body.getBoundingClientRect().top - 56;
      }); });
    });
  }
  /* Kaitlin, 26 Oct: check whether the job was filled before offering
     anything. If they're done hiring (above all, if they hired through us)
     we don't try to keep them. */
  function cancel() {
    bot('Before you go, did you fill the position?', [
      ['Yes, through EquiStaff', function () { doneHiring('Congratulations, that’s wonderful news, and thank you for hiring through EquiStaff! I won’t try to talk you out of cancelling.'); }],
      ['Yes, another way', function () { doneHiring('Congratulations on finding the right person!'); }],
      ['We’ve stopped hiring', function () { doneHiring('Understood, thanks for letting us know.'); }],
      ['Not yet, still looking', saveOffers]
    ]);
  }
  /* 31 Oct (Kaitlin): cancelling never offers a call. It's Billing, a
     message (which asks for the company, not a name, and nothing else), or
     an email to pro@equistaff.com. */
  function cancelWays() {
    return [['Go to billing', function () { location.href = 'billing.html'; }],
      ['Leave a message', cancelMessage],
      ['Email ' + PRO_EMAIL, function () { emailPro(); }]];
  }
  function emailPro() {
    bot('Email the team at <a href="mailto:' + PRO_EMAIL + '?subject=Cancel%20my%20job%20board%20subscription">' + PRO_EMAIL + '</a> and they’ll cancel it and confirm by email.', [['Back to the start', hello]]);
  }
  function cancelMessage() {
    ask('What’s the company name on the account?', null, function (t) { me(t);
      var all = LS.get(K_HAND, []); all.unshift({ audience: 'employer', reason: 'cancel', company: t, page: page, at: Date.now() }); LS.set(K_HAND, all);
      if (ES) ES.notify('Cancellation request sent');
      bot('Thanks. The team will cancel it for <b>' + esc(t) + '</b> and email you to confirm.', [['Back to the start', hello]]);
    });
  }
  function doneHiring(lead) {
    bot(lead + ' You can cancel from Billing in a couple of clicks, or leave a message and the team will do it for you. We’ll be here whenever you’re hiring again.',
      cancelWays().concat([['Back to the start', hello]]));
  }
  function saveOffers() {
    bot('Sorry the search is taking a while. Before you go, can I offer one of these?', [
      ['50% off next month', function () { bot('Done. The team will apply 50% off your next month and confirm by email. ' + tbc('how it’s applied: to confirm'), [['Back to the start', hello]]); }],
      ['Full-service recruiting', requestTalent],
      ['Still cancel', function () { bot('I can’t cancel a paid subscription myself. You can do it from Billing, or the team can do it for you. <span class="ruleTag">R7</span>', cancelWays()); }]
    ]);
  }

  /* ---------- questions ---------- */
  function questions() {
    bot('Ask away. Popular ones:', [['About EquiStaff', about], ['What does it cost?', function () { pricing(); }], ['How many jobs are open?', liveNumbers], ['Can you sponsor a visa?', visa], ['Account trouble', account]]);
    hint('Or type your own question.');
  }
  function about() {
    // Kaitlin's wording (Figma, 26 Oct); her "over 42 years" written as "since 1982" so it never goes stale.
    bot('<p>EquiStaff has been matching equine industry talent with quality opportunities <b>since 1982</b>, covering all types of roles from the Barn to the Board Room.</p>' +
      '<p>If you’re looking to hire, there’s two ways to work with us: advertise on our <b>Job Board</b> yourself, or let the recruiting team take the stress off your plate with a <b>Direct Recruitment</b> search.</p>' +
      '<p>Our services are always free for jobseekers!</p>', nudge());
  }
  function liveNumbers() {
    bot('Right now there are <span class="liveFig">' + JOBS.length + ' open roles</span>, and <span class="liveFig">1,240 job seekers</span> were active in the last 30 days.<span class="liveNote">Sample figures in the prototype. The live assistant reads them from the platform when you ask (R5).</span>', nudge());
  }
  function visa() { bot(VISA + ' ' + tbc('wording: Kaitlin to approve'), nudge()); }
  function nudge() { return [['I’m hiring', employer], ['I’m looking for work', seeker], ['Another question', questions]]; }

  /* ---------- open / close / demo ---------- */
  function open() {
    dock.hidden = false; launch.setAttribute('aria-expanded', 'true'); launch.classList.add('is-open'); d.documentElement.classList.add('chat-open');
    if (!started) { started = true; hello(); }
    if (!qs.get('chatdemo')) setTimeout(function () { input.focus(); }, 50);
  }
  function close() { d.documentElement.classList.remove('chat-open'); dock.hidden = true; launch.setAttribute('aria-expanded', 'false'); launch.classList.remove('is-open'); launch.focus(); }
  launch.addEventListener('click', function (e) { e.preventDefault(); dock.hidden ? open() : close(); });
  dock.querySelector('.chat__x').addEventListener('click', close);
  dock.querySelector('.chat__human').addEventListener('click', function () { me('Talk to a person'); handoff('asked'); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !dock.hidden) close(); });
  dock.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault(); var t = input.value.trim(); if (!t) return; input.value = '';
    if (!waiting) me(t);
    freeText(t);
  });
  function restart() { path = null; body.innerHTML = ''; queue = Promise.resolve(); waiting = null; misses = 0; hello.socialAsked = false; hello.jobAsked = false; hello(); }
  dock.querySelectorAll('[data-p]').forEach(function (b) {
    b.addEventListener('click', function () { persona = b.dataset.p; LS.set(K_PERSONA, persona); markPersona(); restart(); });
  });
  dock.querySelector('[data-reset]').addEventListener('click', function () { LS.set(K_INTAKE, null); restart(); });
  function markPersona() { dock.querySelectorAll('[data-p]').forEach(function (b) { b.classList.toggle('is-on', b.dataset.p === persona); }); }
  markPersona();
  w.ESChat = { open: open, close: close, restart: restart, dock: dock, launch: launch, isOpen: function () { return !dock.hidden; } };
  if (!d.querySelector('script[src$="chat-tweaks.js"]')) { var tw = d.createElement('script'); tw.src = 'src/chat-tweaks.js'; d.body.appendChild(tw); }
  /* ---------- deep links to a state: ?chatdemo=<name> ----------
     For reviews and screenshots: opens the panel and replays a script.
     Steps are quick-reply labels; a leading ">" means "type this". */
  var DEMOS = {
    greeting: [],
    seeker: ['Looking for work', 'Skip, show me jobs', 'Grooms & Barn Staff', 'Anywhere, I’d relocate'],
    intake: ['Looking for work', 'Let’s go', 'Grooms & Barn Staff', 'Hunter / Jumper'],
    job: ['Ask about this job', 'Housing', 'Ask something else', 'Who’s the employer?'],
    employer: ['I’m hiring', 'Request talent', '>Live Oak Stables, Ocala FL', '>Head Groom', '>Daily care for 20 show horses, travel to shows', '>$45k + housing'],
    pricing: ['I just have a question', 'What does it cost?'],
    cancel: ['I’m hiring', 'Billing or cancel'],
    cancelsave: ['I’m hiring', 'Billing or cancel', 'Not yet, still looking'],
    cancelmsg: ['I’m hiring', 'Billing or cancel', 'We’ve stopped hiring', 'Leave a message'],
    handoff: ['I’m hiring', '>can I talk to someone'],
    fallback: ['>is the barn near the beach', '>what about my horse trailer'],
    rule: ['>what would my search cost for a barn manager']
  };
  var demo = DEMOS[qs.get('chatdemo')];
  if (demo) {
    reduce = true; persona = qs.get('as') || pageRole; markPersona();
    open();
    (function step(i) {
      queue.then(function () {
        if (i >= demo.length) return;
        var s = demo[i];
        if (s.charAt(0) === '>') { input.value = s.slice(1); dock.querySelector('form').requestSubmit(); }
        else {
          var b = [].filter.call(dock.querySelectorAll('.chips2 button:not(:disabled)'), function (x) { return x.textContent.trim() === s; }).pop();
          if (b) b.click();
        }
        setTimeout(function () { step(i + 1); }, 30);
      });
    })(0);
  } else if (qs.get('chat') === 'open') open();
})(window, document);
