import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { formatSocialCardProps, CardFormat, SocialCardType } from "@/lib/social-cards";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const type = (searchParams.get("type") as SocialCardType) || "podium";
  const title = searchParams.get("title") || undefined;
  const athleteName = searchParams.get("athlete") || "Ciclista Cabritos";
  const metricValue = searchParams.get("metric") || undefined;
  const subtitle = searchParams.get("subtitle") || undefined;
  const tier = searchParams.get("tier") || undefined;
  const badgeIcon = searchParams.get("icon") || undefined;
  const xpGained = searchParams.get("xp") ? parseInt(searchParams.get("xp")!, 10) : undefined;
  const format = (searchParams.get("format") as CardFormat) || "feed";

  const card = formatSocialCardProps({
    type,
    title,
    athleteName,
    metricValue,
    subtitle,
    tier,
    badgeIcon,
    xpGained,
    format,
  });

  const isStories = format === "stories";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: isStories ? "space-between" : "space-between",
          alignItems: "flex-start",
          backgroundColor: "#020617", // slate-950
          backgroundImage: "radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%)",
          backgroundSize: "50px 50px",
          padding: isStories ? "120px 80px" : "60px 80px",
          fontFamily: "sans-serif",
          color: "#f8fafc",
          boxSizing: "border-box",
        }}
      >
        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: isStories ? "64px" : "48px" }}>🐐</span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: isStories ? "36px" : "28px",
                  fontWeight: 900,
                  letterSpacing: "-0.05em",
                  color: "#f59e0b",
                }}
              >
                Cabritos Hub
              </span>
              <span style={{ fontSize: isStories ? "22px" : "16px", color: "#94a3b8" }}>
                {card.tag}
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              backgroundColor: "rgba(245, 158, 11, 0.15)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              borderRadius: "9999px",
              padding: isStories ? "16px 32px" : "10px 24px",
              color: "#fbbf24",
              fontSize: isStories ? "28px" : "18px",
              fontWeight: 700,
            }}
          >
            {card.tier}
          </div>
        </div>

        {/* Center Highlight */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: isStories ? "32px" : "16px",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <span style={{ fontSize: isStories ? "80px" : "60px" }}>{card.icon}</span>
            <span
              style={{
                fontSize: isStories ? "32px" : "22px",
                fontWeight: 800,
                color: card.accentColor,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {card.headline}
            </span>
          </div>

          <span
            style={{
              fontSize: isStories ? "84px" : "56px",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "#ffffff",
            }}
          >
            {card.athlete}
          </span>

          {card.metric && (
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "12px",
                marginTop: "8px",
              }}
            >
              <span
                style={{
                  fontSize: isStories ? "64px" : "44px",
                  fontWeight: 900,
                  color: "#f59e0b",
                }}
              >
                {card.metric}
              </span>
            </div>
          )}

          {card.formattedXp && (
            <span
              style={{
                fontSize: isStories ? "36px" : "24px",
                fontWeight: 700,
                color: "#10b981",
              }}
            >
              +{card.formattedXp}
            </span>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid #1e293b",
            paddingTop: isStories ? "40px" : "24px",
          }}
        >
          <span style={{ fontSize: isStories ? "24px" : "16px", color: "#64748b" }}>
            cabritos-hub.vercel.app
          </span>
          <span
            style={{
              fontSize: isStories ? "24px" : "16px",
              fontWeight: 600,
              color: "#94a3b8",
            }}
          >
            Gamificação & Performance do Clube
          </span>
        </div>
      </div>
    ),
    {
      width: card.dimensions.width,
      height: card.dimensions.height,
    }
  );
}
