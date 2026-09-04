import { NextRequest, NextResponse } from "next/server";
import {
  validateWebhookSubscription,
  parseStravaWebhookEvent,
  StravaWebhookPayload,
} from "@/lib/strava-webhook";

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
 * POST /api/webhooks/strava
 * Ingests and routes real-time activity events.
 */
export async function POST(req: NextRequest) {
  try {
    const payload: StravaWebhookPayload = await req.json();

    const event = parseStravaWebhookEvent(payload);

    // If not an activity event (e.g. athlete deauthorization), acknowledge 200 immediately
    if (!event.isActivityEvent) {
      return NextResponse.json({ status: "ignored", reason: "non_activity_event" }, { status: 200 });
    }

    // ponytail: queue background worker or job dispatch for activity fetch & XP recalculation
    // Strava requires HTTP 200 response within 2 seconds.
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
