import type { Area } from "./sessionDetails";

export type BookingKind = "court-hire" | "session-only";

export type CourtBookingType = "app" | "website" | "schoolhire" | "enquiry";

export type BookableCourt = {
  id: string;
  name: string;
  venue: string;
  address: string;
  area: Area;
  bookingKind: BookingKind;
  bookingType: CourtBookingType;
  bookingUrl?: string;
  link?: string;
  phone?: string;
  email?: string;
  courtsCount?: number;
  priceNote?: string;
  availabilityNote?: string;
  notes?: string;
  relatedSessionIds?: string[];
  /** ISO date — last time maintainer checked links/prices. */
  lastVerified: string;
};

export const BOOKING_KIND_LABELS: Record<BookingKind, string> = {
  "court-hire": "Court hire",
  "session-only": "Organised session (not private hire)",
};

export const COURT_BOOKING_TYPE_LABELS: Record<CourtBookingType, string> = {
  app: "Book via app",
  website: "Book online",
  schoolhire: "SchoolHire",
  enquiry: "Enquire to book",
};

export const bookableCourts: BookableCourt[] = [
  {
    id: "court-mountbatten",
    name: "Mountbatten Centre — badminton",
    venue: "Mountbatten Centre",
    address: "Alex Way, Portsmouth PO2 9QA",
    area: "Portsmouth",
    bookingKind: "court-hire",
    bookingType: "website",
    bookingUrl: "https://bhliveactive.org.uk/find-an-activity/sports-timetable",
    link: "https://bhliveactive.org.uk/health-and-wellbeing-activities/no-string-badminton",
    phone: "023 9320 0401",
    email: "mountbatten@bhlive.org.uk",
    priceNote: "Pay-as-you-go — check BH Live for current court/session prices.",
    availabilityNote: "Book badminton via BH Live app or website, typically up to 7 days ahead.",
    notes: "Sports hall with badminton. Also hosts No Strings and over-50s racquet sessions.",
    relatedSessionIds: ["toffs"],
    lastVerified: "2026-10-12",
  },
  {
    id: "court-wimbledon-park",
    name: "Wimbledon Park Sports Centre — badminton",
    venue: "Wimbledon Park Sports Centre",
    address: "Taswell Road, Portsmouth PO5 2RG",
    area: "Southsea",
    bookingKind: "court-hire",
    bookingType: "website",
    bookingUrl: "https://bhliveactive.org.uk/find-an-activity/sports-timetable",
    link: "https://bhliveactive.org.uk/wimbledon-park",
    phone: "023 9320 0404",
    email: "wimbledon@bhlive.org.uk",
    courtsCount: 5,
    priceNote: "Check BH Live for PAYG court pricing.",
    availabilityNote:
      "Centre opening hours are limited (often closed Fri–Sun on BH Live site) — confirm before you travel.",
    lastVerified: "2026-10-12",
  },
  {
    id: "court-gosport-leisure",
    name: "Gosport Leisure Centre — badminton",
    venue: "Gosport Leisure Centre",
    address: "Forest Way, Gosport PO13 0ZX",
    area: "Gosport",
    bookingKind: "court-hire",
    bookingType: "website",
    bookingUrl:
      "https://www.placesleisure.org/centres/gosport-leisure-centre/centre-activities/sports/",
    link: "https://www.placesleisure.org/centres/gosport-leisure-centre/",
    phone: "02392 534950",
    courtsCount: 4,
    priceNote: "Court and No Strings prices on Places Leisure timetable.",
    availabilityNote: "Free Places account; pay-as-you-go can book up to 8 days ahead.",
    relatedSessionIds: ["gosport-no-strings"],
    lastVerified: "2026-10-12",
  },
  {
    id: "court-horizon-havant",
    name: "Horizon Havant — badminton court",
    venue: "Horizon Havant",
    address: "Civic Centre Road, Havant PO9 2AY",
    area: "Havant",
    bookingKind: "court-hire",
    bookingType: "website",
    bookingUrl: "https://horizonlc.com/havant-badminton/",
    link: "https://horizonlc.legendonlineservices.co.uk/enterprise/account/login",
    phone: "02392 476026",
    email: "havant@horizonlc.com",
    priceNote: "From £7 off-peak / £12.50 peak per hour (2026 price guide — confirm on booking).",
    availabilityNote:
      "Register for online booking (members 7 days ahead, non-members 2 days). Racquet and shuttle hire on site.",
    lastVerified: "2026-10-12",
  },
  {
    id: "court-westgate",
    name: "Westgate Leisure Centre — badminton",
    venue: "Westgate Leisure Centre",
    address: "Via Ravenna, Chichester PO19 1RJ",
    area: "Chichester",
    bookingKind: "court-hire",
    bookingType: "website",
    bookingUrl: "https://westgatebadminton.simplybook.it/v2/",
    link: "https://www.moreleisure.com/westgate-leisure-centre/timetables/",
    phone: "01243 785651",
    courtsCount: 6,
    priceNote: "Check SimplyBook or My MORE app for current rates.",
    availabilityNote: "Free MORE membership recommended for casual bookings.",
    lastVerified: "2026-10-12",
  },
  {
    id: "court-hamble-ea",
    name: "Hamble Sports Complex — sports hall",
    venue: "Hamble Sports Complex",
    address: "Satchell Lane, Hamble, Southampton SO31 4NE",
    area: "Hamble",
    bookingKind: "court-hire",
    bookingType: "website",
    bookingUrl: "https://www.everyoneactive.com/centre/hamble-sports-complex/",
    link: "https://www.everyoneactive.com/booking-with-us/",
    phone: "023 8235 2508",
    courtsCount: 4,
    priceNote: "Sports hall prices on Everyone Active — register for a pay-as-you-go card to book online.",
    availabilityNote: "Use Sports Hall booking on the Hamble centre page or Book/Pay on everyoneactive.com.",
    relatedSessionIds: ["hawks-sun"],
    lastVerified: "2026-10-12",
  },
  {
    id: "court-ravelin-uop",
    name: "Ravelin Sports Centre — badminton (public)",
    venue: "Ravelin Sports Centre",
    address: "Cambridge Road, Portsmouth PO1 2SE",
    area: "Portsmouth",
    bookingKind: "court-hire",
    bookingType: "app",
    bookingUrl: "https://sport.port.ac.uk/activities-and-bookings/indoor-sport",
    link: "https://sport.port.ac.uk/activities-and-bookings/pay-as-you-go-prices",
    email: "sport@port.ac.uk",
    priceNote: "55-minute badminton: about £7 members / £13.50 pay-as-you-go (confirm on site).",
    availabilityNote: "UoP Sport app or online booking; typically up to one week ahead.",
    relatedSessionIds: ["uop-play-sun"],
    lastVerified: "2026-10-12",
  },
  {
    id: "court-alns",
    name: "Admiral Lord Nelson School — sports hall",
    venue: "Admiral Lord Nelson School",
    address: "Dundas Lane, Portsmouth PO3 5XT",
    area: "Portsmouth",
    bookingKind: "court-hire",
    bookingType: "schoolhire",
    bookingUrl: "https://schoolhire.co.uk/portsmouth/alns/sports-hall/21755",
    priceNote: "About £35/hr per badminton court; full hall about £40/hr (SchoolHire — VAT may apply).",
    availabilityNote: "Lettings open 7 days; book via SchoolHire calendar.",
    relatedSessionIds: ["alns-rec"],
    lastVerified: "2026-10-12",
  },
  {
    id: "court-portsmouth-high",
    name: "Portsmouth High School — sports hall",
    venue: "Portsmouth High School",
    address: "25 Kent Road, Southsea, Portsmouth PO5 3EQ",
    area: "Southsea",
    bookingKind: "court-hire",
    bookingType: "schoolhire",
    bookingUrl: "https://schoolhire.co.uk/portsmouth/portsmouthhigh/sports-hall/33927",
    priceNote: "Full hall from about £37.80 weekday / £44.10 weekend per hour.",
    availabilityNote: "Badminton markings and posts; 7-day lettings.",
    lastVerified: "2026-10-12",
  },
  {
    id: "court-mayfield",
    name: "Mayfield School — sports hall",
    venue: "Mayfield School",
    address: "Mayfield Road, Portsmouth PO2 0RH",
    area: "Portsmouth",
    bookingKind: "court-hire",
    bookingType: "schoolhire",
    bookingUrl: "https://schoolhire.co.uk/portsmouth/mayfieldportsmouth/sports-hall/28887",
    priceNote: "About £30/hr for sports hall (SchoolHire).",
    lastVerified: "2026-10-12",
  },
  {
    id: "court-portsmouth-academy",
    name: "Portsmouth Academy — sports hall",
    venue: "Portsmouth Academy",
    address: "St Marys Road, Fratton, Portsmouth PO1 5PF",
    area: "Portsmouth",
    bookingKind: "court-hire",
    bookingType: "schoolhire",
    bookingUrl: "https://schoolhire.co.uk/portsmouth/portsmouth/sports-hall/28958",
    priceNote: "Full hall about £40/hr (term-time; extended hours in holidays).",
    lastVerified: "2026-10-12",
  },
  {
    id: "court-swanmore",
    name: "Swanmore College — sports hall",
    venue: "Swanmore College",
    address: "New Road, Swanmore, Southampton SO32 2RB",
    area: "Southampton",
    bookingKind: "court-hire",
    bookingType: "schoolhire",
    bookingUrl: "https://schoolhire.co.uk/southampton/swanmore-college/sports-hall/4051",
    priceNote: "See SchoolHire calendar for hourly rates.",
    lastVerified: "2026-10-12",
  },
  {
    id: "court-st-vincent",
    name: "St Vincent College — sports hall",
    venue: "St Vincent Leisure Centre",
    address: "Mill Lane, Gosport PO12 4QA",
    area: "Gosport",
    bookingKind: "court-hire",
    bookingType: "enquiry",
    link: "https://www.stvincent.ac.uk/facilities-for-hire/",
    phone: "023 9260 3560",
    email: "bookings@stvincent.ac.uk",
    courtsCount: 4,
    priceNote: "Published: about £8/hr per badminton court; whole hall about £25/hr.",
    availabilityNote: "Book via college facilities hire form or email — confirm badminton slot times.",
    lastVerified: "2026-10-12",
  },
];
