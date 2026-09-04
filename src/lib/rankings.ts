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

export interface WeeklyDateWindow {
  start: Date;
  end: Date;
  weekNumber: number;
  year: number;
}

export function parseActivityDate(dateInput: string | Date): Date {
  if (dateInput instanceof Date) return dateInput;
  const [dPart, tPart] = dateInput.split("T");
  const [y, m, d] = dPart.split("-").map(Number);
  const [hh, mm, ss] = (tPart || "00:00:00").replace("Z", "").split(":").map(Number);
  return new Date(y, m - 1, d, hh || 0, mm || 0, ss || 0);
}

export function getWeekBounds(referenceDate: Date = new Date()): WeeklyDateWindow {
  const d = new Date(referenceDate);
  const day = d.getDay();
  const diffToMon = day === 0 ? -6 : 1 - day;
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate() + diffToMon, 0, 0, 0, 0);
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + diffToMon + 6, 23, 59, 59, 999);

  // ISO week calculation
  const target = new Date(start.valueOf());
  const dayNr = (start.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  const weekNumber = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);

  return { start, end, weekNumber, year: start.getFullYear() };
}

export function getActiveCompetitionWeek(activities: ActivityRecord[]): WeeklyDateWindow {
  const now = new Date();
  const currentWeek = getWeekBounds(now);

  const hasCurrentWeekActs = activities.some((a) => {
    if (!a.isEligibleForRanking) return false;
    const d = parseActivityDate(a.startDateLocal);
    return d >= currentWeek.start && d <= currentWeek.end;
  });

  if (hasCurrentWeekActs || activities.length === 0) {
    return currentWeek;
  }

  // Fallback: se não houver atividades na semana presente, exibe a semana ativa mais recente
  const timestamps = activities
    .filter((a) => a.isEligibleForRanking)
    .map((a) => parseActivityDate(a.startDateLocal).getTime());

  if (timestamps.length === 0) return currentWeek;

  const latest = new Date(Math.max(...timestamps));
  return getWeekBounds(latest);
}

export function aggregateWeeklyRankings(
  activities: ActivityRecord[],
  window?: WeeklyDateWindow
): {
  distancePodium: AthleteWeeklyStats[];
  mountainPodium: AthleteWeeklyStats[];
  consistencyPodium: AthleteWeeklyStats[];
  weekWindow?: WeeklyDateWindow;
} {
  const athleteMap = new Map<string, AthleteWeeklyStats & { daysSet: Set<string> }>();

  for (const act of activities) {
    if (!act.isEligibleForRanking) continue;

    const parsedDate = parseActivityDate(act.startDateLocal);
    if (window && (parsedDate < window.start || parsedDate > window.end)) {
      continue;
    }

    const km = act.distanceMeters / 1000;
    const rawDate = act.startDateLocal;
    const dateStr = typeof rawDate === "string" ? rawDate : (rawDate as unknown as Date).toISOString();
    const day = dateStr.split("T")[0];
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
    weekWindow: window,
  };
}
