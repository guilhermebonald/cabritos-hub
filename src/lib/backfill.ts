import { calculateActivityXp, getLevelFromXp, LevelInfo } from "./gamification";
import { classifyActivity } from "./strava-auth";
import { evaluateBadgesForActivity, BadgeDefinition } from "./badges";

export interface StravaRawActivity {
  id: number;
  name: string;
  type: string;
  trainer?: boolean;
  start_date_local: string;
  distance: number; // meters
  moving_time: number; // seconds
  total_elevation_gain: number; // meters
  average_speed: number; // m/s
  max_speed: number; // m/s
  summary_polyline?: string;
}

export interface ProcessedBackfillActivity {
  stravaActivityId: number;
  name: string;
  type: "Outdoor" | "Virtual" | "EBike";
  startDateLocal: string;
  distanceMeters: number;
  movingTimeSeconds: number;
  elevationGainMeters: number;
  averageSpeedKph: number;
  maxSpeedKph: number;
  summaryPolyline?: string;
  isEligibleForRanking: boolean;
  xpAwarded: number;
}

export interface BackfillResult {
  processedCount: number;
  skippedCount: number;
  totalXpGained: number;
  newTotalXp: number;
  levelInfo: LevelInfo;
  unlockedBadges: BadgeDefinition[];
  activities: ProcessedBackfillActivity[];
}

export function processSeasonBackfill(params: {
  athleteCurrentXp: number;
  existingActivityIds: Set<number>;
  existingBadgeCodes: Set<string>;
  rawActivities: StravaRawActivity[];
  seasonCutoffDate?: string; // default 2026-01-01
}): BackfillResult {
  const cutoffDate = params.seasonCutoffDate || "2026-01-01T00:00:00Z";
  const cutoffTime = new Date(cutoffDate).getTime();

  let totalXpGained = 0;
  let runningTotalElevation = 0;
  let skippedCount = 0;
  const processedActivities: ProcessedBackfillActivity[] = [];
  const currentBadges = new Set(params.existingBadgeCodes);
  const newlyUnlockedBadges: BadgeDefinition[] = [];

  // Sort activities chronologically to evaluate historical badges properly
  const sorted = [...params.rawActivities].sort(
    (a, b) => new Date(a.start_date_local).getTime() - new Date(b.start_date_local).getTime()
  );

  for (const raw of sorted) {
    const actTime = new Date(raw.start_date_local).getTime();
    if (actTime < cutoffTime || params.existingActivityIds.has(raw.id)) {
      skippedCount++;
      continue;
    }

    const activityType = classifyActivity({ type: raw.type, trainer: raw.trainer });
    const isEligible = activityType !== "EBike";
    const avgSpeedKph = Math.round((raw.average_speed * 3.6) * 10) / 10;
    const maxSpeedKph = Math.round((raw.max_speed * 3.6) * 10) / 10;

    const xpResult = calculateActivityXp({
      distanceMeters: raw.distance,
      elevationGainMeters: raw.total_elevation_gain,
      activityType,
    });

    totalXpGained += xpResult.totalXp;
    runningTotalElevation += raw.total_elevation_gain;

    const badgesAwarded = evaluateBadgesForActivity({
      distanceMeters: raw.distance,
      elevationGainMeters: raw.total_elevation_gain,
      averageSpeedKph: avgSpeedKph,
      startDateLocal: raw.start_date_local,
      totalSeasonElevationMeters: runningTotalElevation,
      alreadyUnlockedBadgeCodes: currentBadges,
    });

    for (const b of badgesAwarded) {
      currentBadges.add(b.code);
      newlyUnlockedBadges.push(b);
      totalXpGained += b.xpBonus;
    }

    processedActivities.push({
      stravaActivityId: raw.id,
      name: raw.name,
      type: activityType,
      startDateLocal: raw.start_date_local,
      distanceMeters: raw.distance,
      movingTimeSeconds: raw.moving_time,
      elevationGainMeters: raw.total_elevation_gain,
      averageSpeedKph: avgSpeedKph,
      maxSpeedKph: maxSpeedKph,
      summaryPolyline: raw.summary_polyline,
      isEligibleForRanking: isEligible,
      xpAwarded: xpResult.totalXp,
    });
  }

  const newTotalXp = params.athleteCurrentXp + totalXpGained;
  const levelInfo = getLevelFromXp(newTotalXp);

  return {
    processedCount: processedActivities.length,
    skippedCount,
    totalXpGained,
    newTotalXp,
    levelInfo,
    unlockedBadges: newlyUnlockedBadges,
    activities: processedActivities,
  };
}
