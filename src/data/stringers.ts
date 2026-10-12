import type { Area } from "./sessionDetails";

export type StringerServiceType = "shop" | "mobile" | "postal";

export type Stringer = {
  id: string;
  name: string;
  area: Area;
  areasServedNote?: string;
  serviceType: StringerServiceType;
  address?: string;
  contact?: string;
  phone?: string;
  email?: string;
  link?: string;
  brandsNote?: string;
  turnaroundNote?: string;
  priceNote?: string;
  notes?: string;
  lastVerified: string;
};

export const STRINGER_SERVICE_LABELS: Record<StringerServiceType, string> = {
  shop: "Shop / drop-off",
  mobile: "Collect & deliver",
  postal: "Post-in service",
};

export const stringers: Stringer[] = [
  {
    id: "stringer-jons",
    name: "Jon’s Racket Strings",
    area: "Fareham",
    areasServedNote: "Free pick-up & drop-off: PO1–PO8, PO12–PO17, SO31–SO32 (others on request).",
    serviceType: "mobile",
    address: "52 Hill Park Road, Fareham PO15 6HT",
    phone: "07976 517665",
    email: "jrstringers@gmail.com",
    link: "https://www.jonsracketstrings.co.uk/",
    brandsNote: "Ashaway, Yonex, Prince, Tecnifibre; other brands on request.",
    turnaroundNote: "Fast turn-around; calls 09:00–18:00.",
    priceNote: "Own strings from about £12; supplied strings from about £23 (see site).",
    notes: "Badminton-focused; also squash, tennis, racketball. Tournament stringing.",
    lastVerified: "2026-10-12",
  },
  {
    id: "stringer-racquet-depot",
    name: "Racquet Depot UK",
    area: "Havant",
    areasServedNote: "Shop in Emsworth; serves Portsmouth, Fareham, Havant, Chichester.",
    serviceType: "shop",
    address: "Unit 3, Station Approach, North Street, Emsworth PO10 7PW",
    phone: "01483 317122",
    email: "customer.services@racquetdepot.co.uk",
    link: "https://www.racquetdepot.co.uk/tennis-racquet-stringing-emsworth-havant-portsmouth-chichester-fareham/",
    brandsNote: "Large stocked range; badminton, tennis, squash.",
    turnaroundNote: "Standard about 2 working days; express option subject to availability.",
    priceNote: "From about £34 labour + string cost (standard service on site).",
    lastVerified: "2026-10-12",
  },
  {
    id: "stringer-southampton-stringing",
    name: "Southampton Stringing",
    area: "Southampton",
    areasServedNote: "Southampton and surrounding areas; pick-up/drop-off or collection.",
    serviceType: "mobile",
    address: "38 Pointout Road, Bassett, Southampton SO16 7DN",
    phone: "07557 400929",
    email: "southampton.stringing@gmail.com",
    link: "https://www.southamptonstringing.co.uk/",
    brandsNote: "Badminton: Yonex, Ashaway.",
    priceNote: "Badminton: £15 with your strings / from £18 with strings supplied.",
    lastVerified: "2026-10-12",
  },
  {
    id: "stringer-bassett",
    name: "Bassett Racquet Stringing",
    area: "Southampton",
    serviceType: "shop",
    address: "79 Glen Eyre Road, Southampton SO16 3NN",
    phone: "07717 471636",
    email: "bassettracquetstringing@gmail.com",
    brandsNote: "Badminton and tennis; hybrid setups available.",
    priceNote: "Contact for quote — often ~24hr turnaround reported.",
    lastVerified: "2026-10-12",
  },
  {
    id: "stringer-racket-shack",
    name: "The Racket Shack (Southampton)",
    area: "Southampton",
    serviceType: "shop",
    address: "Unit 82, Basepoint Enterprise Centre, Andersons Road, Southampton SO14 5FE",
    phone: "07769 214609",
    email: "info@racketshack.co.uk",
    link: "https://racketshack.co.uk/pages/racket-restringing-service",
    brandsNote: "Yonex badminton strings listed on site (e.g. BG65Ti, Exbolt).",
    priceNote: "Listed badminton restrings from about £23–£25.50 on site.",
    notes: "Drop racket at shop with short form.",
    lastVerified: "2026-10-12",
  },
  {
    id: "stringer-yc-postal",
    name: "YC Sports (post-in restring)",
    area: "Portsmouth",
    serviceType: "postal",
    link: "https://www.ycsports.com/products/copy-of-discounted-professional-restring",
    brandsNote: "Yonex strings; mail to Cardiff workshop.",
    priceNote: "From about £17 + postage; optional return label / racket box on order.",
    notes: "No Portsmouth shop front for stringing — post rackets to Cardiff. In-store stringing is Cardiff only.",
    lastVerified: "2026-10-12",
  },
  {
    id: "stringer-racket-shack-gosport",
    name: "Racket Shack (Gosport)",
    area: "Gosport",
    areasServedNote:
      "Shop at Alverstoke Tennis Club; collection and delivery across Hampshire and West Sussex.",
    serviceType: "mobile",
    address: "209 Privett Road, Gosport PO12 3ST",
    contact: "Dave",
    phone: "07801 422228",
    email: "dave@racket-shack.com",
    link: "https://racket-shack.com/",
    brandsNote: "Advice on string and tension; also rackets, grips, shoes.",
    turnaroundNote: "Reviews report badminton restrings back within 24 hours.",
    priceNote: "Contact for a quote.",
    notes: "Not the same business as The Racket Shack in Southampton.",
    lastVerified: "2026-10-12",
  },
  {
    id: "stringer-racquets-avenue",
    name: "Racquets @ The Avenue",
    area: "Havant",
    serviceType: "shop",
    address: "The Avenue LTSC, Southleigh Road, Havant PO9 2RS",
    contact: "Paul Skipp",
    phone: "07973 851762",
    email: "paul@racquet-avenue.co.uk",
    link: "https://www.racquet-avenue.co.uk/",
    turnaroundNote:
      "Open Mon, Wed, Fri, Sat 10 AM–1 PM; Tue and Thu by appointment. Call first — Paul travels to tournaments.",
    priceNote: "Contact for badminton pricing.",
    notes: "Professional stringer (Wimbledon head stringer). Mainly tennis — confirm badminton before you drop off.",
    lastVerified: "2026-10-12",
  },
  {
    id: "stringer-decathlon-portsmouth",
    name: "Decathlon Portsmouth",
    area: "Portsmouth",
    serviceType: "shop",
    address: "Binnacle Way, Portsmouth PO6 4FB",
    phone: "023 9241 4752",
    link: "https://www.decathlon.co.uk/",
    priceNote: "Ask in store.",
    notes:
      "Directories list racket stringing at this store, but it isn't confirmed on Decathlon's site — call before you go.",
    lastVerified: "2026-10-12",
  },
];
