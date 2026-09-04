import realData from "./real-strava-data.json";
import { processSeasonBackfill, StravaRawActivity } from "./backfill";
import { computeAthleteProfile, AthleteProfileResult, AthleteActivityRecord } from "./athlete-profile";
import { aggregateWeeklyRankings, ActivityRecord } from "./rankings";
import { aggregateClubRoutes, CollectiveRoutesResult } from "./routes-map";
import { compileGiroDaSemana, GiroActivityInput } from "./giro";

export interface RealStravaAthlete {
  id: number;
  firstname: string;
  lastname: string;
  profile_medium?: string;
  profile?: string;
  city?: string;
  state?: string;
}

export interface RealStravaActivity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  start_date_local: string;
  average_speed: number;
  max_speed: number;
  trainer?: boolean;
  map?: {
    summary_polyline?: string;
  };
}

const rawActivities: StravaRawActivity[] = (realData.activities as RealStravaActivity[]).map((act) => ({
  id: act.id,
  name: act.name,
  type: act.type,
  trainer: act.trainer,
  start_date_local: act.start_date_local,
  distance: act.distance,
  moving_time: act.moving_time,
  total_elevation_gain: act.total_elevation_gain,
  average_speed: act.average_speed,
  max_speed: act.max_speed,
  summary_polyline: act.map?.summary_polyline,
}));

// Processa todas as atividades da temporada de Guilherme Bonald através do motor de gamificação
export const backfillResult = processSeasonBackfill({
  athleteCurrentXp: 0,
  existingActivityIds: new Set(),
  existingBadgeCodes: new Set(),
  rawActivities,
  seasonCutoffDate: "2026-01-01T00:00:00Z",
});

const athleteProfileActivities: AthleteActivityRecord[] = backfillResult.activities.map((act) => ({
  id: String(act.stravaActivityId),
  name: act.name,
  distanceMeters: act.distanceMeters,
  elevationGainMeters: act.elevationGainMeters,
  movingTimeSeconds: act.movingTimeSeconds,
  startDateLocal: act.startDateLocal,
  averageSpeedKph: act.averageSpeedKph,
  activityType: act.type,
  xpAwarded: act.xpAwarded,
}));

import { getCollectiveClubData, getAthleteProfileById } from "./club-store";

export function getRealProfile() {
  return getAthleteProfileById();
}

export function getRealCollectiveData() {
  return getCollectiveClubData();
}

// Proxies de leitura dinâmica para garantir avaliação a cada requisição sem congelar estado em memória
export const realProfile = {
  get value() {
    return getAthleteProfileById();
  },
};

export function getRealWeeklyRankings() {
  return getCollectiveClubData().weeklyRankings;
}

export function getRealGiroBulletin() {
  return getCollectiveClubData().giroBulletin;
}

export function getRealClubRoutes() {
  return getCollectiveClubData().clubRoutes;
}

export function getRegisteredAthletes() {
  return getCollectiveClubData().athletes;
}

export function getActiveCompetitionWeek() {
  return getCollectiveClubData().activeWeek;
}


