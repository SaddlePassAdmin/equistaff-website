/* ============================================================
   Navigation — defined once
   ------------------------------------------------------------
   The header had drifted into six different versions across thirty pages:
   "How we work" on some, "Pricing" on others, three different job-seeker
   portals. This renders one of three navs from a single definition, marks
   the current page automatically, and keeps the whole thing reachable on a
   phone — the portal nav used to be display:none under 680px, which left
   mobile portal users with no way to move around at all.

   A page opts in with <div id="nav" data-nav="seeker"></div>.
   ============================================================ */
(function (w, d) {
  'use strict';

  var NAVS = {
    public: {
      portal: false,
      logo: 'assets/logo-lockup-thick.svg',
      items: [
        ['jobs.html', 'Find work'],
        ['request-talent.html', 'Hire staff'],
        ['pricing.html', 'Pricing'],
        ['about.html', 'About'],
        ['contact.html', 'Contact']
      ],
      cta: [['signin.html', 'Sign in', false], ['request-talent.html', 'Request talent', true]]
    },
    seeker: {
      portal: true,
      logo: 'assets/logo-lockup-thick-reversed.svg',
      items: [
        ['jobs.html', 'Find work'],
        ['profile.html', 'Profile'],
        ['applications.html', 'Applications'],
        ['saved.html', 'Saved'],
        ['messages.html', 'Messages'],
        ['settings.html', 'Settings']
      ],
      avatar: 'DW', avatarTitle: 'Dana Whitfield'
    },
    employer: {
      portal: true,
      logo: 'assets/logo-lockup-thick-reversed.svg',
      items: [
        ['employer.html', 'Your searches'],
        ['my-jobs.html', 'Job posts'],
        ['billing.html', 'Billing'],
        ['company.html', 'Company'],
        ['messages.html', 'Messages']
      ],
      avatar: 'GO', avatarTitle: 'Golden Ocala Equestrian',
      cta: [['post-job.html', 'Post a job', true]]
    }
  };

  function here() {
    var p = location.pathname.split('/').pop();
    return p || 'index.html';
  }

  // A page counts as "current" for its own file, and for the pages that are
  // really sub-views of it — a candidate profile is part of the shortlist.
  var ALIAS = {
    'candidate.html': 'employer.html',
    'applicants.html': 'my-jobs.html',
    'post-job.html': 'my-jobs.html',
    'resume.html': 'profile.html',
    'job-detail.html': 'jobs.html',
    'onboarding.html': 'jobs.html',
    'book.html': 'contact.html',
    'blog-post.html': 'blog.html'
  };

  function render(mount, key) {
    var n = NAVS[key];
    if (!n) return;
    var cur = here();
    var me = ALIAS[cur] || cur;

    var links = n.items.map(function (it) {
      var on = (it[0] === me);
      return '<a href="' + it[0] + '"' + (on ? ' aria-current="page"' : '') + '>' + it[1] + '</a>';
    }).join('');

    var cta = '';
    if (n.cta) {
      cta = '<div class="' + (n.portal ? 'pHdr__cta' : 'hdr__cta') + '">' + n.cta.map(function (c) {
        return c[2]
          ? '<a class="btn btn--primary" href="' + c[0] + '">' + c[1] + '</a>'
          : '<a class="hdr__plain" href="' + c[0] + '">' + c[1] + '</a>';
      }).join('') + '</div>';
    }

    // On a phone the public links don't fit in the bar, and a swipe row was
    // spilling out of the header on top of the page (29 Oct mobile audit).
    // So below 760px they move into a Menu panel — Sign in included, since
    // the bar itself only has room for "Request talent".
    var menu = '';
    if (!n.portal) {
      var all = n.items.concat((n.cta || []).filter(function (c) { return !c[2]; }));
      menu =
        '<button class="hdr__menu" type="button" aria-expanded="false" aria-controls="hdrPanel">' +
          '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">' +
            '<path class="hdr__menuOpen" d="M4 7h16M4 12h16M4 17h16"/><path class="hdr__menuClose" d="M6 6l12 12M18 6L6 18"/></svg>' +
          '<span>Menu</span></button>';
      var panelLinks = all.map(function (it) {
        var on = (it[0] === me);
        return '<a href="' + it[0] + '"' + (on ? ' aria-current="page"' : '') + '>' + it[1] + '</a>';
      }).join('');
      menu += '<div class="hdr__panel" id="hdrPanel" hidden><nav aria-label="Menu">' + panelLinks + '</nav></div>';
    }

    var right = n.portal
      ? (cta + '<div class="avatar" title="' + n.avatarTitle + '">' + n.avatar + '</div>')
      : cta + menu;

    mount.outerHTML =
      '<header class="' + (n.portal ? 'pHdr' : 'hdr') + '">' +
        '<div class="wrap ' + (n.portal ? 'pHdr__in' : 'hdr__in') + '">' +
          '<a class="' + (n.portal ? 'pHdr__logo' : 'hdr__logo') + '" href="' +
            (n.portal ? 'profile.html' : 'index.html') + '">' +
            '<img src="' + n.logo + '" alt="EquiStaff">' +
          '</a>' +
          '<nav class="' + (n.portal ? 'pHdr__nav' : 'hdr__nav') + '" aria-label="Main">' + links + '</nav>' +
          right +
        '</div>' +
      '</header>';
  }

  function wireMenu() {
    var btn = d.querySelector('.hdr__menu'), panel = d.getElementById('hdrPanel');
    if (!btn || !panel) return;
    function set(open) {
      panel.hidden = !open;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.querySelector('span').textContent = open ? 'Close' : 'Menu';
      d.documentElement.classList.toggle('menu-open', open);
    }
    btn.addEventListener('click', function () { set(panel.hidden); if (!panel.hidden) { var a = panel.querySelector('a'); if (a) a.focus(); } });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { set(false); btn.focus(); } });
    d.addEventListener('click', function (e) { if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) set(false); });
    // Rotating a tablet past the breakpoint shouldn't leave the panel open.
    if (w.matchMedia) w.matchMedia('(min-width: 761px)').addEventListener('change', function (m) { if (m.matches) set(false); });
  }

  function boot() {
    var mount = d.getElementById('nav');
    if (!mount) return;
    render(mount, mount.getAttribute('data-nav') || 'public');
    wireMenu();
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window, document);
