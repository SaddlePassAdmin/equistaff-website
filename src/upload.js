/* ============================================================
   UPLOAD, THEN CHECK — one pattern, four screens.
   ------------------------------------------------------------
   Kaitlin's ask: let people start from the document they already
   have. A job seeker drops in a resume, an employer drops in a job
   description, and instead of retyping it they check what we read
   out of it. Used by onboarding.html, resume.html, post-job.html and
   request-talent.html.

   Three states in one host element:
     drop    — drop zone + file picker, with a secondary
               "fill it in yourself" path
     reading — a short "Reading your resume…" moment
     review  — "Check what we pulled": every field editable,
               then "Looks right, continue"

   There is no parser behind this yet: the review screen is filled
   from the samples below, so the flow can be judged end to end.

     ESUpload.mount(host, {
       kind:     'resume' | 'job',
       mode:     'facility' | 'business'  (or a function returning one),
       sample:   function (kind, mode) { return data }   optional,
       manual:   'or fill it in yourself'  (label; omit to hide),
       onManual: function () {},
       onStage:  function (stage) {}  'drop' | 'reading' | 'review'
       skillsNote: 'You can add more on the next step.',
       onDone:   function (data) {}
     })
   ============================================================ */
(function (w, d) {
  'use strict';

  var SAMPLES = {
    resume: {
      facility: {
        file: 'Dana-Whitfield-resume.pdf',
        name: 'Dana Whitfield', phone: '(352) 555-0147', email: 'd.whitfield@example.com', location: 'Ocala, FL',
        history: [
          { role: 'Barn Manager', employer: 'Live Oak Stables', location: 'Ocala, FL', dates: '2021 – now',
            did: 'Ran the day-to-day for 24 head: turnout, feed, farrier and vet scheduling. Managed two grooms and a working student.' },
          { role: 'Head Groom', employer: 'Bridlewood Farm', location: 'Wellington, FL', dates: '2018 – 2021',
            did: 'Show grooming for a hunter/jumper string on the winter circuit. Braiding, clipping and travel to shows.' },
          { role: 'Working Student', employer: 'Hilltop Eventing', location: 'Aiken, SC', dates: '2016 – 2018',
            did: 'Flatwork and conditioning for young event horses, stall care and barn chores.' }
        ],
        skills: [
          { heard: 'managed a 24-horse show barn', tag: 'Barn Manager (Medium Program)' },
          { heard: 'braided for the hunter ring', tag: 'Braiding (Hunters)' },
          { heard: 'gave IM injections', tag: 'IM Medications' },
          { heard: 'clipped the string every fall', tag: 'Clipping' },
          { heard: 'hauled to shows up and down the East Coast', tag: 'Trailering (2-3 horse)' },
          { heard: 'kept vet and farrier records', tag: 'Records Keeping' }
        ]
      },
      business: {
        file: 'Dana-Whitfield-resume.pdf',
        name: 'Dana Whitfield', phone: '(352) 555-0147', email: 'd.whitfield@example.com', location: 'Lexington, KY',
        history: [
          { role: 'Territory Sales Manager', employer: 'Cardinal Feed Co.', location: 'Lexington, KY', dates: '2020 – now',
            did: 'Feed and supplement sales across a four-state territory. Barn, feed store and vet accounts.' },
          { role: 'Account Executive', employer: 'Bluegrass Tack Supply', location: 'Lexington, KY', dates: '2017 – 2020',
            did: 'Looked after wholesale tack accounts and ran the stand at regional tradeshows.' }
        ],
        skills: [
          { heard: 'sold to barns, feed stores and vets', tag: 'B2B Sales' },
          { heard: 'looked after key accounts', tag: 'Account Management' },
          { heard: 'ran the stand at regional tradeshows', tag: 'Tradeshow' },
          { heard: 'feed and supplement sales', tag: 'Equine Sales' },
          { heard: 'built new business in the territory', tag: 'Business Development' }
        ]
      }
    },
    job: {
      facility: {
        file: 'Barn-Manager-job-description.pdf',
        title: 'Barn Manager', location: 'Ocala, FL', pay: '$55,000 – $68,000 per year',
        duties: 'Run the daily schedule for 24 hunter/jumper horses: turnout, feed, farrier and vet visits. Manage two grooms and a working student, and keep health and competition records.',
        requirements: 'Experience running a show barn and a small team. Comfortable giving IM injections and basic first aid. Happy to travel to shows through the winter season.',
        benefits: 'Private on-site apartment, two days off a week, and show travel covered.'
      },
      business: {
        file: 'Territory-Sales-Manager.docx',
        title: 'Territory Sales Manager', location: 'Lexington, KY', pay: '$55,000 – $68,000 per year',
        duties: 'Grow feed and supplement sales across a four-state territory. Visit barns, feed stores and vets, run tradeshow stands, and look after key accounts.',
        requirements: 'A track record in B2B or equine sales. Knows horses well enough to talk to barn managers as one of them. Clean driving record.',
        benefits: 'Company vehicle, phone and laptop, and a commission plan on top of base pay.'
      }
    }
  };

  var COPY = {
    resume: { noun: 'resume', drop: 'Drop your resume here', reading: 'Reading your resume…',
      lede: 'We read your resume so you don’t have to retype it. Fix anything we got wrong.' },
    job: { noun: 'job description', drop: 'Drop your job description here', reading: 'Reading your job description…',
      lede: 'We read your job description so you don’t have to retype it. Fix anything we got wrong.' }
  };

  var OK = /\.(pdf|docx?)$/i;
  var uid = 0;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function field(id, label, value, opts) {
    opts = opts || {};
    var tag = opts.rows
      ? '<textarea id="' + id + '" rows="' + opts.rows + '">' + esc(value) + '</textarea>'
      : '<input id="' + id + '" value="' + esc(value) + '"' + (opts.type ? ' type="' + opts.type + '"' : '')
        + (opts.auto ? ' autocomplete="' + opts.auto + '"' : '') + '>';
    return '<div class="field"><label for="' + id + '">' + label + '</label>' + tag + '</div>';
  }

  w.ESUpload = {
    SAMPLES: SAMPLES,
    mount: function (host, o) {
      host = typeof host === 'string' ? d.getElementById(host) : host;
      if (!host) return null;
      o = o || {};
      var kind = o.kind === 'job' ? 'job' : 'resume';
      var c = COPY[kind];
      var n = 'up' + (++uid);
      var data = null, fileName = '', timer = null;

      function mode() { var m = typeof o.mode === 'function' ? o.mode() : o.mode; return m === 'business' ? 'business' : 'facility'; }
      function q(sel) { return host.querySelector(sel); }
      function val(id) { var e = d.getElementById(n + id); return e ? e.value.trim() : ''; }

      host.classList.add('up');

      /* ---------- 1 · drop ---------- */
      function stage(x) { if (o.onStage) o.onStage(x); }

      function drop(err) {
        clearTimeout(timer);
        stage('drop');
        host.innerHTML =
            '<label class="up__drop" for="' + n + 'f">'
          +   '<svg class="up__ico" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">'
          +     '<path d="M14 3H6.5A1.5 1.5 0 005 4.5v15A1.5 1.5 0 006.5 21h11a1.5 1.5 0 001.5-1.5V8z"/><path d="M14 3v5h5"/><path d="M12 17v-6M9.5 13.5L12 11l2.5 2.5"/></svg>'
          +   '<b class="up__big">' + c.drop + '</b>'
          +   '<span class="up__or">or</span>'
          +   '<span class="btn btn--primary up__choose">Choose a file</span>'
          +   '<span class="up__fine">PDF or Word, up to 10MB</span>'
          +   '<input class="up__input" id="' + n + 'f" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document">'
          + '</label>'
          + '<p class="up__err" role="alert"' + (err ? '' : ' hidden') + '>' + (err || '') + '</p>'
          + (o.manual ? '<p class="up__alt"><button type="button" class="up__link">' + esc(o.manual) + '</button></p>' : '');

        var input = q('.up__input'), zone = q('.up__drop');
        input.addEventListener('change', function () { if (input.files && input.files[0]) take(input.files[0]); });
        ['dragenter', 'dragover'].forEach(function (ev) {
          zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.add('is-over'); });
        });
        ['dragleave', 'drop'].forEach(function (ev) {
          zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.remove('is-over'); });
        });
        zone.addEventListener('drop', function (e) {
          var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
          if (f) take(f);
        });
        var alt = q('.up__link');
        if (alt) alt.addEventListener('click', function () { if (o.onManual) o.onManual(); });
      }

      function take(file) {
        if (!OK.test(file.name)) {
          drop('We can only read PDF or Word files. Try saving your ' + c.noun + ' as a PDF.');
          return;
        }
        if (file.size > 10 * 1024 * 1024) { drop('That file is over 10MB. Try a smaller copy.'); return; }
        fileName = file.name;
        reading();
      }

      /* ---------- 2 · reading ---------- */
      function reading() {
        stage('reading');
        host.innerHTML =
            '<div class="up__reading" role="status" aria-live="polite">'
          +   '<span class="up__spin" aria-hidden="true"></span>'
          +   '<b>' + c.reading + '</b>'
          +   '<span class="up__file">' + esc(fileName) + '</span>'
          +   '<span class="up__bar" aria-hidden="true"><i></i></span>'
          + '</div>';
        var m = mode();
        data = clone(o.sample ? o.sample(kind, m) : SAMPLES[kind][m]);
        timer = setTimeout(review, 1500);
      }

      /* ---------- 3 · review ---------- */
      function review() {
        stage('review');
        var h = '<div class="up__head">'
          +   '<h2 class="up__title" tabindex="-1">Check what we pulled</h2>'
          +   '<p class="up__lede">' + c.lede + '</p>'
          +   '<p class="up__chip"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>'
          +     '<span>' + esc(fileName) + '</span><button type="button" class="up__link up__again">Use a different file</button></p>'
          + '</div>';

        if (kind === 'resume') {
          h += '<fieldset class="up__set"><legend>Your details</legend>'
            +  '<div class="form__row">' + field(n + 'name', 'Name', data.name, { auto: 'name' }) + field(n + 'phone', 'Phone', data.phone, { type: 'tel', auto: 'tel' }) + '</div>'
            +  '<div class="form__row">' + field(n + 'email', 'Email', data.email, { type: 'email', auto: 'email' }) + field(n + 'loc', 'Location', data.location) + '</div>'
            +  '</fieldset>';

          h += '<fieldset class="up__set"><legend>Work history</legend>';
          data.history.forEach(function (j, i) {
            h += '<div class="up__job"><p class="up__jobN">Employer ' + (i + 1) + '</p>'
              +  field(n + 'h' + i + 'role', 'Job title', j.role)
              +  '<div class="form__row">' + field(n + 'h' + i + 'emp', 'Employer name', j.employer) + field(n + 'h' + i + 'loc', 'Location', j.location) + '</div>'
              +  field(n + 'h' + i + 'dates', 'Dates', j.dates)
              +  '</div>';
          });
          h += '</fieldset>';

          h += '<fieldset class="up__set"><legend>Skills we recognized</legend>'
            +  '<p class="up__hint">We matched these to the skills employers search on. Untick anything that isn’t right.'
            +  (o.skillsNote ? ' ' + esc(o.skillsNote) : '') + '</p><div class="up__skills">';
          data.skills.forEach(function (s, i) {
            var g = (w.ROLES && w.ROLES.base() ? w.ROLES.base() : w.SKILLS);
            var group = g && g.groupOf ? g.groupOf(s.tag) : '';
            h += '<label class="up__skill"><input type="checkbox" id="' + n + 's' + i + '" checked>'
              +  '<span class="up__skillT"><b>' + esc(s.tag) + '</b>' + (group ? '<em>' + esc(group) + '</em>' : '') + '</span>'
              +  '<span class="up__heard">From “' + esc(s.heard) + '”</span></label>';
          });
          h += '</div></fieldset>';
        } else {
          h += '<fieldset class="up__set"><legend>The role</legend>'
            +  field(n + 'title', 'Job title', data.title)
            +  '<div class="form__row">' + field(n + 'loc', 'Location', data.location) + field(n + 'pay', 'Pay', data.pay) + '</div>'
            +  field(n + 'duties', 'Duties', data.duties, { rows: 4 })
            +  field(n + 'req', 'Requirements', data.requirements, { rows: 3 })
            +  field(n + 'ben', 'Benefits', data.benefits, { rows: 2 })
            +  '</fieldset>';
        }

        h += '<div class="ob__actions up__actions">'
          +  '<button type="button" class="btn btn--primary btn--lg up__go">Looks right, continue</button>'
          +  '</div>';
        host.innerHTML = h;
        q('.up__again').addEventListener('click', function () { drop(); var f = q('.up__input'); if (f) f.focus(); });
        q('.up__go').addEventListener('click', done);
        var t = q('.up__title'); if (t) t.focus({ preventScroll: true });
      }

      function done() {
        var out;
        if (kind === 'resume') {
          out = { file: fileName, name: val('name'), phone: val('phone'), email: val('email'), location: val('loc'),
            history: data.history.map(function (j, i) {
              return { role: val('h' + i + 'role'), employer: val('h' + i + 'emp'), location: val('h' + i + 'loc'),
                       dates: val('h' + i + 'dates'), did: j.did || '' };
            }),
            skills: data.skills.filter(function (s, i) { var e = d.getElementById(n + 's' + i); return e && e.checked; })
                               .map(function (s) { return s.tag; }) };
        } else {
          out = { file: fileName, title: val('title'), location: val('loc'), pay: val('pay'),
                  duties: val('duties'), requirements: val('req'), benefits: val('ben') };
        }
        if (o.onDone) o.onDone(out);
      }

      drop();
      return { reset: function () { drop(); }, mode: mode };
    },

    /* "$55,000 – $68,000 per year" -> { min:'55,000', max:'68,000', unit:'year' } */
    splitPay: function (s) {
      s = s || '';
      var nums = (s.match(/\d[\d,]*(?:\.\d+)?/g) || []).map(function (x) {
        var c = x.replace(/,/g, ''); var p = c.split('.');
        return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (p[1] ? '.' + p[1] : '');
      });
      var unit = (s.match(/\b(year|hour|week|month)\b/i) || [])[1];
      return { min: nums[0] || '', max: nums[1] || '', unit: unit ? unit.toLowerCase() : '' };
    }
  };
})(window, document);
