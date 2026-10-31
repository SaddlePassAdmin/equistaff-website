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
  var KEY = 'equistaff.prototype.v4';   // bumped 31 Oct: seeded candidates added

  /* ---------- Candidates (31 Oct) ----------
     One list of people, read by every employer screen: the self-serve
     candidate search, the job-board profile, the applicants list, the
     managed shortlist and the candidate page. Before this they were typed
     into four pages separately and disagreed with each other.

     visibility: 'open'  — chose "Open to everyone", shows in candidate search
                 'quiet' — looking quietly, never shows in search
     source:     'site' — signed up on EquiStaff
                 'added_by_recruiter' — Kaitlin added them from a resume
     managed:    presented to a client on a recruiter-managed search.
     Activity dates are worked out from today, so the "days since" flags on
     the shortlist read the same whichever day the prototype is opened. */
  function ago(n) {
    var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - n);
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }
  function act(o) {
    return { presented: o.p != null ? ago(o.p) : null, reviewed: o.r != null ? ago(o.r) : null,
             interview: o.i != null ? ago(o.i) : null, interview2: o.i2 != null ? ago(o.i2) : null,
             offer: o.o != null ? ago(o.o) : null };
  }

  var CANDIDATES = [
    /* ---- Presented on the managed Barn Manager search ---- */
    { id: 'c-dana', name: 'Dana Whitfield', initials: 'DW', photo: 'img/people/dana.jpg',
      headline: 'Barn Manager', roleFamily: 'Grooms & Barn Staff', disciplines: ['Hunter / Jumper'],
      skills: ['Barn Manager (Medium Program)', 'Show Scheduling', 'Records Keeping', 'Grooming (FEI)', 'Trailering (3+ horse)', 'Schedule Management'],
      location: 'Ocala, FL', state: 'FL', availability: 'Available in 30 days', availWhen: '30',
      housing: 'Prefers on-site housing', needsHousing: true, visibility: 'open',
      resume: 'Dana-Whitfield-resume.pdf', hasMedia: true, media: ['img/barn-manager.jpg', 'img/aisle.jpg', 'img/groom.jpg'],
      goals: 'Run the day-to-day of a show barn where the horses come first and the schedule is planned a season ahead. Interested in a program that travels to WEF and HITS.',
      experience: [
        { employer: 'Live Oak Show Stables', location: 'Ocala, FL', role: 'Barn Manager', dates: '2019 – now', current: true,
          summary: 'Runs a 24-horse hunter/jumper barn: staff of five, feed and turnout plans, vet and farrier scheduling, and the show calendar.' },
        { employer: 'Brightwater Farm', location: 'Wellington, FL', role: 'Assistant Barn Manager', dates: '2016 – 2019',
          summary: 'Ran the barn on the road for the winter circuit. Shipped up to 18 horses a season.' }
      ],
      achievements: ['Cut barn injuries to zero over two show seasons', 'CDL-holder, tows a 6-horse gooseneck'],
      email: 'd.whitfield@example.com', phone: '(352) 555-0141', source: 'site', managed: true,
      stage: 'Interviewed', activity: act({ p: 10, r: 9, i: 3 }), contactReleased: false, claimed: true,
      kaitlinSpoke: 'Spoke to Dana on 14 October',
      kaitlinTake: [
        'Dana has run a 24-horse show barn for six years without a turnover problem, which is rarer than it sounds. Her current owner calls her the reason the barn still has its staff.',
        'She is leaving because the barn is being sold, not because anything has gone wrong. She would like on-site housing and is open about it. She will ask about the show calendar early, and that is a good sign.'
      ],
      references: [
        { who: 'Current barn owner', said: 'Confirmed dates, barn size and why she is moving. No concerns.', when: '15 OCT' },
        { who: 'Former head trainer, Brightwater Farm', said: '“Never once had to chase her on a vet appointment.”', when: '16 OCT' }
      ] },

    { id: 'c-marcus', name: 'Marcus Reyes', initials: 'MR', photo: 'img/people/marcus.jpg',
      headline: 'Facility Director', roleFamily: 'Show Facility Staff', disciplines: ['Hunter / Jumper', 'Dressage'],
      skills: ['Operations', 'Arena Maintenance', 'Barn Manager (Large Program)', 'Human Resources', 'Heavy Machinery Operation'],
      location: 'Wellington, FL', state: 'FL', availability: 'Available now', availWhen: 'now',
      housing: 'Has own housing', needsHousing: false, visibility: 'quiet',
      resume: 'Marcus-Reyes-resume.pdf', hasMedia: false, media: [],
      goals: 'A senior operations role at a single, well-run facility rather than a circuit venue.',
      experience: [
        { employer: 'Palm Circuit Equestrian Center', location: 'Wellington, FL', role: 'Facility Director', dates: '2018 – now', current: true,
          summary: 'Runs grounds, footing and stabling for a 300-stall venue. Team of fourteen.' },
        { employer: 'Grand Oak Farm', location: 'Ocala, FL', role: 'Barn Manager', dates: '2013 – 2018',
          summary: 'Managed a 40-horse private program and its staff.' }
      ],
      achievements: ['Rebuilt the footing on six rings without losing a show week'],
      email: 'm.reyes@example.com', phone: '(561) 555-0188', source: 'site', managed: true,
      stage: 'Reviewed', activity: act({ p: 8, r: 7 }), contactReleased: false, claimed: true,
      kaitlinSpoke: 'Spoke to Marcus on 16 October',
      kaitlinTake: [
        'Marcus is the strongest operator on this list and the least hands-on with horses day to day. If you want someone to run the place, he is the one. If you want someone in the aisle at 6am, he is not.',
        'He is employed and looking quietly, so his current venue stays unnamed until he agrees to an introduction.'
      ],
      references: [
        { who: 'Former farm owner, Grand Oak Farm', said: 'Confirmed five years and the size of the program. Would hire him again.', when: '17 OCT' }
      ] },

    { id: 'c-sarah', name: "Sarah O'Dell", initials: 'SO', photo: 'img/people/sarah.jpg',
      headline: 'Barn Manager', roleFamily: 'Grooms & Barn Staff', disciplines: ['Eventing'],
      skills: ['Barn Manager (Small Program)', 'Rehab Care', 'IM Medications', 'Pasture Maintenance', 'Clipping'],
      location: 'Lexington, KY', state: 'KY', availability: 'Available in 30 days', availWhen: '30',
      housing: 'Needs on-site housing', needsHousing: true, visibility: 'open',
      resume: 'Sarah-ODell-resume.pdf', hasMedia: true, media: ['img/groom.jpg', 'img/tack.jpg'],
      goals: 'Relocating to Ocala to be nearer family. Wants a barn with a rehab or young-horse side.',
      experience: [
        { employer: 'Bluegrass Eventing', location: 'Lexington, KY', role: 'Barn Manager', dates: '2020 – now', current: true,
          summary: 'Twelve-horse eventing barn with a rehab program. Runs layups, medication and turnout schedules.' },
        { employer: 'Chestnut Hill Stables', location: 'Versailles, KY', role: 'Head Groom', dates: '2017 – 2020',
          summary: 'Groomed at Novice through Intermediate.' }
      ],
      achievements: ['Brought three horses back from tendon injuries to competition'],
      email: 's.odell@example.com', phone: '(859) 555-0119', source: 'site', managed: true,
      stage: 'Presented', activity: act({ p: 6 }), contactReleased: false, claimed: true,
      kaitlinSpoke: 'Spoke to Sarah on 20 October',
      kaitlinTake: [
        'Smaller barn than yours, but the rehab work is the real thing. She is the most careful horsewoman on this list.',
        'The move to Ocala is already decided, so the relocation is not a risk.'
      ],
      references: [
        { who: 'Current barn owner', said: 'Confirmed dates. Sorry to lose her, supports the move.', when: '21 OCT' },
        { who: 'Treating vet', said: 'Described her layup records as the best kept in the county.', when: '22 OCT' }
      ] },

    { id: 'c-tom', name: 'Tom Brennan', initials: 'TB', photo: 'img/people/tom.jpg',
      headline: 'Farm & Barn Manager', roleFamily: 'Grooms & Barn Staff', disciplines: ['Hunter / Jumper', 'Racing / Thoroughbred'],
      skills: ['Barn Manager (Large Program)', 'Operations', 'Fence Repair', 'Tractor Maintenance', 'Yearling Sales Prep'],
      location: 'Aiken, SC', state: 'SC', availability: 'Available in 60 days', availWhen: '60',
      housing: 'Needs on-site housing', needsHousing: true, visibility: 'quiet',
      resume: 'Tom-Brennan-resume.pdf', hasMedia: false, media: [],
      goals: 'A long-term home with a program that values the land as much as the horses.',
      experience: [
        { employer: 'Private farm', location: 'Aiken, SC', role: 'Farm & Barn Manager', dates: '2015 – now', current: true,
          summary: 'Runs a 200-acre farm with 30 horses, the land, the equipment and a staff of six.' },
        { employer: 'Three Rivers Thoroughbreds', location: 'Camden, SC', role: 'Yearling Manager', dates: '2010 – 2015',
          summary: 'Prepped yearlings for the fall sales.' }
      ],
      achievements: ['Fifteen years with only two employers'],
      email: 't.brennan@example.com', phone: '(803) 555-0164', source: 'site', managed: true,
      stage: 'Offered', activity: act({ p: 11, r: 10, i: 7, i2: 2, o: 1 }), contactReleased: true, claimed: true,
      kaitlinSpoke: 'Spoke to Tom on 12 October',
      kaitlinTake: [
        'The most experienced person on this shortlist, and the one most likely to stay ten years.',
        'He needs sixty days to hand over properly, and will not cut that short. I would take that as a good sign.'
      ],
      references: [
        { who: 'Current farm owner', said: 'Confirmed ten years. “He will leave this place better than he found it.”', when: '13 OCT' },
        { who: 'Former employer, Three Rivers Thoroughbreds', said: 'Confirmed dates and role. No concerns.', when: '14 OCT' }
      ] },

    { id: 'c-lena', name: 'Lena Fischer', initials: 'LF', photo: 'img/people/lena.jpg',
      headline: 'Assistant Barn Manager', roleFamily: 'Grooms & Barn Staff', disciplines: ['Dressage'],
      skills: ['Grooming (FEI)', 'Braiding (Button)', 'Schedule Management', 'Bandaging (Standing/Polo)'],
      location: 'Ocala, FL', state: 'FL', availability: 'Available in 30 days', availWhen: '30',
      housing: 'Flexible', needsHousing: false, visibility: 'quiet',
      resume: 'Lena-Fischer-resume.pdf', hasMedia: false, media: [],
      goals: '',
      experience: [
        { employer: 'Dressage barn', location: 'Ocala, FL', role: 'Assistant Barn Manager', dates: '2021 – now', current: true,
          summary: 'Second in charge of a 16-horse FEI dressage barn.' }
      ],
      achievements: [],
      email: 'l.fischer@example.com', phone: '(352) 555-0177', source: 'added_by_recruiter', managed: true,
      stage: 'Presented', activity: act({ p: 2 }), contactReleased: false, claimed: false,
      kaitlinSpoke: 'Spoke to Lena on 27 October',
      kaitlinTake: [
        'Lena came to me by referral, not through the site. She is ready for her first barn of her own and has FEI grooming behind her.',
        'She has been invited to set up her EquiStaff profile. Until she does, you are seeing my summary and her resume.'
      ],
      references: [
        { who: 'Current head trainer', said: 'Confirmed role and dates. Ready to step up.', when: '28 OCT' }
      ] },

    /* ---- Applied to the Regional Sales Manager post (self-serve) ---- */
    { id: 'c-imogen', name: 'Imogen Clarke', initials: 'IC', photo: 'img/people/imogen.jpg',
      headline: 'Inside Sales', roleFamily: 'Sales / Customer Service / Marketing', disciplines: ['Hunter / Jumper'],
      skills: ['Inside Sales', 'Customer Service', 'Equine Sales', 'E-commerce', 'Social Media'],
      location: 'Gainesville, FL', state: 'FL', availability: 'Available now', availWhen: 'now',
      housing: 'Has own housing', needsHousing: false, visibility: 'open',
      resume: 'Imogen-Clarke-resume.pdf', hasMedia: false, media: [],
      goals: 'Move from inside sales to a territory of my own, selling products I actually use in the barn.',
      experience: [
        { employer: 'Saddle & Rein Outfitters', location: 'Gainesville, FL', role: 'Inside Sales Associate', dates: '2022 – now', current: true,
          summary: 'Phone and online sales for an equestrian retailer. Top of the team on repeat customers two years running.' }
      ],
      achievements: ['Rides and shows in the adult amateur hunters'],
      email: 'imogen.clarke@example.com', phone: '(352) 555-0102', source: 'site', managed: false, applied: ago(2), appStatus: 'New' },

    { id: 'c-tomas', name: 'Tomas Vieira', initials: 'TV', photo: 'img/people/tomas.jpg',
      headline: 'Territory Sales Representative', roleFamily: 'Sales / Customer Service / Marketing', disciplines: ['Western'],
      skills: ['Outside Sales', 'Distribution Sales', 'Account Management', 'Tradeshow', 'Cold Calling'],
      location: 'Ocala, FL', state: 'FL', availability: 'Available in 30 days', availWhen: '30',
      housing: 'Has own housing', needsHousing: false, visibility: 'open',
      resume: 'Tomas-Vieira-resume.pdf', hasMedia: false, media: [],
      goals: 'A larger territory with a feed or supplement brand that sells through distributors.',
      experience: [
        { employer: 'Southern States Feed Co.', location: 'Ocala, FL', role: 'Territory Sales Representative', dates: '2018 – now', current: true,
          summary: 'Central Florida feed and supplement sales to barns and farm stores.' },
        { employer: 'Ranch Supply Depot', location: 'Okeechobee, FL', role: 'Store Manager', dates: '2015 – 2018',
          summary: 'Ran a farm-and-ranch store with a staff of eight.' }
      ],
      achievements: ['Grew his territory every year for six years'],
      email: 't.vieira@example.com', phone: '(352) 555-0123', source: 'site', managed: false, applied: ago(3), appStatus: 'New' },

    { id: 'c-ruby', name: 'Ruby Nakamura', initials: 'RN', photo: 'img/people/ruby.jpg',
      headline: 'Marketing Coordinator', roleFamily: 'Sales / Customer Service / Marketing', disciplines: ['Dressage'],
      skills: ['Equine Marketing', 'Social Media', 'Copywriting', 'Photography', 'Graphic Design'],
      location: 'Asheville, NC', state: 'NC', availability: 'Available in 60 days', availWhen: '60',
      housing: 'Needs housing to relocate', needsHousing: true, visibility: 'open',
      resume: 'Ruby-Nakamura-resume.pdf', hasMedia: true, media: ['img/tack.jpg', 'img/trainer.jpg'],
      goals: 'Marketing for an equestrian brand, ideally one with a real story to tell.',
      experience: [
        { employer: 'Blue Ridge Tack Co.', location: 'Asheville, NC', role: 'Marketing Coordinator', dates: '2023 – now', current: true,
          summary: 'Runs social, email and product photography for a tack brand.' }
      ],
      achievements: ['Shot and edited the brand’s whole spring catalog'],
      email: 'ruby.n@example.com', phone: '(828) 555-0135', source: 'site', managed: false, applied: ago(4), appStatus: 'New' },

    { id: 'c-hallie', name: 'Hallie Brandt', initials: 'HB', photo: 'img/people/hallie.jpg',
      headline: 'Account Manager', roleFamily: 'Sales / Customer Service / Marketing', disciplines: ['Eventing'],
      skills: ['Account Management', 'B2B Sales', 'Customer Service', 'Vet Clinic Staff', 'Lead Generation'],
      location: 'Aiken, SC', state: 'SC', availability: 'Available in 30 days', availWhen: '30',
      housing: 'Has own housing', needsHousing: false, visibility: 'open',
      resume: 'Hallie-Brandt-resume.pdf', hasMedia: false, media: [],
      goals: 'Account management where I can stay close to the vets and barns I work with now.',
      experience: [
        { employer: 'Carolina Veterinary Supply', location: 'Aiken, SC', role: 'Account Manager', dates: '2017 – now', current: true,
          summary: 'Looks after about eighty equine practices across South Carolina and Georgia.' }
      ],
      achievements: ['Kept every one of her top twenty accounts through a supplier change'],
      email: 'h.brandt@example.com', phone: '(803) 555-0150', source: 'site', managed: false, applied: ago(5), appStatus: 'New' },

    { id: 'c-pete', name: 'Pete Donnelly', initials: 'PD', photo: 'img/people/pete.jpg',
      headline: 'Regional Sales Director', roleFamily: 'Sales / Customer Service / Marketing', disciplines: ['Eventing'],
      skills: ['Sales Management', 'Distribution Sales', 'Business Development', 'Account Management', 'Tradeshow'],
      location: 'Lexington, KY', state: 'KY', availability: 'Available in 60 days', availWhen: '60',
      housing: 'Has own housing', needsHousing: false, visibility: 'quiet',
      resume: 'Pete-Donnelly-resume.pdf', hasMedia: false, media: [],
      goals: 'Lead a regional team selling into barns and distributors in the Southeast.',
      experience: [
        { employer: 'Animal health company', location: 'Lexington, KY', role: 'Regional Sales Director', dates: '2019 – now', current: true,
          summary: 'Carries a seven-state Southeast territory and manages four territory reps.' },
        { employer: 'Bluegrass Animal Nutrition', location: 'Lexington, KY', role: 'Territory Manager', dates: '2014 – 2019',
          summary: 'Kentucky and Tennessee. Took the territory from ninth to second in the company.' }
      ],
      achievements: ['Competes in eventing at preliminary level'],
      email: 'p.donnelly@example.com', phone: '(859) 555-0172', source: 'site', managed: false, applied: ago(6), appStatus: 'Shortlisted' },

    { id: 'c-sofia', name: 'Sofia Marchetti', initials: 'SM', photo: 'img/people/sofia.jpg',
      headline: 'Customer Success Manager', roleFamily: 'Sales / Customer Service / Marketing', disciplines: ['Dressage'],
      skills: ['Customer Service', 'Account Management', 'E-commerce', 'Administrative'],
      location: 'Wellington, FL', state: 'FL', availability: 'Available in 30 days', availWhen: '30',
      housing: 'Has own housing', needsHousing: false, visibility: 'quiet',
      resume: 'Sofia-Marchetti-resume.pdf', hasMedia: false, media: [],
      goals: 'Move from software into a field role where I am out at the barns.',
      experience: [
        { employer: 'Equestrian software company', location: 'Wellington, FL', role: 'Customer Success Manager', dates: '2020 – now', current: true,
          summary: 'Onboards and supports barns using stable-management software.' }
      ],
      achievements: ['Drives, and happy to cover the whole state'],
      email: 's.marchetti@example.com', phone: '(561) 555-0109', source: 'site', managed: false, applied: ago(7), appStatus: 'Shortlisted' },

    { id: 'c-dale', name: 'Dale Whitcomb', initials: 'DW', photo: 'img/people/dale.jpg',
      headline: 'Barn Manager moving into sales', roleFamily: 'Sales / Customer Service / Marketing', disciplines: ['Hunter / Jumper'],
      skills: ['Barn Manager (Medium Program)', 'Equine Sales', 'Customer Service', 'Trailering (2-3 horse)'],
      location: 'Ocala, FL', state: 'FL', availability: 'Available now', availWhen: 'now',
      housing: 'Has own housing', needsHousing: false, visibility: 'open',
      resume: 'Dale-Whitcomb-resume.pdf', hasMedia: true, media: ['img/aisle.jpg'],
      goals: 'Use six years of running a barn to sell to the people who run barns.',
      experience: [
        { employer: 'Fox Run Farm', location: 'Ocala, FL', role: 'Barn Manager', dates: '2019 – now', current: true,
          summary: 'Runs a 20-horse boarding and training barn, including the feed and supply ordering.' }
      ],
      achievements: ['Negotiated the barn’s feed contract two years running'],
      email: 'dale.w@example.com', phone: '(352) 555-0158', source: 'site', managed: false, applied: ago(9), appStatus: 'Contacted' },

    { id: 'c-mara', name: 'Mara Ellison', initials: 'ME', photo: 'img/people/mara.jpg',
      headline: 'B2B Sales Executive', roleFamily: 'Sales / Customer Service / Marketing', disciplines: [],
      skills: ['B2B Sales', 'Outside Sales', 'Sales Management', 'Lead Generation'],
      location: 'Charlotte, NC', state: 'NC', availability: 'Available now', availWhen: 'now',
      housing: 'Has own housing', needsHousing: false, visibility: 'open',
      resume: 'Mara-Ellison-resume.pdf', hasMedia: false, media: [],
      goals: 'Bring a strong B2B record into a new industry.',
      experience: [
        { employer: 'Packaging supplier', location: 'Charlotte, NC', role: 'Sales Executive', dates: '2016 – now', current: true,
          summary: 'Industrial packaging sales across the Carolinas.' }
      ],
      achievements: [],
      email: 'mara.ellison@example.com', phone: '(704) 555-0127', source: 'site', managed: false, applied: ago(10), appStatus: 'Rejected' },

    { id: 'c-chris', name: 'Chris Udall', initials: 'CU', photo: 'img/people/chris.jpg',
      headline: 'Field Sales Representative', roleFamily: 'Sales / Customer Service / Marketing', disciplines: ['Western'],
      skills: ['Outside Sales', 'Cold Calling', 'Tradeshow', 'Equine Sales'],
      location: 'Tampa, FL', state: 'FL', availability: 'Available in 30 days', availWhen: '30',
      housing: 'Has own housing', needsHousing: false, visibility: 'open',
      resume: 'Chris-Udall-resume.pdf', hasMedia: false, media: [],
      goals: 'Field sales only, not inside.',
      experience: [
        { employer: 'Gulf Coast Trailers', location: 'Tampa, FL', role: 'Sales Representative', dates: '2020 – now', current: true,
          summary: 'Sells horse trailers at shows and on the lot.' }
      ],
      achievements: [],
      email: 'chris.udall@example.com', phone: '(813) 555-0131', source: 'site', managed: false, applied: ago(12), appStatus: 'Rejected' },

    /* ---- On EquiStaff, open to everyone, not applied to anything of yours ---- */
    { id: 'c-maya', name: 'Maya Ortiz', initials: 'MO', photo: null,
      headline: 'Show Groom', roleFamily: 'Grooms & Barn Staff', disciplines: ['Hunter / Jumper'],
      skills: ['Grooming (FEI)', 'Braiding (Hunters)', 'Clipping', 'Bandaging (Standing/Polo)', 'Travel 40-60%'],
      location: 'Wellington, FL', state: 'FL', availability: 'Available now', availWhen: 'now',
      housing: 'Needs on-site housing', needsHousing: true, visibility: 'open',
      resume: 'Maya-Ortiz-resume.pdf', hasMedia: true, media: ['img/groom.jpg', 'img/tack.jpg'], video: { src: 'media/hero.mp4', poster: 'media/hero-poster.jpg' },
      goals: 'Travel the circuit with one program for the whole year.',
      experience: [
        { employer: 'Harborview Hunters', location: 'Wellington, FL', role: 'Show Groom', dates: '2021 – now', current: true,
          summary: 'Grooms four horses on the A circuit, winter in Wellington and summer in the Northeast.' }
      ],
      achievements: ['Groomed a WCHR finalist', 'Braids a full show day of hunters on her own'],
      email: 'maya.ortiz@example.com', phone: '(561) 555-0193', source: 'site', managed: false },

    { id: 'c-jess', name: 'Jess Albright', initials: 'JA', photo: null,
      headline: 'Assistant Trainer', roleFamily: 'Riders / Trainers / Instructors', disciplines: ['Hunter / Jumper', 'Eventing'],
      skills: ['Assistant Trainer', 'Riding (Advanced)', 'Instructor (Intermediate)', 'Flat Rider', 'Over Fences Rider'],
      location: 'Aiken, SC', state: 'SC', availability: 'Available in 30 days', availWhen: '30',
      housing: 'Needs on-site housing', needsHousing: true, visibility: 'open',
      resume: 'Jess-Albright-resume.pdf', hasMedia: true, media: ['img/trainer.jpg'],
      goals: 'Ride and teach for a program with a strong young-horse string.',
      experience: [
        { employer: 'Whitehall Sport Horses', location: 'Aiken, SC', role: 'Assistant Trainer', dates: '2022 – now', current: true,
          summary: 'Rides six a day and teaches the junior riders.' }
      ],
      achievements: ['Brought two young horses to their first 1.20m classes'],
      email: 'jess.albright@example.com', phone: '(803) 555-0112', source: 'site', managed: false },

    { id: 'c-owen', name: 'Owen Pike', initials: 'OP', photo: null,
      headline: 'Equine Vet Technician', roleFamily: 'Veterinary Staff', disciplines: ['Racing / Thoroughbred'],
      skills: ['Vet Tech (Ambulatory)', 'IV Medications', 'IM Medications', 'Rehab Care'],
      location: 'Lexington, KY', state: 'KY', availability: 'Available in 60 days', availWhen: '60',
      housing: 'Has own housing', needsHousing: false, visibility: 'open',
      resume: 'Owen-Pike-resume.pdf', hasMedia: false, media: [],
      goals: 'An ambulatory practice with a sports-medicine caseload.',
      experience: [
        { employer: 'Keeneland Equine Clinic', location: 'Lexington, KY', role: 'Vet Technician', dates: '2019 – now', current: true,
          summary: 'Ambulatory tech for a racing and breeding practice.' }
      ],
      achievements: ['Licensed vet technician'],
      email: 'owen.pike@example.com', phone: '(859) 555-0146', source: 'site', managed: false },

    { id: 'c-keisha', name: 'Keisha Monroe', initials: 'KM', photo: null,
      headline: 'Show Secretary', roleFamily: 'Show Facility Staff', disciplines: ['Hunter / Jumper', 'Dressage'],
      skills: ['Show Scheduling', 'Administrative', 'Event Planning', 'Hospitality', 'Customer Service'],
      location: 'Tryon, NC', state: 'NC', availability: 'Available now', availWhen: 'now',
      housing: 'Flexible', needsHousing: false, visibility: 'open',
      resume: 'Keisha-Monroe-resume.pdf', hasMedia: false, media: [],
      goals: 'Year-round show office work at a single venue.',
      experience: [
        { employer: 'Foothills Horse Park', location: 'Tryon, NC', role: 'Show Secretary', dates: '2018 – now', current: true,
          summary: 'Runs entries, scheduling and the show office for a USEF venue.' }
      ],
      achievements: ['Ran the office for a 900-horse show week'],
      email: 'keisha.monroe@example.com', phone: '(828) 555-0168', source: 'site', managed: false }
  ];

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
      { id: 'a2', title: 'Facility Director', org: 'Eventing farm', where: 'Middleburg, VA',
        managed: true, status: 'Being reviewed', when: 'applied 5 days ago', disclosed: false },
      { id: 'a3', title: 'Head Groom', org: 'Clearwater Sport Horses', where: 'Lexington, KY',
        managed: false, status: 'Sent to barn', when: 'applied 1 week ago', disclosed: true }
    ],
    saved: [],
    resume: null,
    inquiries: [],
    posts: [
      { id: 'p1', title: 'Regional Sales Manager — Southeast', posted: 14, views: 112, applicants: 9, state: 'Live on the board' },
      { id: 'p2', title: 'Part-time Groom', posted: 41, views: 203, applicants: 2, state: 'Not performing' }
    ],
    ratings: {},
    notices: [],
    candidates: CANDIDATES,
    // The recruiter-managed search the shortlist belongs to. "applied" is how
    // many people Kaitlin considered for it, whichever way they came in.
    search: { id: 's-10480', title: 'Barn Manager', ref: '10480', opened: '18 September', applied: 27 }
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

    /* 29 Oct — closing used to be one-way. Employers rehire the same role
       several times a year, so a post is open or closed, not alive or dead. */
    setPostState: function (id, state) {
      var p = db.posts.find(function (x) { return x.id === id; });
      if (p) { p.state = state; commit(); }
      return p;
    },

    ratings: function () { return db.ratings; },
    rate: function (candidateId, stars, note) {
      db.ratings[candidateId] = { stars: stars, note: note || '', at: Date.now() };
      commit(); return db.ratings[candidateId];
    },

    /* ---------- candidates (31 Oct) ---------- */
    candidates: function () { return db.candidates; },
    candidate: function (id) {
      return db.candidates.find(function (c) { return c.id === id; }) || null;
    },
    // Only people who chose "Open to everyone" are searchable, and anyone
    // already presented on a managed search stays with that search.
    searchable: function () {
      return db.candidates.filter(function (c) { return c.visibility === 'open' && !c.managed; });
    },
    managedCandidates: function () { return db.candidates.filter(function (c) { return c.managed; }); },
    search: function () { return db.search; },
    setCandidate: function (id, patch) {
      var c = ES.candidate(id);
      if (c) { Object.assign(c, patch); commit(); }
      return c;
    },

    /* Days since a YYYY-MM-DD date, counted in whole calendar days. */
    daysSince: function (iso) {
      if (!iso) return null;
      var p = iso.split('-'), d = new Date(+p[0], +p[1] - 1, +p[2]);
      var t = new Date(); t.setHours(0, 0, 0, 0);
      return Math.round((t - d) / 86400000);
    },
    /* The latest step on a presented candidate and whether it has sat too
       long. More than three days with no next step is flagged. */
    idle: function (c) {
      var steps = [['offer', 'the offer'], ['interview2', 'the 2nd interview'], ['interview', 'the interview'],
                   ['reviewed', 'you reviewed'], ['presented', 'presented']];
      var a = c.activity || {};
      for (var i = 0; i < steps.length; i++) {
        if (a[steps[i][0]]) {
          var days = ES.daysSince(a[steps[i][0]]);
          var done = c.stage === 'Hired' || c.stage === 'Passed';
          return { step: steps[i][0], label: steps[i][1], days: days, flag: !done && days > 3,
                   text: days === 0 ? 'Updated today' : days + (days === 1 ? ' day' : ' days') + ' since ' + steps[i][1] };
        }
      }
      return null;
    },
    /* A client's decision on a presented candidate. Feedback is required
       on the screen; the rating stays optional. */
    decide: function (id, action, stars, note) {
      var c = ES.candidate(id);
      if (!c) return null;
      var today = (function () { var d = new Date(), m = d.getMonth() + 1, dd = d.getDate();
        return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (dd < 10 ? '0' : '') + dd; })();
      c.activity = c.activity || {};
      if (!c.activity.reviewed) c.activity.reviewed = today;
      if (action === 'interview') {
        if (!c.activity.interview) c.activity.interview = today; else c.activity.interview2 = today;
        c.stage = 'Interviewed';
      } else if (action === 'offer') {
        c.activity.offer = today; c.stage = 'Offered';
      } else if (action === 'pass') {
        c.stage = 'Passed';
      }
      c.decision = { action: action, at: Date.now() };
      ES.rate(id, stars || 0, note);
      commit(); return c;
    },

    /* Plain-text resume for the Download buttons, built from the record so
       every screen hands over the same document. */
    resumeText: function (c) {
      var L = [c.name.toUpperCase(), c.headline + ' · ' + c.location, c.email + ' · ' + c.phone, ''];
      if (c.goals) L.push('GOALS', c.goals, '');
      L.push('EXPERIENCE');
      (c.experience || []).forEach(function (x) {
        L.push(x.role + ' — ' + x.employer + ', ' + x.location + ' — ' + x.dates, '  ' + x.summary, '');
      });
      if (c.skills && c.skills.length) L.push('SKILLS', c.skills.join(' · '), '');
      if (c.achievements && c.achievements.length) L.push('ACHIEVEMENTS & EXTRAS', c.achievements.map(function (a) { return '- ' + a; }).join('\n'), '');
      L.push('Shared through EquiStaff · equine recruiting since 1982');
      return L.join('\n');
    },
    downloadResume: function (c) {
      return ES.download(c.resume.replace(/\.pdf$/, '') + '.txt', ES.resumeText(c));
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
