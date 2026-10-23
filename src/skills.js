/* ============================================================
   SKILLS — Kaitlin's list of 186, grouped.
   ------------------------------------------------------------
   She sent it alphabetically, which is the wrong order for a human:
   "Accounts Payable" sat next to "Acupressure". These are the same
   186 skills in fourteen groups, nothing added and nothing dropped.

   The important thing the grouping shows: roughly a quarter of her
   list is not barn work at all. Sales, marketing, finance, admin and
   media account for 41 of the 186, which matches what she told us in
   September — the last three years have been leadership and
   white-collar placements, most above $60k. A picker that only shows
   grooming and clipping would hide a quarter of her business.

   One source of truth. The resume builder, the profile and the
   employer-side search all read from here.
   ============================================================ */
(function (w) {
  'use strict';

  var GROUPS = {
    "Riding & training": [
        "Riding (Beginner)",
        "Riding (Intermediate)",
        "Riding (Advanced)",
        "Riding (World-Class)",
        "Trainer (Beginner)",
        "Trainer (Intermediate)",
        "Trainer (Advanced)",
        "Trainer (FEI)",
        "Trainer (Young Horse)",
        "Assistant Trainer",
        "Freelance Rider/Trainer",
        "Flat Rider",
        "Over Fences Rider",
        "Pony Rider",
        "Jockey",
        "Working Student",
        "Trick Rider",
        "Lunging"
    ],
    "Teaching & coaching": [
        "Instructor (Beginner)",
        "Instructor (Intermediate)",
        "Instructor (Advanced)",
        "Instructor (FEI)",
        "Coaching",
        "Camp Counselor",
        "Camp Director",
        "PATH Certification",
        "EGALA Certification",
        "Public Speaking"
    ],
    "Horse care & grooming": [
        "Stall Cleaning",
        "Grooming (Basic)",
        "Grooming (Intermediate)",
        "Grooming (FEI)",
        "Freelance Groom",
        "Clipping",
        "Braiding (Button)",
        "Braiding (Hunters)",
        "Bandaging (Standing/Polo)",
        "Hotwalker",
        "Foal Handling",
        "Broodmare & Foal Care",
        "Stallion Handling",
        "Emergency Handling",
        "Halter/Showmanship"
    ],
    "Barn & program management": [
        "Barn Manager (Small Program)",
        "Barn Manager (Medium Program)",
        "Barn Manager (Large Program)",
        "Barn Manager (Show Manager)",
        "Operations",
        "Program Development",
        "Records Keeping",
        "Schedule Management",
        "Show Scheduling",
        "Seasonal Work"
    ],
    "Breeding & sales prep": [
        "Breeding (AI)",
        "Breeding (Live Cover)",
        "Breeding (Foal Watch)",
        "Breeding (Foaling)",
        "Semen Analysis",
        "2yo Sales Prep",
        "Yearling Sales Prep",
        "Thoroughbred Sales Handling",
        "Bloodstock Agent"
    ],
    "Racing & aftercare": [
        "Thoroughbred Racing",
        "Standardbred Racing",
        "Quarter Horse Racing",
        "Thoroughbred Aftercare (OTTB Retraining)",
        "Thoroughbred Aftercare (Rehab)",
        "Track Maintenance"
    ],
    "Veterinary, therapy & bodywork": [
        "Veterinarian",
        "Surgeon",
        "Internal Medicine",
        "Sports Medicine",
        "Vet Tech (Ambulatory)",
        "Vet Tech (Repro)",
        "Vet Tech (Surgery)",
        "Vet Clinic Staff",
        "Practice Manager",
        "IM Medications",
        "IV Medications",
        "Oral Medications",
        "Dental (Hand Float)",
        "Dental (Power Float)",
        "Rehab Care",
        "Acupressure",
        "Acupuncture",
        "Osteopath",
        "Myofascial Release",
        "Kinesiotaping",
        "Energy Healing",
        "Wellness Devices (BEMER/Magnawave/Theraplate)",
        "Swimming/Aquatred Operation",
        "Podiatry",
        "ISELP",
        "Nutrition Consultant",
        "Kennel Technician"
    ],
    "Farrier & hoof care": [
        "Cold Shoeing",
        "Hot Shoeing",
        "Corrective Shoeing",
        "Journeyman Farrier"
    ],
    "Driving, hunting & specialty": [
        "Carriage Driving",
        "Combined Driving",
        "Driving (Single)",
        "Driving (Pairs)",
        "Driving (4-in-hand)",
        "Driving (Fine Harness)",
        "Foxhunting (1st Flight)",
        "Fox Hunting (2nd Flight)",
        "Foxhunting (3rd Flight)",
        "Huntsman",
        "Whipper-In",
        "Roping (Header)",
        "Roping (Heeler)",
        "Jousting",
        "Dinner Theatre",
        "Trail Guiding",
        "Course Design",
        "Horse Show Judging",
        "Saddle Fitter (Foam)",
        "Saddle Fitter (Wool)"
    ],
    "Property, facilities & equipment": [
        "Arena Maintenance",
        "Arena Building",
        "Construction (Arena)",
        "Construction (Barn)",
        "Construction (Other)",
        "Contractor",
        "Architecture and Design",
        "Fence Building",
        "Fence Repair",
        "Pasture Maintenance",
        "Lawn Equipment Operation",
        "Heavy Machinery Operation",
        "Heavy Machinery Maintenance",
        "Tractor Maintenance",
        "Forklift Driver",
        "Security",
        "Farming (Cattle)",
        "Farming (Crops)",
        "Farming (Dairy)",
        "Farming (Other)"
    ],
    "Transport & travel": [
        "Trailering (2-3 horse)",
        "Trailering (3+ horse)",
        "Trailering (Professional Hauler)",
        "Travel 20-40%",
        "Travel 40-60%",
        "Travel 60%+"
    ],
    "Sales & business development": [
        "B2B Sales",
        "B2C Sales",
        "Inside Sales",
        "Outside Sales",
        "Distribution Sales",
        "Equine Sales",
        "Sales Management",
        "Business Development",
        "Account Management",
        "Lead Generation",
        "Cold Calling",
        "E-commerce",
        "Tradeshow"
    ],
    "Marketing, media & events": [
        "Equine Marketing",
        "Brand Management",
        "Social Media",
        "SEO Management",
        "Influencer Management",
        "Copywriting",
        "Blogging",
        "Graphic Design",
        "Website Design",
        "Photography",
        "Videographer",
        "Print Media",
        "Publication",
        "Event Planning"
    ],
    "Finance, admin & people": [
        "Accounts Payable",
        "Accounts Receivable",
        "General Accountant",
        "Financial Reporting",
        "Administrative",
        "Executive Assistant",
        "Personal Assistant",
        "Human Resources",
        "Legal",
        "Customer Service",
        "Hospitality",
        "Research",
        "Fundraising",
        "Corporate Leadership"
    ]
};

  // Travel and seasonal sit in the list but are availability, not ability.
  // Flagged so a screen can treat them differently if it wants to.
  var AVAILABILITY = ['Travel 20-40%', 'Travel 40-60%', 'Travel 60%+', 'Seasonal Work'];

  var ALL = [];
  Object.keys(GROUPS).forEach(function (g) {
    GROUPS[g].forEach(function (s) { ALL.push({ name: s, group: g }); });
  });

  function norm(s) { return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }

  w.SKILLS = {
    groups: GROUPS,
    all: ALL,
    names: ALL.map(function (x) { return x.name; }),
    count: ALL.length,
    isAvailability: function (s) { return AVAILABILITY.indexOf(s) > -1; },
    groupOf: function (s) { var f = ALL.filter(function (x) { return x.name === s; })[0]; return f && f.group; },
    search: function (q) {
      var n = norm(q);
      if (!n) return ALL;
      return ALL.filter(function (x) { return norm(x.name).indexOf(n) > -1 || norm(x.group).indexOf(n) > -1; });
    }
  };
})(window);
