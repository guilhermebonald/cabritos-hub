import { NextRequest, NextResponse } from "next/server";
import { exchangeStravaToken, checkClubMembership } from "@/lib/strava-auth";
import { ingestAthleteActivities } from "@/lib/club-store";
import { StravaRawActivity } from "@/lib/backfill";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const host = req.headers.get("host") || "localhost:3000";
  const protocol = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}/?auth_error=${encodeURIComponent(error || "missing_code")}`);
  }

  const clientId = process.env.STRAVA_CLIENT_ID || "177152";
  const clientSecret =
    process.env.STRAVA_CLIENT_SECRET || "81a5990cb69dbf68512ed209da9c8344d64a6b32";

  try {
    const tokenData = await exchangeStravaToken({
      clientId,
      clientSecret,
      code,
    });

    // Validar se atleta faz parte do clube oficial (se configurado)
    const rawClubId = process.env.STRAVA_CLUB_ID;
    if (rawClubId && tokenData.access_token) {
      try {
        const clubsRes = await fetch("https://www.strava.com/api/v3/athlete/clubs", {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        if (clubsRes.ok) {
          const clubs = await clubsRes.json();
          console.log(
            `[Strava Auth] Verifying athlete ${tokenData.athlete?.id} against club ${rawClubId}. Found clubs:`,
            Array.isArray(clubs) ? clubs.map((c: any) => ({ id: c.id, name: c.name })) : clubs
          );

          const isMember = checkClubMembership(clubs, rawClubId);
          if (!isMember) {
            console.warn(
              `[Strava Auth] Athlete ${tokenData.athlete?.id} rejected: not found in club ${rawClubId}`
            );
            return NextResponse.redirect(
              `${baseUrl}/?auth_error=not_a_club_member`
            );
          }
        } else {
          const errBody = await clubsRes.text();
          console.warn(`[Strava Auth] Could not fetch athlete clubs (status ${clubsRes.status}):`, errBody);
        }
      } catch (err) {
        console.warn("[Strava Auth] Error verifying club membership, proceeding with caution:", err);
      }
    }

    // Ingestão automática das atividades do atleta conectado
    if (tokenData.access_token && tokenData.athlete) {
      try {
        const actsRes = await fetch(
          "https://www.strava.com/api/v3/athlete/activities?per_page=100",
          {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
          }
        );

        if (actsRes.ok) {
          const acts = await actsRes.json();
          if (Array.isArray(acts)) {
            const rawActivities: StravaRawActivity[] = acts.map((act: any) => ({
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

            await ingestAthleteActivities({
              athlete: {
                id: tokenData.athlete.id,
                firstname: tokenData.athlete.firstname,
                lastname: tokenData.athlete.lastname,
                profile_medium: tokenData.athlete.profile_medium,
                profile: tokenData.athlete.profile,
                city: tokenData.athlete.city,
              },
              rawActivities,
              accessToken: tokenData.access_token,
              refreshToken: tokenData.refresh_token,
              tokenExpiresAt: tokenData.expires_at,
            });
          }
        }
      } catch (ingestErr) {
        console.error("Failed to automatically ingest athlete activities:", ingestErr);
      }
    }

    // Cria resposta redirecionando para perfil com cookie de sessão
    const res = NextResponse.redirect(`${baseUrl}/perfil?sync=success`);

    // Cookie de identificação do atleta
    if (tokenData.athlete) {
      res.cookies.set("cabritos_athlete", JSON.stringify({
        id: tokenData.athlete.id,
        name: `${tokenData.athlete.firstname} ${tokenData.athlete.lastname}`,
        avatar: tokenData.athlete.profile_medium || tokenData.athlete.profile,
      }), {
        path: "/",
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 30, // 30 dias
      });
    }

    return res;
  } catch (err) {
    console.error("Failed to authenticate with Strava:", err);
    return NextResponse.redirect(`${baseUrl}/?auth_error=exchange_failed`);
  }
}

