export type CardFormat = "stories" | "feed";

export interface CardDimensions {
  width: number;
  height: number;
}

export type SocialCardType = "podium" | "badge" | "level_up" | "activity";

export interface SocialCardParams {
  type: SocialCardType;
  title?: string;
  athleteName: string;
  metricValue?: string;
  subtitle?: string;
  tier?: string;
  badgeIcon?: string;
  xpGained?: number;
  format?: CardFormat;
}

export interface FormattedSocialCardProps {
  headline: string;
  title: string;
  athlete: string;
  metric: string;
  tag: string;
  tier: string;
  icon: string;
  formattedXp: string;
  accentColor: string;
  dimensions: CardDimensions;
}

export function getCardDimensions(format: CardFormat = "feed"): CardDimensions {
  if (format === "stories") {
    return { width: 1080, height: 1920 };
  }
  return { width: 1200, height: 630 };
}

export function formatSocialCardProps(params: SocialCardParams): FormattedSocialCardProps {
  const dimensions = getCardDimensions(params.format);
  const athlete = params.athleteName;
  const tag = params.subtitle || "Cabritos Cycling Club";
  const tier = params.tier || "Novato";
  const formattedXp = params.xpGained !== undefined ? `${params.xpGained.toLocaleString("pt-BR")} XP` : "";

  switch (params.type) {
    case "podium":
      return {
        headline: params.title || "Pódio da Semana",
        title: params.title || "Campeão do Ciclo",
        athlete,
        metric: params.metricValue || "",
        tag,
        tier,
        icon: "🏆",
        formattedXp,
        accentColor: "#f59e0b", // Amber
        dimensions,
      };

    case "badge":
      return {
        headline: "Nova Conquista Desbloqueada!",
        title: params.title || "Conquista Cabritos",
        athlete,
        metric: params.metricValue || "",
        tag,
        tier,
        icon: params.badgeIcon || "🎖️",
        formattedXp,
        accentColor: "#8b5cf6", // Purple
        dimensions,
      };

    case "level_up":
      return {
        headline: "Subiu de Nível!",
        title: params.title || `Nível ${params.tier}`,
        athlete,
        metric: params.metricValue || "",
        tag,
        tier,
        icon: "⚡",
        formattedXp,
        accentColor: "#10b981", // Emerald
        dimensions,
      };

    case "activity":
    default:
      return {
        headline: "Pedal Concluído!",
        title: params.title || "Giro do Cabrito",
        athlete,
        metric: params.metricValue || "",
        tag,
        tier,
        icon: "🚴",
        formattedXp,
        accentColor: "#38bdf8", // Sky
        dimensions,
      };
  }
}
