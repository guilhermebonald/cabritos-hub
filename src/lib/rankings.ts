export interface ActivityRecord {
  athleteId: string;
  athleteName: string;
  distanceMeters: number;
  elevationGainMeters: number;
  movingTimeSeconds: number;
  startDateLocal: string; // ISO date
  isEligibleForRanking: boolean;
  activityType: "Outdoor" | "Virtual" | "EBike";
}

export interface AthleteWeeklyStats {
  athleteId: string;
  athleteName: string;
  totalDistanceKm: number;
  totalElevationMeters: number;
  totalActivities: number;
  distinctDays: number;
  highestSpeedKph: number;
  longestRideKm: number;
}

export function aggregateWeeklyRankings(activities: ActivityRecord[]): {
  distancePodium: AthleteWeeklyStats[];
  mountainPodium: AthleteWeeklyStats[];
  consistencyPodium: AthleteWeeklyStats[];
} {
  const athleteMap = new Map<string, AthleteWeeklyStats & { daysSet: Set<string> }>();

  for (const act of activities) {
    if (!act.isEligibleForRanking) continue;

    const km = act.distanceMeters / 1000;
    const day = act.startDateLocal.split("T")[0];
    const speedKph = act.movingTimeSeconds > 0 ? (km / (act.movingTimeSeconds / 3600)) : 0;

    let stats = athleteMap.get(act.athleteId);
    if (!stats) {
      stats = {
        athleteId: act.athleteId,
        athleteName: act.athleteName,
        totalDistanceKm: 0,
        totalElevationMeters: 0,
        totalActivities: 0,
        distinctDays: 0,
        highestSpeedKph: 0,
        longestRideKm: 0,
        daysSet: new Set<string>(),
      };
      athleteMap.set(act.athleteId, stats);
    }

    stats.totalDistanceKm += km;
    stats.totalElevationMeters += act.elevationGainMeters;
    stats.totalActivities += 1;
    stats.daysSet.add(day);
    stats.distinctDays = stats.daysSet.size;
    if (speedKph > stats.highestSpeedKph) stats.highestSpeedKph = speedKph;
    if (km > stats.longestRideKm) stats.longestRideKm = km;
  }

  const all = Array.from(athleteMap.values()).map(({ daysSet, ...rest }) => ({
    ...rest,
    totalDistanceKm: Math.round(rest.totalDistanceKm * 10) / 10,
  }));

  const distancePodium = [...all].sort((a, b) => b.totalDistanceKm - a.totalDistanceKm);
  const mountainPodium = [...all].sort((a, b) => b.totalElevationMeters - a.totalElevationMeters);
  const consistencyPodium = [...all].sort((a, b) => b.distinctDays - a.distinctDays || b.totalDistanceKm - a.totalDistanceKm);

  return {
    distancePodium,
    mountainPodium,
    consistencyPodium,
  };
}
