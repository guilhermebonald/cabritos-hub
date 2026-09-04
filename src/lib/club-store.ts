import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { processSeasonBackfill, StravaRawActivity } from "./backfill";
import { computeAthleteProfile, AthleteProfileResult, AthleteActivityRecord } from "./athlete-profile";
import { aggregateWeeklyRankings, ActivityRecord, getActiveCompetitionWeek } from "./rankings";
import { aggregateClubRoutes, CollectiveRoutesResult } from "./routes-map";
import { compileGiroDaSemana, GiroActivityInput } from "./giro";
import { refreshStravaToken } from "./strava-auth";

/**
 * Ensures an athlete has a valid, non-expired access token.
 * Refreshes automatically if expired or expiring in less than 5 minutes.
 */
export async function getValidAthleteToken(athleteIdOrStravaId: string | number): Promise<string | null> {
  const isNumeric = !isNaN(Number(athleteIdOrStravaId));
  const athleteRecords = isNumeric
    ? await db
        .select()
        .from(schema.athletes)
        .where(eq(schema.athletes.stravaId, Number(athleteIdOrStravaId)))
    : await db
        .select()
        .from(schema.athletes)
        .where(eq(schema.athletes.id, String(athleteIdOrStravaId)));

  if (athleteRecords.length === 0) return null;
  const athlete = athleteRecords[0];

  const now = new Date();
  const bufferTime = 5 * 60 * 1000; // 5 minutos de margem
  const isExpired = athlete.tokenExpiresAt
    ? athlete.tokenExpiresAt.getTime() - bufferTime < now.getTime()
    : true;

  if (!isExpired && athlete.stravaAccessToken) {
    return athlete.stravaAccessToken;
  }

  if (!athlete.stravaRefreshToken) {
    return athlete.stravaAccessToken;
  }

  try {
    const clientId = process.env.STRAVA_CLIENT_ID || "177152";
    const clientSecret = process.env.STRAVA_CLIENT_SECRET || "81a5990cb69dbf68512ed209da9c8344d64a6b32";

    const refreshed = await refreshStravaToken({
      clientId,
      clientSecret,
      refreshToken: athlete.stravaRefreshToken,
    });

    await db
      .update(schema.athletes)
      .set({
        stravaAccessToken: refreshed.access_token,
        stravaRefreshToken: refreshed.refresh_token,
        tokenExpiresAt: new Date(refreshed.expires_at * 1000),
        updatedAt: new Date(),
      })
      .where(eq(schema.athletes.id, athlete.id));

    return refreshed.access_token;
  } catch (err) {
    console.error(`Failed to auto-refresh Strava token for athlete ${athlete.id}:`, err);
    return athlete.stravaAccessToken;
  }
}


export interface IngestAthleteParams {
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
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: number;
}

export async function ingestAthleteActivities(params: IngestAthleteParams): Promise<void> {
  const stravaId = Number(params.athlete.id);

  // 1. Upsert atleta
  const existingAthleteList = await db
    .select()
    .from(schema.athletes)
    .where(eq(schema.athletes.stravaId, stravaId));

  let athleteDbId: string;

  if (existingAthleteList.length > 0) {
    athleteDbId = existingAthleteList[0].id;
    await db
      .update(schema.athletes)
      .set({
        firstname: params.athlete.firstname,
        lastname: params.athlete.lastname,
        profilePictureUrl: params.athlete.profile_medium || params.athlete.profile || null,
        isClubMember: true,
        stravaAccessToken: params.accessToken || existingAthleteList[0].stravaAccessToken,
        stravaRefreshToken: params.refreshToken || existingAthleteList[0].stravaRefreshToken,
        tokenExpiresAt: params.tokenExpiresAt ? new Date(params.tokenExpiresAt * 1000) : existingAthleteList[0].tokenExpiresAt,
        updatedAt: new Date(),
      })
      .where(eq(schema.athletes.id, athleteDbId));
  } else {
    const inserted = await db
      .insert(schema.athletes)
      .values({
        stravaId,
        firstname: params.athlete.firstname,
        lastname: params.athlete.lastname,
        profilePictureUrl: params.athlete.profile_medium || params.athlete.profile || null,
        isClubMember: true,
        stravaAccessToken: params.accessToken || null,
        stravaRefreshToken: params.refreshToken || null,
        tokenExpiresAt: params.tokenExpiresAt ? new Date(params.tokenExpiresAt * 1000) : null,
      })
      .returning({ id: schema.athletes.id });
    athleteDbId = inserted[0].id;
  }

  // 2. Buscar atividades existentes para evitar duplicatas
  const existingDbActs = await db
    .select({ stravaActivityId: schema.activities.stravaActivityId })
    .from(schema.activities)
    .where(eq(schema.activities.athleteId, athleteDbId));

  const existingIds = new Set(existingDbActs.map((a) => a.stravaActivityId));

  // 3. Processar gamificação e backfill da temporada 2026
  const backfill = processSeasonBackfill({
    athleteCurrentXp: 0,
    existingActivityIds: new Set(),
    existingBadgeCodes: new Set(),
    rawActivities: params.rawActivities,
    seasonCutoffDate: "2026-01-01T00:00:00Z",
  });

  // 4. Inserir atividades novas no banco
  for (const act of backfill.activities) {
    if (!existingIds.has(act.stravaActivityId)) {
      await db
        .insert(schema.activities)
        .values({
          athleteId: athleteDbId,
          stravaActivityId: act.stravaActivityId,
          name: act.name,
          type: act.type,
          startDateLocal: new Date(act.startDateLocal),
          distanceMeters: String(act.distanceMeters),
          movingTimeSeconds: act.movingTimeSeconds,
          elevationGainMeters: String(act.elevationGainMeters),
          averageSpeedKph: String(act.averageSpeedKph),
          maxSpeedKph: String(act.maxSpeedKph),
          summaryPolyline: act.summaryPolyline || null,
          isEligibleForRanking: act.isEligibleForRanking,
          xpAwarded: act.xpAwarded,
        })
        .onConflictDoNothing();
      existingIds.add(act.stravaActivityId);
    }
  }

  // 5. Inserir badges desbloqueados
  for (const badge of backfill.unlockedBadges) {
    await db
      .insert(schema.badges)
      .values({
        code: badge.code,
        title: badge.title,
        description: badge.description,
        icon: badge.icon,
        isSecret: badge.isSecret,
        xpBonus: badge.xpBonus,
      })
      .onConflictDoNothing();

    await db
      .insert(schema.athleteBadges)
      .values({
        athleteId: athleteDbId,
        badgeCode: badge.code,
      })
      .onConflictDoNothing();
  }

  // 6. Atualizar XP total e Nível do atleta
  await db
    .update(schema.athletes)
    .set({
      totalXp: backfill.newTotalXp,
      currentLevel: backfill.levelInfo.level,
      updatedAt: new Date(),
    })
    .where(eq(schema.athletes.id, athleteDbId));
}

export async function deleteAthleteFromStore(athleteId?: string | number): Promise<boolean> {
  if (!athleteId) {
    return false;
  }
  const idNum = Number(athleteId);
  if (!isNaN(idNum)) {
    await db.delete(schema.athletes).where(eq(schema.athletes.stravaId, idNum));
  } else {
    await db.delete(schema.athletes).where(eq(schema.athletes.id, String(athleteId)));
  }
  return true;
}

export async function getAthleteProfileById(athleteId?: string): Promise<AthleteProfileResult | null> {
  let athleteRow;

  if (athleteId) {
    const idNum = Number(athleteId);
    if (!isNaN(idNum)) {
      const byStrava = await db
        .select()
        .from(schema.athletes)
        .where(eq(schema.athletes.stravaId, idNum));
      athleteRow = byStrava[0];
    } else {
      const byUuid = await db
        .select()
        .from(schema.athletes)
        .where(eq(schema.athletes.id, athleteId));
      athleteRow = byUuid[0];
    }
  } else {
    const first = await db
      .select()
      .from(schema.athletes)
      .orderBy(desc(schema.athletes.totalXp))
      .limit(1);
    athleteRow = first[0];
  }

  if (!athleteRow) {
    return null;
  }

  // Carrega atividades do atleta
  const acts = await db
    .select()
    .from(schema.activities)
    .where(eq(schema.activities.athleteId, athleteRow.id))
    .orderBy(desc(schema.activities.startDateLocal));

  // Carrega badges do atleta
  const userBadges = await db
    .select({ badgeCode: schema.athleteBadges.badgeCode })
    .from(schema.athleteBadges)
    .where(eq(schema.athleteBadges.athleteId, athleteRow.id));

  const unlockedBadgeCodes = new Set(userBadges.map((b) => b.badgeCode));

  const athleteActivities: AthleteActivityRecord[] = acts.map((a) => ({
    id: String(a.stravaActivityId),
    name: a.name,
    distanceMeters: Number(a.distanceMeters),
    elevationGainMeters: Number(a.elevationGainMeters),
    movingTimeSeconds: a.movingTimeSeconds,
    startDateLocal: a.startDateLocal.toISOString(),
    averageSpeedKph: Number(a.averageSpeedKph),
    activityType: a.type,
    xpAwarded: a.xpAwarded,
  }));

  return computeAthleteProfile({
    athleteId: String(athleteRow.stravaId),
    firstname: athleteRow.firstname,
    lastname: athleteRow.lastname,
    totalXp: athleteRow.totalXp,
    clubName: "CABRITOS RACE TEAM",
    avatarUrl: athleteRow.profilePictureUrl || undefined,
    unlockedBadgeCodes,
    activities: athleteActivities,
  });
}

export async function getCollectiveClubData() {
  const allAthletes = await db.select().from(schema.athletes);
  const allActivities = await db.select().from(schema.activities);

  const athleteMap = new Map(allAthletes.map((a) => [a.id, a]));

  const allRankingActivities: ActivityRecord[] = [];
  const allRouteInputs: any[] = [];
  const allGiroActivities: GiroActivityInput[] = [];

  for (const act of allActivities) {
    const ath = athleteMap.get(act.athleteId);
    const athleteName = ath ? `${ath.firstname} ${ath.lastname}` : "Atleta Cabritos";
    const athleteStravaId = ath ? String(ath.stravaId) : act.athleteId;

    allRankingActivities.push({
      athleteId: athleteStravaId,
      athleteName,
      distanceMeters: Number(act.distanceMeters),
      elevationGainMeters: Number(act.elevationGainMeters),
      movingTimeSeconds: act.movingTimeSeconds,
      startDateLocal: act.startDateLocal.toISOString(),
      isEligibleForRanking: act.isEligibleForRanking,
      activityType: act.type,
    });

    allGiroActivities.push({
      id: String(act.stravaActivityId),
      athleteId: athleteStravaId,
      athleteName,
      distanceMeters: Number(act.distanceMeters),
      elevationGainMeters: Number(act.elevationGainMeters),
      movingTimeSeconds: act.movingTimeSeconds,
      startDateLocal: act.startDateLocal.toISOString(),
      averageSpeedKph: Number(act.averageSpeedKph),
      activityType: act.type,
      isEligibleForRanking: act.isEligibleForRanking,
    });

    if (act.summaryPolyline) {
      allRouteInputs.push({
        id: String(act.stravaActivityId),
        athleteName,
        name: act.name,
        distanceMeters: Number(act.distanceMeters),
        elevationGainMeters: Number(act.elevationGainMeters),
        summaryPolyline: act.summaryPolyline,
        activityType: act.type === "Virtual" ? "Virtual" : "Outdoor",
      });
    }
  }

  const activeWeek = getActiveCompetitionWeek(allRankingActivities);
  const weeklyRankings = aggregateWeeklyRankings(allRankingActivities, activeWeek);
  const clubRoutes: CollectiveRoutesResult = aggregateClubRoutes(allRouteInputs);

  const weeklyGiroActivities = allGiroActivities.filter((act) => {
    const actDate = new Date(act.startDateLocal);
    return actDate >= activeWeek.start && actDate <= activeWeek.end;
  });

  const giroBulletin = compileGiroDaSemana({
    weekNumber: activeWeek.weekNumber,
    year: activeWeek.year,
    activities: weeklyGiroActivities.length > 0 ? weeklyGiroActivities : allGiroActivities,
    previousWeekDistance: allAthletes.map((ath) => ({
      athleteId: String(ath.stravaId),
      totalDistanceKm: 100,
    })),
    editorialNotes: "Pelotão do Cabritos Racing Team reunido com sincronização em nuvem no Supabase!",
  });

  return {
    athletes: allAthletes.map((a) => ({
      id: String(a.stravaId),
      firstname: a.firstname,
      lastname: a.lastname,
      totalXp: a.totalXp,
      profilePictureUrl: a.profilePictureUrl,
    })),
    weeklyRankings,
    clubRoutes,
    giroBulletin,
    activeWeek,
  };
}
