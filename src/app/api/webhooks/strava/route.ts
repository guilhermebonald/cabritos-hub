import { NextRequest, NextResponse, after } from "next/server";
import {
  validateWebhookSubscription,
  parseStravaWebhookEvent,
  StravaWebhookPayload,
} from "@/lib/strava-webhook";
import { getValidAthleteToken, ingestAthleteActivities } from "@/lib/club-store";
import { StravaRawActivity } from "@/lib/backfill";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

const STRAVA_VERIFY_TOKEN = process.env.STRAVA_VERIFY_TOKEN || "cabritos-hub-verify-secret";

/**
 * GET /api/webhooks/strava
 * Handles Strava subscription verification handshake.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const verifyToken = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode !== "subscribe") {
    return NextResponse.json({ error: "Invalid hub.mode" }, { status: 400 });
  }

  const validation = validateWebhookSubscription({
    verifyToken,
    challenge,
    expectedToken: STRAVA_VERIFY_TOKEN,
  });

  if (!validation.isValid || !validation.responseBody) {
    return NextResponse.json({ error: "Forbidden - Invalid verify token" }, { status: 403 });
  }

  return NextResponse.json(validation.responseBody, { status: 200 });
}

/**
 * Process single activity event asynchronously without delaying Strava 2s response timeout.
 */
async function handleActivityWebhook(activityId: number, athleteStravaId: number, action: string) {
  if (action === "delete") {
    await db.delete(schema.activities).where(eq(schema.activities.stravaActivityId, activityId));
    return;
  }

  const token = await getValidAthleteToken(athleteStravaId);
  if (!token) {
    console.warn(`[Strava Webhook] No token available for athlete ${athleteStravaId}`);
    return;
  }

  const res = await fetch(`https://www.strava.com/api/v3/activities/${activityId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    console.error(`[Strava Webhook] Failed to fetch activity ${activityId}:`, res.status);
    return;
  }

  const act = await res.json();
  const rawActivity: StravaRawActivity = {
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
  };

  const athleteRows = await db
    .select()
    .from(schema.athletes)
    .where(eq(schema.athletes.stravaId, athleteStravaId));

  if (athleteRows.length === 0) {
    return;
  }

  const athlete = athleteRows[0];

  await ingestAthleteActivities({
    athlete: {
      id: athlete.stravaId,
      firstname: athlete.firstname,
      lastname: athlete.lastname,
      profile_medium: athlete.profilePictureUrl || undefined,
    },
    rawActivities: [rawActivity],
    accessToken: token,
  });
}

/**
 * POST /api/webhooks/strava
 * Ingests and routes real-time activity events.
 */
export async function POST(req: NextRequest) {
  try {
    const payload: StravaWebhookPayload = await req.json();
    const event = parseStravaWebhookEvent(payload);

    if (!event.isActivityEvent || !event.activityId) {
      return NextResponse.json({ status: "ignored", reason: "non_activity_event" }, { status: 200 });
    }

    // Process in background after 200 response to meet Strava's 2s limit
    // ponytail: queue to BullMQ or durable worker when event volume exceeds single-server capacity
    after(async () => {
      try {
        await handleActivityWebhook(event.activityId!, event.athleteStravaId, event.action);
      } catch (err) {
        console.error("[Strava Webhook Background Ingest Error]:", err);
      }
    });

    return NextResponse.json(
      {
        status: "received",
        action: event.action,
        activityId: event.activityId,
        athleteStravaId: event.athleteStravaId,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }
}
