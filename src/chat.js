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
    { title: 'Barn Manager', org: '24-horse hunter/jumper barn', where: 'Ocala, FL', state: 'FL', pay: '$55,000 – $68,000', housing: 'On-site, 1 bed', horses: '24 · hunter/jumper', days: 'Two, rotating', start: 'Flexible, ideally November', discipline: 'Hunter / Jumper', type: 'Full time', managed: true, intl: null, day: 'Running the daily schedule (turnout, feed, farrier, vet and training), leading a team of four, and keeping competition records. The horses compete most weekends through the winter season.' },
    { title: 'Estate Manager', org: 'Private estate', where: 'Aiken, SC', state: 'SC', pay: '$95,000 – $120,000', housing: 'Included', discipline: 'Private estate', type: 'Full time', managed: true },
    { title: 'Assistant Trainer', org: 'Bridlewood Farm', where: 'Wellington, FL', state: 'FL', pay: '$42,000 – $52,000', housing: null, horses: '18', discipline: 'Hunter / Jumper', type: 'Full time', managed: false },
    { title: 'Head Groom', org: 'Clearwater Sport Horses', where: 'Lexington, KY', state: 'KY', pay: '$38,000 – $46,000', housing: 'Available', discipline: 'Dressage', type: 'Full time', managed: false },
    { title: 'Facility Director', org: 'Eventing yard, 60+ horses', where: 'Middleburg, VA', state: 'VA', pay: '$78,000 – $92,000', housing: null, horses: '60+', discipline: 'Eventing', type: 'Full time', managed: true },
    { title: 'Working Student', org: 'Live Oak Stables', where: 'Ocala, FL', state: 'FL', pay: 'Stipend', housing: 'Housing and board included', discipline: 'Eventing', type: 'Seasonal', managed: false }
  ];
  var PRICES = [ // pricing.html, Kaitlin's list
    ['Job board · 1 month', '3 job posts · unlimited searches', '$49.99'],
    ['Job board · 1 month, featured', '3 job posts · featured bar', '$69.99'],
    ['Job board · 3 months', '3 job posts · unlimited searches', '$139.99'],
    ['Job board · 1 year', '10 job posts · unlimited searches', '$469.99']
  ];
  var DIRECT_HIRE = '“Percentage of the first year salary figure, with $1000 due up front to get the search going, and the remainder due on our chosen candidate’s first day of employment with you.”';
  var VISA = 'EquiStaff can’t sponsor visas. Whether an employer will consider international applicants is up to each employer, and it’s shown on the job post when they’ve told us.';
  var ROLES = ['Stall cleaner','Groom','Hotwalker','Barn manager','Flat rider','Exercise rider','Pony rider','Outrider','Assistant trainer','Trainer','Night watch','Foreman','General manager','Property manager','Maintenance manager','Bloodstock agent','Breeding manager','Loper','Assistant manager','Instructor','Equestrian director','Vet assistant','Vet technician','Veterinarian','Admin assistant','Practice manager','Customer service','Inside sales','Outside sales','Account manager','Show secretary','Course designer','Farrier','Massage therapist','Rehab specialist','PATH instructor','Office manager','Estate manager','Working student','Facility director','Head groom'];
  var DISCIPLINES = ['Hunter / Jumper','Dressage','Eventing','Show Jumping','Reining','Barrel Racing','Polo','Thoroughbred Industry','Quarter Horse Racing','Western Pleasure','Cutting','Breeding','Equine Assisted Therapy','Veterinary Medicine','Feed & Nutrition Sales','Pharmaceutical Sales','Marketing','Office / Admin','Private estate','Summer Camps'];

  /* ---------- styles + DOM ---------- */
  if (!d.querySelector('link[href$="chat.css"]')) {
    var l = d.createElement('link'); l.rel = 'stylesheet'; l.href = 'src/chat.css'; d.head.appendChild(l);
  }
  var launch = d.querySelector('.chatLaunch:not([data-specimen])'); // the spec page shows a static specimen
  if (!launch) {
    launch = d.createElement('button');
    launch.className = 'chatLaunch';
    launch.innerHTML = '<svg class="chatLaunch__hs" aria-hidden="true" focusable="false"><use href="#i-horseshoe"/></svg> <span class="chatLaunch__label">Ask EquiStaff</span>';
    d.body.appendChild(launch);
    d.body.classList.add('has-chat');
  }
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
        '<button class="chat__human" type="button"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg> Talk to a person · Kaitlin and her team</button>' +
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
  var INTENTS = [
    [/\b(are you|is this) (a )?(real|human|person|bot|ai|robot)\b/i, function () { bot('I’m Evie, EquiStaff’s AI assistant. I’m not a person, but Kaitlin and her team are one tap away whenever you want them.', [['Talk to a person', function () { handoff('asked'); }], ['Keep going', hello]]); }],
    [/\b(person|human|someone|talk to|call|kaitlin|agent|representative)\b/i, function () { handoff('asked'); }],
    [/\b(visa|sponsor|international|work permit|authori[sz]ation)\b/i, visa],
    [/\b(how long|timeline|when will i|guarantee)\b.*\b(place|hire|job|placement)\b|\bplacement\b.*\b(how long|time)\b/i, function () { refuse('I can’t promise a placement or a timeline for one. Every search is different, so Kaitlin is the right person to ask.', 'R2'); }],
    [/\b(my search|search cost|what would .* cost|fee for|recruiting fee|percentage|commission)\b/i, function () { refuse('Recruiting fees depend on the role, so I don’t quote them. Here’s how direct hire is structured, in Kaitlin’s words:<p>' + DIRECT_HIRE + '</p>The exact figure comes from Kaitlin.', 'R3'); }],
    [/\b(price|pricing|cost|how much|plans?|subscription)\b/i, pricing],
    [/\b(cancel|unsubscribe|refund|billing)\b/i, cancel],
    [/\b(password|log ?in|sign ?in|locked|account)\b/i, account],
    [/\b(rejected|why didn.?t|turned down)\b/i, function () { refuse('I can’t see or explain decisions on applications. Kaitlin can talk it through with you.', 'Hand-off'); }],
    [/\b(how many|open jobs|numbers|stats|job ?seekers)\b/i, liveNumbers],
    [/\b(hiring|hire|recruit|staff|need (a|an|someone)|looking for (a|an) (groom|manager|rider|trainer))\b/i, employer],
    [/\b(job|work|position|role|career|looking for work|resume)\b/i, seeker],
    [/\b(about|who are you|equistaff|how does it work|process)\b/i, about]
  ];
  function freeText(t) {
    if (waiting) { var f = waiting; waiting = null; return f(t); }
    for (var i = 0; i < INTENTS.length; i++) if (INTENTS[i][0].test(t)) { misses = 0; return INTENTS[i][1](); }
    misses++;
    var log = LS.get(K_LOG, []); log.unshift({ text: t, page: page, at: Date.now() }); LS.set(K_LOG, log.slice(0, 50));
    if (misses >= 2) return bot('I still can’t tell, and I don’t want to guess. Let me put you with a person.').then(function () { handoff('no_match'); });
    bot('I didn’t quite catch that. Which of these is closest?', mainChips());
  }

  /* ---------- the hand-off (R11: never guess) ---------- */
  function handoff(reason, audience) {
    audience = audience || path || (persona === 'employer' ? 'employer' : persona === 'seeker' ? 'seeker' : null);
    if (!audience) {
      return ask('Happy to connect you with Kaitlin. So I share the right calendar: are you hiring, or looking for work?',
        [['I’m hiring', function () { handoff(reason, 'employer'); }], ['Looking for work', function () { handoff(reason, 'seeker'); }]]);
    }
    card('<div class="handoff"><div class="handoff__top"><img src="img/kaitlin.jpg" alt=""><div><b>Kaitlin Snyder</b><span>EquiStaff recruiting · placing equine professionals since 1982</span></div></div>' +
      '<a class="btn btn--primary" href="#" onclick="return false">Book a call · ' + (audience === 'employer' ? 'employer' : 'job seeker') + ' calendar</a>' +
      '<p class="handoff__note">' + tbc('booking link: Kaitlin to send') + ' · Your conversation goes with you, so you won’t have to repeat yourself.</p></div>');
    bot('Prefer to leave a message instead?', [['Leave a message', function () { leaveMessage(audience, reason); }], ['Back to the start', hello]]);
  }
  function leaveMessage(audience, reason) {
    var h = { audience: audience, reason: reason, page: page };
    ask('What’s your name?', null, function (t) { me(t); h.name = t;
      ask('And the best email to reach you?', null, function (t2) { me(t2); h.email = t2;
        ask('What would you like Kaitlin to know?', null, function (t3) { me(t3); h.question = t3; h.at = Date.now();
          var all = LS.get(K_HAND, []); all.unshift(h); LS.set(K_HAND, all);
          if (ES) ES.notify('Message sent to Kaitlin');
          bot('Sent. Kaitlin will reply to <b>' + esc(h.email) + '</b>. ' + tbc('reply time: Kaitlin to confirm'), [['Back to the start', hello]]);
        });
      });
    });
  }
  function refuse(html, rule) {
    bot(html + ' <span class="ruleTag">' + esc(rule) + '</span>', [['Talk to Kaitlin', function () { handoff('rule'); }], ['Something else', hello]]);
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
      [['Let’s go', intake], ['Skip, show me jobs', function () { LS.set(K_INTAKE, {}); findJob(); }]]);
  }
  function intake() {
    var r = {};
    var steps = [
      function (n) { ask('What kind of job are you after?', chipsFrom(['Groom', 'Barn manager', 'Rider', 'Trainer', 'Office or sales'], function (v) { r.role = v; n(); }).concat([['Skip', n]]),
        function (t) { me(t); r.role = t; n(); }).then(function () { hint('Or type any role, from stall cleaner to vet tech.'); }); },
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

  function findJob() {
    var r = LS.get(K_INTAKE, {}) || {};
    var prof = ES ? ES.profile() : {};
    var want = ((r.role || prof.role || '') + ' ' + (r.discipline || prof.discipline || '')).toLowerCase();
    var loc = (r.location || prof.location || '').toLowerCase();
    var scored = JOBS.map(function (j) {
      var s = 0, t = (j.title + ' ' + j.discipline).toLowerCase();
      want.split(/[^a-z]+/).forEach(function (w2) { if (w2.length > 3 && t.indexOf(w2) > -1) s += 3; });
      if (loc && (loc.indexOf(j.state.toLowerCase()) > -1 || loc.indexOf(j.where.split(',')[0].toLowerCase()) > -1)) s += 2;
      if (r.housing === 'Yes' && j.housing) s += 2;
      if (r.work_type && j.type.toLowerCase().indexOf(r.work_type.toLowerCase().split(' ')[0]) > -1) s += 1;
      return { j: j, s: s };
    }).sort(function (a, b) { return b.s - a.s; });
    var top = scored.slice(0, 2); // never a shortlist: at most 2 (handoff JS-1)
    bot('Here are the 2 closest matches right now, out of ' + JOBS.length + ' open roles.');
    top.forEach(function (x) { card(jobCard(x.j)); });
    bot('Kaitlin’s team also sees complete profiles first, so finishing yours helps.', [['Help with my profile', profileHelp], ['Question about one of these', pickJob], ['Back to the start', hello]]);
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
      bot('Your profile is at <span class="liveFig">' + (p.strength || 70) + '%</span>. Still missing: <b>two references</b>, <b>your availability</b> and <b>your housing preference</b>. Complete profiles are seen first by the recruiting team.',
        [['Open my profile', function () { location.href = 'profile.html'; }], ['I don’t have a resume', resumeHelp], ['Back to the start', hello]]);
    } else {
      bot('A free profile is how Kaitlin’s team finds you. It takes about 3 minutes.', [['Create my profile', function () { location.href = 'signup.html'; }], ['I don’t have a resume', resumeHelp]]);
    }
  }
  function resumeHelp() {
    bot('No problem. I’ll ask about your last 2–3 jobs (where, your title, the dates and what you did) and build a simple, clean resume. Nothing is saved until you check it.',
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
      'International applicants?': function () { return j.intl == null ? '__INTL' : esc(j.intl); }
    };
    (function menu(first) {
      bot(first ? 'What would you like to know about <b>' + esc(j.title) + '</b>? I answer only from what the employer put in the posting.' : 'Anything else about this role?',
        Object.keys(A).map(function (k) { return [k, function () {
          var a = A[k]();
          if (a === '__R1') return bot('This is a recruiter-managed search, so the employer is introduced once your application is in. <span class="ruleTag">R1</span>', [['Apply', function () { location.href = 'job-detail.html#apply'; }], ['Ask something else', function () { menu(false); }]]);
          if (a === '__INTL') return bot('This employer hasn’t said whether they’ll consider international applicants. In general: ' + VISA, [['Ask Kaitlin', function () { handoff('blank_field', 'seeker'); }], ['Ask something else', function () { menu(false); }]]);
          if (!a) return bot('That isn’t listed for this job, and I won’t guess. Kaitlin can find out.', [['Ask Kaitlin', function () { handoff('blank_field', 'seeker'); }], ['Ask something else', function () { menu(false); }]]);
          bot(a, [['Ask something else', function () { menu(false); }], ['Apply', function () { location.href = 'job-detail.html#apply'; }], ['Done', hello]]);
        }]; }));
    })(true);
  }
  function account() {
    bot('What’s going on with your account?', [
      ['Reset my password', function () { bot('You can reset it here; the link arrives by email in a minute or two.', [['Reset password', function () { location.href = 'forgot.html'; }], ['Back to the start', hello]]); }],
      ['Subscriptions', pricing],
      ['Cancel', cancel],
      ['Search tips', function () { bot('<p>Filter by <b>housing</b> and <b>commitment</b> first; they rule the most roles in or out.</p><p>Recruiter-managed roles hide the employer’s name until you apply. That’s normal, not a red flag.</p>', [['Find me a job', findJob], ['Back to the start', hello]]); }]
    ]);
  }

  /* ---------- employer ---------- */
  function employerNeeds() {
    return [['Request talent', requestTalent], ['Post a job', postJob], ['Services and pricing', pricing], ['Billing or cancel', cancel]];
  }
  function employer() {
    path = 'employer';
    bot('Happy to help you hire. Most clients start with <b>Request talent</b>: tell me about the role and Kaitlin takes it from there.', employerNeeds());
  }
  function requestTalent() {
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
    bot('Six quick questions. This becomes the inquiry Kaitlin reads, and it saves as you go.');
    queue = queue.then(function () { shown.innerHTML = render(); body.appendChild(shown); scroll(); });
    (function next() {
      if (i < fields.length) {
        var f = fields[i++];
        return ask(f[1], null, function (t) { me(t); q[f[0]] = t; shown.innerHTML = render(); next(); });
      }
      if (ES) ES.addInquiry(q);
      bot('That’s in. <b>Kaitlin reads every request herself</b> and decides whether it’s full-service recruiting or a job board post. Want to book a time with her now?',
        [['Book a call', function () { handoff('request_talent', 'employer'); }], ['Add more detail (optional)', function () { optionalDetail(q); }], ['I’m done', hello]]);
    })();
  }
  function optionalDetail(q) {
    ask('Tell me about your program: discipline, number of horses, number of staff.', [['Skip', hello]], function (t) { me(t); q.program = t;
      ask('What does a day in the life look like in this role?', [['Skip', hello]], function (t2) { me(t2); q.day_in_life = t2;
        bot('Thanks, that’s added to your request. It saves Kaitlin a question on your first call.', [['Back to the start', hello]]); }); });
  }
  function postJob() {
    bot('You can post it yourself; I’ll check it for anything missing as you go (pay, housing, horses, days off, a day in the life). There’s also a new field: <b>open to international applicants</b>.',
      [['Start a posting', function () { location.href = 'post-job.html'; }], ['Have Kaitlin write it for me', function () {
        if (ES) ES.addInquiry({ business_name: 'From chat', role: 'Job description writing', tags: ['jd_writing'], status: 'new', source: 'chat' });
        bot('Done, I’ve asked Kaitlin. She’ll be in touch to get the details.', [['Back to the start', hello]]);
      }], ['Pricing first', pricing]]);
  }
  function pricing() {
    card('<div class="priceCard">' + PRICES.map(function (p) { return '<div class="priceRow"><div><b>' + p[0] + '</b><span>' + p[1] + '</span></div><span class="liveFig">' + p[2] + '</span></div>'; }).join('') +
      '<div class="priceRow priceRow--dh"><div><b>Direct hire</b><span>' + DIRECT_HIRE + '</span></div></div></div>');
    bot('Those are our published prices. For our recruiting services, Kaitlin will be able to give you a quote based on your needs and the current market. <span class="ruleTag">R3</span>',
      [['What would my search cost?', function () { refuse('That depends on the role, so I don’t estimate it. Kaitlin will give you a straight answer on a short call.', 'R3'); }], ['Request talent', requestTalent], ['Back to the start', hello]]);
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
  function doneHiring(lead) {
    bot(lead + ' You can cancel from Billing in a couple of clicks, or Kaitlin can do it with you. We’ll be here whenever you’re hiring again.',
      [['Go to billing', function () { location.href = 'billing.html'; }], ['Have Kaitlin cancel it', function () { handoff('cancel', 'employer'); }], ['Back to the start', hello]]);
  }
  function saveOffers() {
    bot('Sorry the search is taking a while. Before you go, can I offer one of these?', [
      ['50% off next month', function () { bot('Done in the prototype. In the live site this flags your account for Kaitlin to apply the discount. ' + tbc('how it’s applied: to confirm'), [['Back to the start', hello]]); }],
      ['Intro call with Kaitlin', function () { handoff('cancel_save', 'employer'); }],
      ['Full-service recruiting', requestTalent],
      ['Still cancel', function () { refuse('I can’t cancel a paid subscription myself. You can do it from billing, or Kaitlin can do it with you.', 'R7'); }]
    ]);
  }

  /* ---------- questions ---------- */
  function questions() {
    bot('Ask away. Popular ones:', [['About EquiStaff', about], ['What does it cost?', pricing], ['How many jobs are open?', liveNumbers], ['Can you sponsor a visa?', visa], ['Account trouble', account]]);
    hint('Or type your own question. Kaitlin’s top 10 answers are still to come.');
  }
  function about() {
    // Kaitlin's wording (Figma, 26 Oct); her "over 42 years" written as "since 1982" so it never goes stale.
    bot('<p>EquiStaff has been matching equine industry talent with quality opportunities <b>since 1982</b>, covering all types of roles from the Barn to the Board Room.</p>' +
      '<p>If you’re looking to hire, there’s two ways to work with us: advertise on our <b>Job Board</b> yourself, or let Kaitlin take the stress off your plate with a <b>Direct Recruitment</b> search.</p>' +
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
    seeker: ['Looking for work', 'Skip, show me jobs'],
    intake: ['Looking for work', 'Let’s go', 'Barn manager', 'Hunter / Jumper'],
    job: ['Ask about this job', 'Housing', 'Ask something else', 'Who’s the employer?'],
    employer: ['I’m hiring', 'Request talent', '>Live Oak Stables, Ocala FL', '>Head Groom', '>Daily care for 20 show horses, travel to shows', '>$45k + housing'],
    pricing: ['I just have a question', 'What does it cost?'],
    cancel: ['I’m hiring', 'Billing or cancel'],
    cancelsave: ['I’m hiring', 'Billing or cancel', 'Not yet, still looking'],
    handoff: ['I’m hiring', 'Billing or cancel', 'Not yet, still looking', 'Intro call with Kaitlin'],
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
