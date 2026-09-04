export interface StravaClubSummary {
  id: number | string;
  name: string;
  sport_type?: string;
}

export function checkClubMembership(userClubs: StravaClubSummary[], requiredClubId: number | string): boolean {
  if (!userClubs || !Array.isArray(userClubs)) {
    return false;
  }
  const targetId = String(requiredClubId).trim();
  return userClubs.some((club) => String(club.id).trim() === targetId);
}

export interface ActivityClassificationInput {
  type: string;
  trainer?: boolean;
}

export function classifyActivity(activity: ActivityClassificationInput): "Outdoor" | "Virtual" | "EBike" {
  if (activity.type === "EBikeRide" || activity.type === "EMountainBikeRide") {
    return "EBike";
  }
  if (activity.type === "VirtualRide" || activity.trainer === true) {
    return "Virtual";
  }
  return "Outdoor";
}

export interface StravaOAuthParams {
  clientId: string;
  redirectUri: string;
  scope?: string;
  state?: string;
}

export function buildStravaAuthorizeUrl(params: StravaOAuthParams): string {
  const scope = params.scope || "read,activity:read_all,profile:read_all";
  const url = new URL("https://www.strava.com/oauth/authorize");
  url.searchParams.set("client_id", params.clientId);
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("approval_prompt", "auto");
  url.searchParams.set("scope", scope);
  if (params.state) {
    url.searchParams.set("state", params.state);
  }
  return url.toString();
}

export interface StravaTokenResponse {
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
  athlete?: {
    id: number;
    firstname: string;
    lastname: string;
    profile_medium?: string;
    profile?: string;
    city?: string;
  };
}

export async function exchangeStravaToken(params: {
  clientId: string;
  clientSecret: string;
  code: string;
}): Promise<StravaTokenResponse> {
  const res = await fetch("https://www.strava.com/api/v3/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: params.clientId,
      client_secret: params.clientSecret,
      code: params.code,
      grant_type: "authorization_code",
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Strava token exchange failed (${res.status}): ${errText}`);
  }

  return (await res.json()) as StravaTokenResponse;
}

