import fs from "node:fs";
import path from "node:path";
import realData from "./real-strava-data.json";
import { processSeasonBackfill, StravaRawActivity } from "./backfill";
import { computeAthleteProfile, AthleteProfileResult, AthleteActivityRecord } from "./athlete-profile";
import { aggregateWeeklyRankings, ActivityRecord, getActiveCompetitionWeek } from "./rankings";
import { aggregateClubRoutes, CollectiveRoutesResult } from "./routes-map";
import { compileGiroDaSemana, GiroActivityInput } from "./giro";

export interface StoredAthlete {
  id: string;
  firstname: string;
  lastname: string;
  profileMedium?: string;
  profile?: string;
  city?: string;
  state?: string;
  clubName?: string;
  totalXp: number;
  unlockedBadgeCodes: string[];
  updatedAt: string;
}

export interface StoredClubData {
  athletes: Record<string, StoredAthlete>;
  activities: Record<string, StravaRawActivity[]>; // keyed by athleteId
}

const STORE_FILE_PATH = path.join(process.cwd(), "src", "data", "club-store.json");

function ensureDirectoryExists(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Inicializa dados com o membro fundador Guilherme Bonald
function getInitialStore(): StoredClubData {
  const guilhermeRawActivities: StravaRawActivity[] = (realData.activities as any[]).map((act) => ({
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

  const backfill = processSeasonBackfill({
    athleteCurrentXp: 0,
    existingActivityIds: new Set(),
    existingBadgeCodes: new Set(),
    rawActivities: guilhermeRawActivities,
    seasonCutoffDate: "2026-01-01T00:00:00Z",
  });

  const guilhermeId = String(realData.athlete.id);

  return {
    athletes: {
      [guilhermeId]: {
        id: guilhermeId,
        firstname: realData.athlete.firstname,
        lastname: realData.athlete.lastname,
        profileMedium: realData.athlete.profile_medium,
        profile: realData.athlete.profile,
        city: realData.athlete.city,
        state: realData.athlete.state,
        clubName: "CABRITOS RACE TEAM",
        totalXp: backfill.newTotalXp,
        unlockedBadgeCodes: backfill.unlockedBadges.map((b) => b.code),
        updatedAt: new Date().toISOString(),
      },
    },
    activities: {
      [guilhermeId]: guilhermeRawActivities,
    },
  };
}

export function loadClubStore(): StoredClubData {
  try {
    if (fs.existsSync(STORE_FILE_PATH)) {
      const raw = fs.readFileSync(STORE_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw) as StoredClubData;
      if (parsed && typeof parsed.athletes === "object" && typeof parsed.activities === "object") {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed reading club store file, initializing fresh store:", err);
  }

  const initial = getInitialStore();
  saveClubStore(initial);
  return initial;
}

export function saveClubStore(data: StoredClubData): void {
  try {
    ensureDirectoryExists(STORE_FILE_PATH);
    fs.writeFileSync(STORE_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed writing club store:", err);
  }
}

export function ingestAthleteActivities(params: {
  athlete: {
    id: number | string;
    firstname: string;
    lastname: string;
    profile_medium?: string;
    profile?: string;
    city?: string;
    state?: string;
  };
  rawActivities: StravaRawActivity[];
}): void {
  const store = loadClubStore();
  const athleteId = String(params.athlete.id);

  const existingActivities = store.activities[athleteId] || [];
  const existingIds = new Set(existingActivities.map((a) => a.id));

  // Merge de novas atividades sem duplicatas
  const mergedActivities = [...existingActivities];
  for (const act of params.rawActivities) {
    if (!existingIds.has(act.id)) {
      mergedActivities.push(act);
      existingIds.add(act.id);
    }
  }

  // Executa backfill da temporada completa para calcular XP e badges
  const backfill = processSeasonBackfill({
    athleteCurrentXp: 0,
    existingActivityIds: new Set(),
    existingBadgeCodes: new Set(),
    rawActivities: mergedActivities,
    seasonCutoffDate: "2026-01-01T00:00:00Z",
  });

  store.athletes[athleteId] = {
    id: athleteId,
    firstname: params.athlete.firstname,
    lastname: params.athlete.lastname,
    profileMedium: params.athlete.profile_medium,
    profile: params.athlete.profile,
    city: params.athlete.city,
    state: params.athlete.state,
    clubName: "CABRITOS RACE TEAM",
    totalXp: backfill.newTotalXp,
    unlockedBadgeCodes: backfill.unlockedBadges.map((b) => b.code),
    updatedAt: new Date().toISOString(),
  };

  store.activities[athleteId] = mergedActivities;
  saveClubStore(store);
}

export function deleteAthleteFromStore(athleteId?: string | number): boolean {
  const store = loadClubStore();
  if (athleteId) {
    const idStr = String(athleteId);
    delete store.athletes[idStr];
    delete store.activities[idStr];
  } else {
    store.athletes = {};
    store.activities = {};
  }
  saveClubStore(store);
  return true;
}

// Agrega dados coletivos de TODOS os membros sincronizados
export function getCollectiveClubData() {
  const store = loadClubStore();
  const allAthletes = Object.values(store.athletes);

  // Lista com todas as atividades de todos os membros
  const allRankingActivities: ActivityRecord[] = [];
  const allRouteInputs: any[] = [];
  const allGiroActivities: GiroActivityInput[] = [];

  for (const ath of allAthletes) {
    const raw = store.activities[ath.id] || [];
    const backfill = processSeasonBackfill({
      athleteCurrentXp: 0,
      existingActivityIds: new Set(),
      existingBadgeCodes: new Set(),
      rawActivities: raw,
      seasonCutoffDate: "2026-01-01T00:00:00Z",
    });

    for (const a of backfill.activities) {
      allRankingActivities.push({
        athleteId: ath.id,
        athleteName: `${ath.firstname} ${ath.lastname}`,
        distanceMeters: a.distanceMeters,
        elevationGainMeters: a.elevationGainMeters,
        movingTimeSeconds: a.movingTimeSeconds,
        startDateLocal: a.startDateLocal,
        isEligibleForRanking: a.isEligibleForRanking,
        activityType: a.type,
      });

      allGiroActivities.push({
        id: String(a.stravaActivityId),
        athleteId: ath.id,
        athleteName: `${ath.firstname} ${ath.lastname}`,
        distanceMeters: a.distanceMeters,
        elevationGainMeters: a.elevationGainMeters,
        movingTimeSeconds: a.movingTimeSeconds,
        startDateLocal: a.startDateLocal,
        averageSpeedKph: a.averageSpeedKph,
        activityType: a.type,
        isEligibleForRanking: a.isEligibleForRanking,
      });
    }

    for (const r of raw) {
      if (r.summary_polyline) {
        allRouteInputs.push({
          id: String(r.id),
          athleteName: `${ath.firstname} ${ath.lastname}`,
          name: r.name,
          distanceMeters: r.distance,
          elevationGainMeters: r.total_elevation_gain,
          summaryPolyline: r.summary_polyline,
          activityType: r.type === "VirtualRide" ? "Virtual" : "Outdoor",
        });
      }
    }
  }

  // Calcula ciclo semanal ativo (segunda a domingo)
  const activeWeek = getActiveCompetitionWeek(allRankingActivities);

  const weeklyRankings = aggregateWeeklyRankings(allRankingActivities, activeWeek);
  const clubRoutes: CollectiveRoutesResult = aggregateClubRoutes(allRouteInputs);

  // Atividades do Giro filtradas para a semana ativa
  const weeklyGiroActivities = allGiroActivities.filter((act) => {
    const actDate = new Date(act.startDateLocal);
    return actDate >= activeWeek.start && actDate <= activeWeek.end;
  });

  const giroBulletin = compileGiroDaSemana({
    weekNumber: activeWeek.weekNumber,
    year: activeWeek.year,
    activities: weeklyGiroActivities.length > 0 ? weeklyGiroActivities : allGiroActivities,
    previousWeekDistance: allAthletes.map((ath) => ({
      athleteId: ath.id,
      totalDistanceKm: 150,
    })),
    editorialNotes: "Pelotão do Cabritos Racing Team reunido com sincronização automática do Strava!",
  });

  return {
    athletes: allAthletes,
    weeklyRankings,
    clubRoutes,
    giroBulletin,
    activeWeek,
  };
}

// Retorna o perfil calculado para um atleta específico (ou o primeiro membro)
export function getAthleteProfileById(athleteId?: string): AthleteProfileResult | null {
  const store = loadClubStore();
  const targetId = athleteId;
  const athlete = targetId ? store.athletes[targetId] : Object.values(store.athletes)[0];

  if (!athlete) {
    return null;
  }

  const raw = store.activities[athlete.id] || [];
  const backfill = processSeasonBackfill({
    athleteCurrentXp: 0,
    existingActivityIds: new Set(),
    existingBadgeCodes: new Set(),
    rawActivities: raw,
    seasonCutoffDate: "2026-01-01T00:00:00Z",
  });

  const athleteProfileActivities: AthleteActivityRecord[] = backfill.activities.map((act) => ({
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

  return computeAthleteProfile({
    athleteId: athlete.id,
    firstname: athlete.firstname,
    lastname: athlete.lastname,
    totalXp: backfill.newTotalXp,
    clubName: athlete.clubName || "CABRITOS RACE TEAM",
    avatarUrl: athlete.profileMedium || athlete.profile,
    unlockedBadgeCodes: new Set(backfill.unlockedBadges.map((b) => b.code)),
    activities: athleteProfileActivities,
  });
}
