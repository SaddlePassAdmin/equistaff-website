/* EquiStaff Admin V1 — static shell for the design screens.
   Draws the left sidebar and top bar from one list so every screen
   matches. A page sets <body class="adm" data-page="jobs"> and puts its
   content in <main id="aPage">. Icons are inline strokes so they take
   currentColor like the rest of the site's icons. */
(function () {
  var I = {
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    inbox: '<path d="M3 13l3-8h12l3 8v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M3 13h5l1 3h6l1-3h5"/>',
    brief: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
    barn: '<path d="M3 21V10l9-6 9 6v11z"/><path d="M9 21v-6h6v6M9 11h6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
    pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/>',
    out: '<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    tag: '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="8" cy="8" r="1.5"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>'
  };
  function icon(n, cls) {
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (I[n] || '') + '</svg>';
  }
  window.AI = icon;

  // [key, label, icon, href, count, calm]
  var WORK = [
    ['dashboard', 'Dashboard', 'home', 'dashboard.html'],
    ['searches', 'Direct hire', 'star', 'searches.html', '6', true],
    ['leads', 'Leads', 'inbox', 'leads.html', '4'],
    ['jobs', 'Jobs', 'brief', 'jobs.html', '7'],
    ['media', 'Photos & videos', 'image', 'media.html', '5']
  ];
  var PEOPLE = [
    ['employers', 'Employers', 'barn', 'employers.html'],
    ['seekers', 'Job seekers', 'user', 'seekers.html'],
    ['subscriptions', 'Subscriptions & coupons', 'card', 'subscriptions.html']
  ];
  var SITE = [
    ['blog', 'Blog', 'pen', 'blog.html']
  ];

  function list(items, cur) {
    return '<ul class="aNav">' + items.map(function (it) {
      var c = it[4] ? '<span class="aCount' + (it[5] ? ' aCount--calm' : '') + '">' + it[4] + '</span>' : '';
      return '<li><a href="' + it[3] + '"' + (it[0] === cur ? ' aria-current="page"' : '') + '>' + icon(it[2]) + '<span>' + it[1] + '</span>' + c + '</a></li>';
    }).join('') + '</ul>';
  }

  function boot() {
    var b = document.body, cur = b.getAttribute('data-page'), page = document.getElementById('aPage');
    if (!page || b.hasAttribute('data-bare')) return;
    var shell = document.createElement('div');
    shell.className = 'aShell';
    shell.innerHTML =
      '<aside class="aSide" aria-label="Admin">' +
        '<a class="aSide__logo" href="dashboard.html"><img src="../assets/logo-lockup-thick.svg" alt="EquiStaff"></a>' +
        '<p class="aSide__tag">Admin</p>' +
        '<p class="aSide__group">Today’s work</p>' + list(WORK, cur) +
        '<p class="aSide__group">People & accounts</p>' + list(PEOPLE, cur) +
        '<p class="aSide__group">Website</p>' + list(SITE, cur) +
        '<div class="aSide__foot">' +
          list([['account', 'Account & password', 'key', 'account.html'], ['stripe', 'Open Stripe', 'ext', '#']], cur) +
          '<div class="aMe"><span class="aMe__av">ES</span><div><b>Recruiting Team</b><span>EquiStaff admin</span></div></div>' +
        '</div>' +
      '</aside>' +
      '<div class="aMain">' +
        '<header class="aTop">' +
          '<label class="aFind">' + icon('search') + '<input type="search" placeholder="Search people, companies, jobs or emails" aria-label="Search the admin"></label>' +
          '<div class="aTop__right"><a class="aTop__link" href="#">' + icon('ext') + 'View site</a>' +
          '<a class="aTop__link" href="signin.html">' + icon('out') + 'Sign out</a></div>' +
        '</header>' +
      '</div>';
    page.parentNode.insertBefore(shell, page);
    shell.querySelector('.aMain').appendChild(page);
    page.classList.add('aPage');
    // Any element with data-i="name" gets that icon prepended.
    [].forEach.call(document.querySelectorAll('[data-i]'), function (el) {
      el.insertAdjacentHTML('afterbegin', icon(el.getAttribute('data-i')));
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
