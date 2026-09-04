import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { getWeekBounds, aggregateWeeklyRankings, ActivityRecord } from "@/lib/rankings";
import { compileGiroDaSemana, GiroActivityInput } from "@/lib/giro";
import { eq, and } from "drizzle-orm";

export const runtime = "nodejs";

/**
 * GET /api/cron/weekly-giro
 * Freezes and publishes the finalized weekly edition and podiums every Sunday at 23:59.
 * Secures with CRON_SECRET header or query param.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const { searchParams } = new URL(req.url);
  const secretParam = searchParams.get("secret");
  const expectedSecret = process.env.CRON_SECRET || process.env.STRAVA_VERIFY_TOKEN || "cabritos-hub-verify-secret";

  if (authHeader !== `Bearer ${expectedSecret}` && secretParam !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const currentWeek = getWeekBounds(now);

  // Check if edition already published
  const existing = await db
    .select()
    .from(schema.weeklyEditions)
    .where(
      and(
        eq(schema.weeklyEditions.weekNumber, currentWeek.weekNumber),
        eq(schema.weeklyEditions.year, currentWeek.year)
      )
    );

  const allAthletes = await db.select().from(schema.athletes);
  const allActivities = await db.select().from(schema.activities);
  const athleteMap = new Map(allAthletes.map((a) => [a.id, a]));

  const allRankingActivities: ActivityRecord[] = [];
  const weeklyGiroActivities: GiroActivityInput[] = [];

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

    const actDate = act.startDateLocal;
    if (actDate >= currentWeek.start && actDate <= currentWeek.end) {
      weeklyGiroActivities.push({
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
    }
  }

  const rankings = aggregateWeeklyRankings(allRankingActivities, currentWeek);
  const bulletin = compileGiroDaSemana({
    weekNumber: currentWeek.weekNumber,
    year: currentWeek.year,
    activities: weeklyGiroActivities,
    previousWeekDistance: allAthletes.map((ath) => ({
      athleteId: String(ath.stravaId),
      totalDistanceKm: 100,
    })),
    editorialNotes: "Edição semanal congelada automaticamente pelo Vercel Cron.",
  });

  let editionId: string;

  if (existing.length > 0) {
    editionId = existing[0].id;
    await db
      .update(schema.weeklyEditions)
      .set({
        status: "published",
        summaryHeadline: bulletin.summaryHeadline,
        editorialNotes: bulletin.editorialNotes,
        publishedAt: new Date(),
      })
      .where(eq(schema.weeklyEditions.id, editionId));
  } else {
    const inserted = await db
      .insert(schema.weeklyEditions)
      .values({
        weekNumber: currentWeek.weekNumber,
        year: currentWeek.year,
        startsAt: currentWeek.start,
        endsAt: currentWeek.end,
        status: "published",
        summaryHeadline: bulletin.summaryHeadline,
        editorialNotes: bulletin.editorialNotes,
        publishedAt: new Date(),
      })
      .returning({ id: schema.weeklyEditions.id });
    editionId = inserted[0].id;
  }

  return NextResponse.json({
    status: "ok",
    editionId,
    weekNumber: currentWeek.weekNumber,
    year: currentWeek.year,
    podiums: {
      yellowJersey: rankings.distancePodium[0]?.athleteName || null,
      polkaDotJersey: rankings.mountainPodium[0]?.athleteName || null,
      greenJersey: rankings.consistencyPodium[0]?.athleteName || null,
    },
  });
}
