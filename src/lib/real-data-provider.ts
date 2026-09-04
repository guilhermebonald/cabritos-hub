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

export const realProfile: AthleteProfileResult = computeAthleteProfile({
  athleteId: String(realData.athlete.id),
  firstname: realData.athlete.firstname,
  lastname: realData.athlete.lastname,
  totalXp: backfillResult.newTotalXp,
  clubName: "CABRITOS RACE TEAM",
  avatarUrl: realData.athlete.profile_medium || realData.athlete.profile,
  unlockedBadgeCodes: new Set(backfillResult.unlockedBadges.map((b) => b.code)),
  activities: athleteProfileActivities,
});

// Converte atividades para o formato do mapa coletivo com rotas GPS reais
export const realClubRoutes: CollectiveRoutesResult = aggregateClubRoutes(
  rawActivities
    .filter((a) => !!a.summary_polyline)
    .map((a) => ({
      id: String(a.id),
      athleteName: `${realData.athlete.firstname} ${realData.athlete.lastname}`,
      name: a.name,
      distanceMeters: a.distance,
      elevationGainMeters: a.total_elevation_gain,
      summaryPolyline: a.summary_polyline,
      activityType: a.type === "VirtualRide" ? "Virtual" : "Outdoor",
    }))
);

// Converte para rankings e corrida virtual
export const realRankingActivities: ActivityRecord[] = backfillResult.activities.map((a) => ({
  athleteId: String(realData.athlete.id),
  athleteName: `${realData.athlete.firstname} ${realData.athlete.lastname}`,
  distanceMeters: a.distanceMeters,
  elevationGainMeters: a.elevationGainMeters,
  movingTimeSeconds: a.movingTimeSeconds,
  startDateLocal: a.startDateLocal,
  isEligibleForRanking: a.isEligibleForRanking,
  activityType: a.type,
}));

export const realWeeklyRankings = aggregateWeeklyRankings(realRankingActivities);

// Giro da Semana real
const giroActivities: GiroActivityInput[] = backfillResult.activities.map((a) => ({
  id: String(a.stravaActivityId),
  athleteId: String(realData.athlete.id),
  athleteName: `${realData.athlete.firstname} ${realData.athlete.lastname}`,
  distanceMeters: a.distanceMeters,
  elevationGainMeters: a.elevationGainMeters,
  movingTimeSeconds: a.movingTimeSeconds,
  startDateLocal: a.startDateLocal,
  averageSpeedKph: a.averageSpeedKph,
  activityType: a.type,
  isEligibleForRanking: a.isEligibleForRanking,
}));

export const realGiroBulletin = compileGiroDaSemana({
  weekNumber: 36,
  year: 2026,
  activities: giroActivities,
  previousWeekDistance: [{ athleteId: String(realData.athlete.id), totalDistanceKm: 180 }],
  editorialNotes: "Dados reais da temporada sincronizados diretamente da conta oficial do Strava do Guilherme Bonald!",
});
