import { NextRequest, NextResponse } from "next/server";
import { exchangeStravaToken, checkClubMembership } from "@/lib/strava-auth";

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
    const clubId = process.env.STRAVA_CLUB_ID ? Number(process.env.STRAVA_CLUB_ID) : null;
    if (clubId && tokenData.access_token) {
      try {
        const clubsRes = await fetch("https://www.strava.com/api/v3/athlete/clubs", {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        if (clubsRes.ok) {
          const clubs = await clubsRes.json();
          const isMember = checkClubMembership(clubs, clubId);
          if (!isMember) {
            return NextResponse.redirect(
              `${baseUrl}/?auth_error=not_a_club_member`
            );
          }
        }
      } catch (err) {
        console.warn("Could not verify club membership, proceeding with caution:", err);
      }
    }

    // Cria resposta redirecionando para perfil com cookie de sessão
    const res = NextResponse.redirect(`${baseUrl}/perfil?sync=success`);

    // Cookie básico de sessão do atleta
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
