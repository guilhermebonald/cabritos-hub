import { LevelInfo, getLevelFromXp } from "./gamification";
import { BadgeDefinition, SYSTEM_BADGES } from "./badges";

export interface AthleteActivityRecord {
  id: string;
  name: string;
  distanceMeters: number;
  elevationGainMeters: number;
  movingTimeSeconds: number;
  startDateLocal: string;
  averageSpeedKph: number;
  activityType: "Outdoor" | "Virtual" | "EBike";
  xpAwarded: number;
}

export interface AthleteProfileInput {
  athleteId: string;
  firstname: string;
  lastname: string;
  totalXp: number;
  clubName?: string;
  avatarUrl?: string;
  unlockedBadgeCodes: Set<string>;
  activities: AthleteActivityRecord[];
}

export interface SeasonStats {
  totalRides: number;
  totalDistanceKm: number;
  totalElevationMeters: number;
  longestRideKm: number;
  totalMovingTimeSeconds: number;
}

export interface DisplayBadge extends BadgeDefinition {
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface AthleteProfileResult {
  athleteId: string;
  fullName: string;
  totalXp: number;
  clubName: string;
  avatarUrl?: string;
  levelInfo: LevelInfo;
  seasonStats: SeasonStats;
  badges: {
    unlocked: DisplayBadge[];
    locked: DisplayBadge[];
  };
  recentActivities: AthleteActivityRecord[];
}

export function computeAthleteProfile(input: AthleteProfileInput): AthleteProfileResult {
  const levelInfo = getLevelFromXp(input.totalXp);

  const totalRides = input.activities.length;
  let totalDistanceMeters = 0;
  let totalElevationMeters = 0;
  let longestRideMeters = 0;
  let totalMovingTimeSeconds = 0;

  for (const act of input.activities) {
    totalDistanceMeters += act.distanceMeters;
    totalElevationMeters += Math.max(0, act.elevationGainMeters);
    if (act.distanceMeters > longestRideMeters) {
      longestRideMeters = act.distanceMeters;
    }
    totalMovingTimeSeconds += act.movingTimeSeconds;
  }

  const seasonStats: SeasonStats = {
    totalRides,
    totalDistanceKm: Math.round(totalDistanceMeters / 1000),
    totalElevationMeters: Math.round(totalElevationMeters),
    longestRideKm: Math.round(longestRideMeters / 1000),
    totalMovingTimeSeconds,
  };

  const unlocked: DisplayBadge[] = [];
  const locked: DisplayBadge[] = [];

  for (const badge of SYSTEM_BADGES) {
    const isUnlocked = input.unlockedBadgeCodes.has(badge.code);
    if (isUnlocked) {
      unlocked.push({
        ...badge,
        isUnlocked: true,
      });
    } else {
      if (badge.isSecret) {
        locked.push({
          ...badge,
          title: "Conquista Secreta",
          description: "??? Complete objetivos misteriosos para revelar.",
          icon: "🔒",
          isUnlocked: false,
        });
      } else {
        locked.push({
          ...badge,
          isUnlocked: false,
        });
      }
    }
  }

  const sortedActivities = [...input.activities].sort(
    (a, b) => new Date(b.startDateLocal).getTime() - new Date(a.startDateLocal).getTime()
  );

  return {
    athleteId: input.athleteId,
    fullName: `${input.firstname} ${input.lastname}`.trim(),
    totalXp: input.totalXp,
    clubName: input.clubName || "Cabritos Cycling Club",
    avatarUrl: input.avatarUrl,
    levelInfo,
    seasonStats,
    badges: {
      unlocked,
      locked,
    },
    recentActivities: sortedActivities.slice(0, 10),
  };
}
