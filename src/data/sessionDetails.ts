import { badmintonSessions, type BadmintonSession } from "./sessions";

export type Area =
  | "Portsmouth"
  | "Southsea"
  | "Gosport"
  | "Fareham"
  | "Portchester"
  | "Havant"
  | "Waterlooville"
  | "Horndean"
  | "Locks Heath"
  | "Hamble"
  | "Botley"
  | "Chichester"
  | "Bognor"
  | "Selsey"
  | "Petersfield"
  | "Southampton"
  | "Chandler's Ford"
  | "Clanfield"
  | "Southbourne"
  | "Bracklesham";

export type PlayerLevel =
  | "beginner"
  | "improver"
  | "intermediate"
  | "advanced"
  | "league"
  | "all-levels";

export type SessionKind =
  | "social"
  | "club"
  | "starter"
  | "drop-in"
  | "no-strings"
  | "university"
  | "pay-and-play";

export type PlayFormat = "doubles" | "singles" | "mixed";

export type SessionDetails = {
  area: Area;
  playerLevels: PlayerLevel[];
  kinds: SessionKind[];
  formats: PlayFormat[];
  /** Session explicitly not for beginners (still shown for other filters). */
  excludesBeginners?: boolean;
};

export const AREA_ORDER: Area[] = [
  "Portsmouth",
  "Southsea",
  "Gosport",
  "Fareham",
  "Portchester",
  "Havant",
  "Waterlooville",
  "Horndean",
  "Locks Heath",
  "Hamble",
  "Botley",
  "Chichester",
  "Bognor",
  "Selsey",
  "Petersfield",
  "Southampton",
  "Chandler's Ford",
  "Clanfield",
  "Southbourne",
  "Bracklesham",
];

export const PLAYER_LEVEL_LABELS: Record<PlayerLevel, string> = {
  beginner: "Beginner",
  improver: "Improver",
  intermediate: "Intermediate",
  advanced: "Advanced",
  league: "League standard",
  "all-levels": "All levels welcome",
};

export const SESSION_KIND_LABELS: Record<SessionKind, string> = {
  social: "Social",
  club: "Club night",
  starter: "Starter / learning",
  "drop-in": "Drop-in",
  "no-strings": "No Strings",
  university: "University / student",
  "pay-and-play": "Pay & play",
};

export const PLAY_FORMAT_LABELS: Record<PlayFormat, string> = {
  doubles: "Doubles",
  singles: "Singles",
  mixed: "Mixed",
};

const detailsById: Record<string, SessionDetails> = {
  "alns-rec": {
    area: "Portsmouth",
    playerLevels: ["improver", "intermediate", "advanced"],
    kinds: ["pay-and-play", "social"],
    formats: ["doubles", "mixed"],
  },
  toffs: {
    area: "Portsmouth",
    playerLevels: ["all-levels"],
    kinds: ["social", "drop-in"],
    formats: ["doubles", "mixed"],
  },
  "portchester-cc-mon": {
    area: "Portchester",
    playerLevels: ["all-levels"],
    kinds: ["drop-in", "social"],
    formats: ["doubles"],
  },
  "team-bombay": {
    area: "Southsea",
    playerLevels: [],
    kinds: ["club"],
    formats: ["doubles"],
  },
  "gosport-no-strings": {
    area: "Gosport",
    playerLevels: ["all-levels"],
    kinds: ["no-strings", "social"],
    formats: ["doubles", "mixed"],
  },
  "chichester-bc": {
    area: "Chichester",
    playerLevels: ["beginner", "improver", "intermediate", "league"],
    kinds: ["club", "social"],
    formats: ["doubles"],
  },
  "selsey-mon": {
    area: "Selsey",
    playerLevels: ["all-levels"],
    kinds: ["social"],
    formats: ["doubles", "mixed"],
  },
  "smashing-mondays": {
    area: "Portsmouth",
    playerLevels: ["improver", "intermediate"],
    kinds: ["club", "social"],
    formats: ["doubles"],
  },
  "portchester-cc-tue-am": {
    area: "Portchester",
    playerLevels: ["all-levels"],
    kinds: ["drop-in"],
    formats: ["doubles"],
  },
  "westgate-no-strings": {
    area: "Chichester",
    playerLevels: ["all-levels"],
    kinds: ["no-strings", "social"],
    formats: ["doubles", "mixed"],
  },
  "portchester-bc": {
    area: "Portchester",
    playerLevels: ["improver", "intermediate", "advanced"],
    kinds: ["pay-and-play", "social"],
    formats: ["doubles"],
    excludesBeginners: true,
  },
  "gosport-starter": {
    area: "Gosport",
    playerLevels: ["beginner", "improver"],
    kinds: ["starter", "social"],
    formats: ["doubles"],
  },
  lockswood: {
    area: "Locks Heath",
    playerLevels: ["advanced", "intermediate"],
    kinds: ["club"],
    formats: ["doubles"],
  },
  bosham: {
    area: "Chichester",
    playerLevels: ["intermediate", "improver"],
    kinds: ["social", "club"],
    formats: ["doubles"],
  },
  "pba-priory": {
    area: "Southsea",
    playerLevels: ["improver", "intermediate"],
    kinds: ["social", "pay-and-play"],
    formats: ["doubles"],
  },
  "pompey-tue": {
    area: "Horndean",
    playerLevels: ["intermediate", "advanced"],
    kinds: ["club"],
    formats: ["doubles"],
  },
  "u3a-improvers": {
    area: "Waterlooville",
    playerLevels: ["improver", "intermediate"],
    kinds: ["social", "drop-in"],
    formats: ["doubles"],
  },
  "havant-casual": {
    area: "Havant",
    playerLevels: ["all-levels"],
    kinds: ["drop-in", "social", "pay-and-play"],
    formats: ["doubles", "mixed"],
  },
  "sport-in-mind": {
    area: "Havant",
    playerLevels: ["all-levels"],
    kinds: ["social"],
    formats: ["doubles"],
  },
  "pba-college": {
    area: "Portsmouth",
    playerLevels: ["improver", "intermediate"],
    kinds: ["social", "pay-and-play"],
    formats: ["doubles"],
  },
  "hawks-wed": {
    area: "Botley",
    playerLevels: ["league", "advanced"],
    kinds: ["pay-and-play", "club"],
    formats: ["doubles"],
  },
  bognor: {
    area: "Bognor",
    playerLevels: ["intermediate", "league"],
    kinds: ["club"],
    formats: ["doubles"],
  },
  nomads: {
    area: "Petersfield",
    playerLevels: ["improver", "intermediate"],
    kinds: ["social", "club"],
    formats: ["doubles"],
  },
  "southsea-wed": {
    area: "Southsea",
    playerLevels: ["intermediate", "advanced", "league"],
    kinds: ["club"],
    formats: ["doubles"],
  },
  "selsey-wed": {
    area: "Selsey",
    playerLevels: ["intermediate", "league"],
    kinds: ["club"],
    formats: ["doubles"],
  },
  "u3a-beginners": {
    area: "Waterlooville",
    playerLevels: ["beginner"],
    kinds: ["starter", "drop-in"],
    formats: ["doubles"],
  },
  "henry-cort": {
    area: "Fareham",
    playerLevels: ["intermediate", "league"],
    kinds: ["club"],
    formats: ["doubles"],
  },
  bourne: {
    area: "Southbourne",
    playerLevels: ["all-levels"],
    kinds: ["social"],
    formats: ["doubles", "mixed"],
  },
  "pompey-thu": {
    area: "Horndean",
    playerLevels: ["intermediate", "advanced"],
    kinds: ["club"],
    formats: ["doubles"],
  },
  "tooke-thu": {
    area: "Horndean",
    playerLevels: [],
    kinds: ["club"],
    formats: ["doubles"],
  },
  "charter-no-strings": {
    area: "Portsmouth",
    playerLevels: ["all-levels"],
    kinds: ["no-strings", "social"],
    formats: ["doubles", "mixed"],
  },
  "locks-heath-fri": {
    area: "Locks Heath",
    playerLevels: ["all-levels"],
    kinds: ["social"],
    formats: ["doubles"],
  },
  "meetup-fareham": {
    area: "Fareham",
    playerLevels: ["improver", "intermediate"],
    kinds: ["social"],
    formats: ["doubles", "mixed"],
  },
  "0900-club": {
    area: "Gosport",
    playerLevels: ["improver", "intermediate", "all-levels"],
    kinds: ["social", "club"],
    formats: ["mixed", "doubles"],
  },
  notorious: {
    area: "Gosport",
    playerLevels: ["all-levels"],
    kinds: ["social"],
    formats: ["doubles"],
  },
  "southampton-rec-sat": {
    area: "Southampton",
    playerLevels: ["all-levels"],
    kinds: ["university", "social", "pay-and-play"],
    formats: ["doubles", "mixed"],
  },
  "uop-play-sat": {
    area: "Portsmouth",
    playerLevels: ["all-levels"],
    kinds: ["university", "social"],
    formats: ["doubles", "mixed"],
  },
  "hawks-sun": {
    area: "Hamble",
    playerLevels: ["intermediate", "league"],
    kinds: ["club"],
    formats: ["doubles"],
  },
  "pompey-sun": {
    area: "Horndean",
    playerLevels: ["intermediate", "advanced"],
    kinds: ["club"],
    formats: ["doubles"],
  },
  "southampton-rec-sun": {
    area: "Southampton",
    playerLevels: ["all-levels"],
    kinds: ["university", "social", "pay-and-play"],
    formats: ["doubles", "mixed"],
  },
  "uop-play-sun": {
    area: "Portsmouth",
    playerLevels: ["all-levels"],
    kinds: ["university", "social"],
    formats: ["doubles", "mixed"],
  },
  "clanfield-50": {
    area: "Clanfield",
    playerLevels: ["improver", "intermediate"],
    kinds: ["drop-in", "social"],
    formats: ["doubles"],
  },
  "top-flight": {
    area: "Chandler's Ford",
    playerLevels: ["all-levels"],
    kinds: ["social", "pay-and-play"],
    formats: ["doubles", "mixed"],
  },
  wittering: {
    area: "Bracklesham",
    playerLevels: ["intermediate", "advanced"],
    kinds: ["club"],
    formats: ["doubles"],
    excludesBeginners: true,
  },
};

export type EnrichedSession = BadmintonSession & SessionDetails;

export function getEnrichedSessions(): EnrichedSession[] {
  return badmintonSessions.map((session) => {
    const details = detailsById[session.id];
    if (!details) {
      throw new Error(`Missing session details for id: ${session.id}`);
    }
    return { ...session, ...details };
  });
}
