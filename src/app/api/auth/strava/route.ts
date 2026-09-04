import { NextRequest, NextResponse } from "next/server";
import { buildStravaAuthorizeUrl } from "@/lib/strava-auth";

export async function GET(req: NextRequest) {
  const clientId = process.env.STRAVA_CLIENT_ID || "177152";
  const host = req.headers.get("host") || "localhost:3000";
  const protocol = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const redirectUri = `${protocol}://${host}/api/auth/callback/strava`;

  const authUrl = buildStravaAuthorizeUrl({
    clientId,
    redirectUri,
    scope: "read,activity:read",
  });

  return NextResponse.redirect(authUrl);
}
