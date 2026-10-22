/* ============================================================
   ES — prototype state
   ------------------------------------------------------------
   The screens are real HTML, so without this every one of them is a fixed
   picture: you apply for a role and your profile still shows the same three
   applications. That makes the prototype fine to look at and impossible to
   test. This holds session state in the browser so what you do in one screen
   shows up in the next.

   Record names follow the chatbot engineering handoff (SeekerIntake,
   EmployerInquiry, HandoffRequest) so the prototype and the build describe
   the same things.

   This is prototype scaffolding, not a spec for persistence. Everything here
   is per-browser and disappears when site data is cleared.
   ============================================================ */
(function (w) {
  'use strict';
  var KEY = 'equistaff.prototype.v2';

  // Seed data matches what the static screens showed before state existed, so
  // a first-time visitor sees a populated, believable account rather than an
  // empty one — and anything they do is added on top.
  var SEED = {
    profile: {
      name: 'Dana Whitfield', initials: 'DW', role: 'Barn Manager',
      location: 'Ocala, FL', email: 'd.whitfield@example.com',
      discipline: 'Hunter / Jumper', availability: 'Available in 30 days',
      strength: 70
    },
    applications: [
      // Seeded so a first-time visitor lands on a believable account. Deliberately
      // excludes Barn Manager — that is the role the prototype's apply flow uses,
      // and seeding it would mean "you already applied" on the job you just applied to.
      { id: 'a1', title: 'Estate Manager', org: 'Rolling Oaks Estate', where: 'Aiken, SC',
        managed: true, status: 'Shortlisted', when: 'applied 4 days ago', disclosed: true },
      { id: 'a2', title: 'Facility Director', org: 'Eventing yard', where: 'Middleburg, VA',
        managed: true, status: 'Being reviewed', when: 'applied 5 days ago', disclosed: false },
      { id: 'a3', title: 'Head Groom', org: 'Clearwater Sport Horses', where: 'Lexington, KY',
        managed: false, status: 'Sent to barn', when: 'applied 1 week ago', disclosed: true }
    ],
    saved: [],
    resume: null,
    inquiries: [],
    posts: [
      { id: 'p1', title: 'Working Student — seasonal', posted: 14, views: 112, applicants: 9, state: 'Live on the board' },
      { id: 'p2', title: 'Part-time Groom', posted: 41, views: 203, applicants: 2, state: 'Not performing' }
    ],
    ratings: {},
    notices: []
  };

  function load() {
    try {
      var raw = w.localStorage.getItem(KEY);
      if (!raw) return JSON.parse(JSON.stringify(SEED));
      var d = JSON.parse(raw);
      // Fill in anything a newer screen expects that an older save predates.
      Object.keys(SEED).forEach(function (k) { if (d[k] === undefined) d[k] = SEED[k]; });
      return d;
    } catch (e) {
      // Private windows and blocked site data both land here. The prototype
      // still has to work, it just won't remember anything.
      return JSON.parse(JSON.stringify(SEED));
    }
  }

  function save(d) {
    try { w.localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* no-op */ }
  }

  var db = load();
  function commit() { save(db); }
  function uid(p) { return p + Math.random().toString(36).slice(2, 8); }

  var ES = {
    all: function () { return db; },

    reset: function () {
      db = JSON.parse(JSON.stringify(SEED)); commit();
    },

    /* ---------- job seeker ---------- */
    profile: function () { return db.profile; },
    setProfile: function (patch) { Object.assign(db.profile, patch); commit(); return db.profile; },

    applications: function () { return db.applications; },
    hasApplied: function (title) {
      return db.applications.some(function (a) { return a.title === title; });
    },
    apply: function (job) {
      if (ES.hasApplied(job.title)) return null;
      var a = {
        id: uid('a'), title: job.title, org: job.org, where: job.where,
        managed: !!job.managed, status: 'Being reviewed', when: 'applied just now',
        // The confidentiality rule: a managed employer is named only once
        // contact is made, so a brand-new application never discloses.
        disclosed: !job.managed
      };
      db.applications.unshift(a);
      ES.notify('Application sent for ' + job.title);
      commit(); return a;
    },

    saved: function () { return db.saved; },
    isSaved: function (title) { return db.saved.some(function (s) { return s.title === title; }); },
    toggleSave: function (job) {
      var i = db.saved.findIndex(function (s) { return s.title === job.title; });
      if (i > -1) { db.saved.splice(i, 1); commit(); return false; }
      db.saved.unshift({ id: uid('s'), title: job.title, org: job.org, where: job.where,
                         pay: job.pay || '', managed: !!job.managed });
      commit(); return true;
    },

    resume: function () { return db.resume; },
    setResume: function (r) {
      db.resume = r;
      if (db.profile.strength < 85) db.profile.strength = 85;
      ES.notify('Resume saved to your profile');
      commit(); return r;
    },

    /* ---------- employer ---------- */
    inquiries: function () { return db.inquiries; },
    addInquiry: function (o) {
      o.id = uid('q'); o.created = Date.now();
      db.inquiries.unshift(o);
      ES.notify('Request sent to Kaitlin — ' + (o.role || 'new role'));
      commit(); return o;
    },

    posts: function () { return db.posts; },
    addPost: function (p) {
      p.id = uid('p'); p.posted = 0; p.views = 0; p.applicants = 0;
      p.state = 'Live on the board';
      db.posts.unshift(p);
      ES.notify('“' + p.title + '” is live on the board');
      commit(); return p;
    },
    closePost: function (id) {
      var p = db.posts.find(function (x) { return x.id === id; });
      if (p) { p.state = 'Closed'; commit(); }
      return p;
    },

    ratings: function () { return db.ratings; },
    rate: function (candidateId, stars, note) {
      db.ratings[candidateId] = { stars: stars, note: note || '', at: Date.now() };
      commit(); return db.ratings[candidateId];
    },

    /* Real file downloads. This is a static site, not a sandboxed frame, so a
       Blob download genuinely works — better than a button that does nothing. */
    download: function (filename, text, mime) {
      try {
        var blob = new Blob([text], { type: mime || 'text/plain;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        ES.notify('Downloaded ' + filename);
        return true;
      } catch (e) { return false; }
    },

    /* ---------- small cross-screen notice ---------- */
    notify: function (text) { db.notices.push({ text: text, at: Date.now() }); commit(); },
    takeNotices: function () { var n = db.notices.slice(); db.notices = []; commit(); return n; },

    /* Renders anything queued by the previous screen, so an action taken on
       one page is visibly acknowledged on the next. */
    flash: function () {
      var n = ES.takeNotices();
      if (!n.length) return;
      var bar = document.createElement('div');
      bar.className = 'esFlash';
      bar.setAttribute('role', 'status');
      bar.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg><span>' +
        n.map(function (x) { return x.text; }).join(' · ') + '</span>';
      document.body.appendChild(bar);
      setTimeout(function () { bar.classList.add('esFlash--out'); }, 4200);
      setTimeout(function () { bar.remove(); }, 5000);
    }
  };

  w.ES = ES;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ES.flash);
  } else { ES.flash(); }
})(window);
