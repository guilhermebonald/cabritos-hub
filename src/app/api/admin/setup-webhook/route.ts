import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * GET /api/admin/setup-webhook
 * Diagnostic & Setup tool for Strava Webhook Subscriptions.
 * Requires ?secret=cabritos-hub-verify-secret
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const expectedSecret = process.env.STRAVA_VERIFY_TOKEN || "cabritos-hub-verify-secret";

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized - invalid admin secret" }, { status: 401 });
  }

  const clientId = process.env.STRAVA_CLIENT_ID || "177152";
  const clientSecret = process.env.STRAVA_CLIENT_SECRET || "81a5990cb69dbf68512ed209da9c8344d64a6b32";

  try {
    // 1. Check existing subscriptions
    const subRes = await fetch(
      `https://www.strava.com/api/v3/push_subscriptions?client_id=${clientId}&client_secret=${clientSecret}`
    );
    const existing = await subRes.json();

    return NextResponse.json({
      status: "ok",
      subscriptions: existing,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/setup-webhook
 * Registers Strava Webhook for cabritos-hub.
 */
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const expectedSecret = process.env.STRAVA_VERIFY_TOKEN || "cabritos-hub-verify-secret";

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientId = process.env.STRAVA_CLIENT_ID || "177152";
  const clientSecret = process.env.STRAVA_CLIENT_SECRET || "81a5990cb69dbf68512ed209da9c8344d64a6b32";
  const host = req.headers.get("host") || "cabritos-hub.vercel.app";
  const protocol = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const callbackUrl = `${protocol}://${host}/api/webhooks/strava`;

  try {
    const res = await fetch("https://www.strava.com/api/v3/push_subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        callback_url: callbackUrl,
        verify_token: expectedSecret,
      }),
    });

    const body = await res.json();
    return NextResponse.json({
      status: res.status,
      result: body,
      callbackUrl,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
