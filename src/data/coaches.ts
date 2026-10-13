import type { Area } from "./sessionDetails";

export type CoachServiceType = "private" | "academy" | "club-coach" | "school" | "online";

export type Coach = {
  id: string;
  /** Person or organisation name shown on the card. */
  name: string;
  /** Individual coach name when `name` is a club or academy (optional). */
  contact?: string;
  area: Area;
  areasServedNote?: string;
  serviceType: CoachServiceType;
  levelsNote: string;
  audienceNote?: string;
  venueNote?: string;
  address?: string;
  phone?: string;
  email?: string;
  link?: string;
  bookingUrl?: string;
  priceNote?: string;
  notes?: string;
  relatedSessionIds?: string[];
  lastVerified: string;
};

export const COACH_SERVICE_LABELS: Record<CoachServiceType, string> = {
  private: "Private / 1-to-1",
  academy: "Academy / programme",
  "club-coach": "Club & group sessions",
  school: "School / college programme",
  online: "Online coaching",
};

export const coaches: Coach[] = [
  {
    id: "coach-portsmouth-badminton-academy",
    name: "Portsmouth Badminton Academy",
    contact: "Ben Muir",
    area: "Portsmouth",
    areasServedNote: "Portsmouth, Southsea — Priory, Portsmouth High School, City of Portsmouth College.",
    serviceType: "academy",
    levelsNote: "Beginners through to competitive / county level (check each session).",
    audienceNote: "Adults and juniors — see booking for groups.",
    venueNote: "Priory School, Portsmouth High School, Sixth Form campus, and other venues on timetable.",
    bookingUrl: "https://benmuircoaching.simplybook.it/v2/",
    link: "http://www.benmuircoaching.co.uk/badmintoncoaching/",
    priceNote: "Prices on SimplyBook — community nights and group sessions vary.",
    relatedSessionIds: ["pba-priory", "pba-college", "southsea-wed"],
    lastVerified: "2026-10-13",
  },
  {
    id: "coach-ben-muir",
    name: "Ben Muir",
    area: "Southsea",
    areasServedNote: "1-to-1 mainly at Wimbledon Park Sports Centre; also club and team coaching by arrangement.",
    serviceType: "private",
    levelsNote: "Beginner to county and above.",
    audienceNote: "Individuals; club or university team coaching on request.",
    venueNote: "Wimbledon Park Sports Centre, Taswell Road, Portsmouth PO5 2RG (when courts available).",
    bookingUrl: "https://benmuircoaching.simplybook.it/v2/",
    link: "http://www.benmuircoaching.co.uk/book-a-1-to-1-session/",
    priceNote: "1-to-1 from about £35/session on booking site (confirm current rate).",
    notes: "Also runs Portsmouth Badminton Academy — see academy listing for group sessions.",
    lastVerified: "2026-10-13",
  },
  {
    id: "coach-bh-live",
    name: "BH Live Active",
    area: "Portsmouth",
    areasServedNote: "Portsmouth council leisure centres — Mountbatten, Charter, Wimbledon Park, and others.",
    serviceType: "club-coach",
    levelsNote: "Varies by activity — mostly participation and junior multi-sport, not elite coaching.",
    audienceNote: "Children’s after-school activities, adults in social sessions; swim lessons separate.",
    venueNote: "Mountbatten Centre (PO2 9QA), Charter Community Sports Centre (PO5 4LF), etc.",
    bookingUrl: "https://bhliveactive.org.uk/find-an-activity/sports-timetable",
    link: "https://bhliveactive.org.uk/mountbatten",
    phone: "023 9320 0401",
    email: "mountbatten@bhlive.org.uk",
    priceNote: "Activity prices on BH Live timetable (e.g. junior after-school sessions about £6.50).",
    notes:
      "No standalone badminton lesson timetable on site — enquire at reception for junior activities and racquet sports. No Strings is social play, not coached lessons.",
    relatedSessionIds: ["charter-no-strings", "toffs"],
    lastVerified: "2026-10-13",
  },
  {
    id: "coach-toby-brazier",
    name: "Toby Brazier Coaching",
    contact: "Toby Brazier",
    area: "Portsmouth",
    areasServedNote: "Portsmouth, Havant, Gosport, Fareham, Chichester, Petersfield and nearby (travel fees may apply).",
    serviceType: "club-coach",
    levelsNote: "Beginners and intermediate; private lessons for wider levels.",
    audienceNote: "Juniors and adults — clubs, schools, private clients.",
    venueNote: "Charter, Mountbatten, Havant leisure centres, HSDC campuses, and others — see website timetable.",
    email: "tobybraziercoaching@gmail.com",
    link: "https://www.tobybraziercoaching.com/sessions",
    priceNote: "Private lessons from about £30–£45/hr depending on coach and package (see website).",
    notes:
      "Runs Shuttle Stars juniors, Havant Hornets, improver sessions, and group coaching for clubs. Team includes additional coaches under the brand.",
    relatedSessionIds: ["charter-no-strings", "sport-in-mind"],
    lastVerified: "2026-10-13",
  },
  {
    id: "coach-hampshire-county",
    name: "Hampshire County Badminton — squad coaching",
    contact: "Mark Peckham (juniors) / Ollie Baczala (seniors)",
    area: "Chichester",
    areasServedNote: "County squad players — training at Westgate, Hiltingbury, and other halls.",
    serviceType: "club-coach",
    levelsNote: "Performance / county squad — invite only, not beginner lessons.",
    audienceNote: "Junior and senior county players selected for Hampshire squads.",
    venueNote: "Westgate Leisure Centre (Chichester), Hiltingbury Sports Pavilion, etc.",
    link: "https://hampshirebadminton.net/contacts/",
    email: "redrooster.mp@gmail.com",
    phone: "07880 705935",
    priceNote: "Senior invite sessions about £10 (own feather shuttles); junior squad — contact county.",
    notes:
      "For squad places contact Mark Peckham (redrooster.mp@gmail.com, 07880 705935) or Ollie Baczala (olliebaczala@gmail.com, 07975 793935). General county enquiries: secretary@hantsbadminton.net.",
    lastVerified: "2026-10-13",
  },
];
