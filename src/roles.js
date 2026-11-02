/* ============================================================
   ROLES — Equine Facility roles vs Equine Business roles.
   ------------------------------------------------------------
   Kaitlin's business is now two kinds of placement: people who work
   with horses (grooms, riders, barn managers) and people who work in
   the horse industry (sales, marketing, insurance, feed). The resume
   builder and Post a job both open on a toggle between the two, and
   the fields follow it. This file holds the lists both pages share.

     ROLES.mountToggle(host, mode, onChange) — the segmented control
     ROLES.skillsFor(mode)  — a SKILLS-shaped view of Kaitlin's 186,
                              cut to the groups that fit the mode
     ROLES.DISCIPLINES / INDUSTRIES / LEVELS / TRAVEL / HOUSING
   ============================================================ */
(function (w, d) {
  'use strict';

  var LABELS = { facility: 'Equine Facility Roles', business: 'Equine Business Roles' };
  var HINTS  = { facility: 'Barns, farms, tracks and clinics', business: 'Sales, marketing and the companies around the horse' };

  // Horse disciplines from Evie's list (src/chat.js), less the ones that
  // are really industries; those live in INDUSTRIES below.
  var DISCIPLINES = ['Hunter / Jumper', 'Show jumping', 'Dressage', 'Eventing', 'Equitation', 'Reining',
    'Cutting', 'Barrel racing', 'Western pleasure', 'Polo', 'Thoroughbred racing', 'Quarter Horse racing',
    'Breeding', 'Equine assisted therapy', 'Veterinary medicine', 'General horse care'];

  var INDUSTRIES = ['Pharmaceutical sales', 'Feed & nutrition', 'Tack & equipment', 'Insurance',
    'Marketing', 'Technology', 'Veterinary', 'Other'];

  var LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'World-class'];

  var HOUSING = ['Not applicable', 'Private', 'Shared', 'Off-site help'];
  var TRAVEL  = ['None', 'Occasional', '25% or less', '50% or less', '75% or less', '76%+'];

  // Kaitlin's skill groups (src/skills.js), split by the kind of role.
  // Transport & travel sits in both: hauling is barn work, and the
  // travel percentages are what business roles ask about.
  var GROUPS = {
    facility: ['Riding & training', 'Teaching & coaching', 'Horse care & grooming',
      'Barn & program management', 'Breeding & sales prep', 'Racing & aftercare',
      'Veterinary, therapy & bodywork', 'Farrier & hoof care', 'Driving, hunting & specialty',
      'Property, facilities & equipment', 'Transport & travel'],
    business: ['Sales & business development', 'Marketing, media & events',
      'Finance, admin & people', 'Transport & travel']
  };

  var BASE = null;   // the full list, captured before anyone swaps window.SKILLS
  function base() { if (!BASE) BASE = w.SKILLS; return BASE; }
  function norm(s) { return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }

  function skillsFor(mode) {
    var src = base(); if (!src) return null;
    var groups = {}, all = [];
    (GROUPS[mode] || GROUPS.facility).forEach(function (g) {
      if (!src.groups[g]) return;
      groups[g] = src.groups[g];
      groups[g].forEach(function (s) { all.push({ name: s, group: g }); });
    });
    return {
      groups: groups, all: all, count: all.length,
      names: all.map(function (x) { return x.name; }),
      isAvailability: src.isAvailability, groupOf: src.groupOf,
      search: function (q) {
        var n = norm(q);
        if (!n) return all;
        return all.filter(function (x) { return norm(x.name).indexOf(n) > -1 || norm(x.group).indexOf(n) > -1; });
      }
    };
  }

  /* The segmented control. Real radio inputs, so arrow keys move between
     the two and a screen reader hears "1 of 2". */
  var uid = 0;
  function mountToggle(host, mode, onChange) {
    host = typeof host === 'string' ? d.getElementById(host) : host;
    if (!host) return;
    var name = 'roleKind' + (++uid);
    host.classList.add('rk');
    host.setAttribute('role', 'radiogroup');
    host.setAttribute('aria-label', 'Kind of role');
    host.innerHTML = ['facility', 'business'].map(function (m) {
      return '<label class="rk__opt"><input type="radio" name="' + name + '" value="' + m + '"'
        + (m === mode ? ' checked' : '') + '><span><b>' + LABELS[m] + '</b><small>' + HINTS[m] + '</small></span></label>';
    }).join('');
    host.querySelectorAll('input').forEach(function (i) {
      i.addEventListener('change', function () { if (i.checked && onChange) onChange(i.value); });
    });
  }

  w.ROLES = {
    LABELS: LABELS, DISCIPLINES: DISCIPLINES, INDUSTRIES: INDUSTRIES, LEVELS: LEVELS,
    HOUSING: HOUSING, TRAVEL: TRAVEL, GROUPS: GROUPS,
    skillsFor: skillsFor, mountToggle: mountToggle, base: base
  };
})(window, document);
