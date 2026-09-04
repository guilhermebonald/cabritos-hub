export interface BadgeDefinition {
  code: string;
  title: string;
  description: string;
  icon: string;
  isSecret: boolean;
  xpBonus: number;
}

export const SYSTEM_BADGES: BadgeDefinition[] = [
  {
    code: "century_100k",
    title: "Centurião dos Cabritos",
    description: "Completou um pedal de pelo menos 100 km em uma única atividade.",
    icon: "🏅",
    isSecret: false,
    xpBonus: 500,
  },
  {
    code: "elevation_10k",
    title: "Cabrito Montanhês",
    description: "Acumulou mais de 10.000 metros de altimetria na temporada.",
    icon: "⛰️",
    isSecret: false,
    xpBonus: 1000,
  },
  {
    code: "rocket_speed_40kph",
    title: "Foguete do Asfalto",
    description: "Pedal acima de 30 km com velocidade média superior a 35 km/h.",
    icon: "🚀",
    isSecret: false,
    xpBonus: 300,
  },
  {
    code: "vampire_secret",
    title: "Vampiro da Madrugada",
    description: "Pedal realizado completamente entre meia-noite e 05:00 da manhã.",
    icon: "🧛",
    isSecret: true,
    xpBonus: 400,
  },
  {
    code: "coffee_ride",
    title: "Ciclista Café",
    description: "Pedal de confraternização com parada relaxada e ritmo suave.",
    icon: "☕",
    isSecret: true,
    xpBonus: 150,
  },
];

export interface ActivityBadgeEvaluationInput {
  distanceMeters: number;
  elevationGainMeters: number;
  averageSpeedKph: number;
  startDateLocal: string; // ISO string
  totalSeasonElevationMeters: number;
  alreadyUnlockedBadgeCodes: Set<string>;
}

export function evaluateBadgesForActivity(input: ActivityBadgeEvaluationInput): BadgeDefinition[] {
  const unlocked: BadgeDefinition[] = [];
  const km = input.distanceMeters / 1000;
  // Extract hour directly from local timestamp representation (e.g. "2026-09-02T02:30:00Z" -> 2)
  // to avoid timezone drift across execution environments
  const timePart = input.startDateLocal.split("T")[1] || "";
  const hour = parseInt(timePart.slice(0, 2), 10);

  // Century 100k
  if (km >= 100 && !input.alreadyUnlockedBadgeCodes.has("century_100k")) {
    const badge = SYSTEM_BADGES.find((b) => b.code === "century_100k");
    if (badge) unlocked.push(badge);
  }

  // 10k elevation season
  if (input.totalSeasonElevationMeters >= 10000 && !input.alreadyUnlockedBadgeCodes.has("elevation_10k")) {
    const badge = SYSTEM_BADGES.find((b) => b.code === "elevation_10k");
    if (badge) unlocked.push(badge);
  }

  // Rocket Speed (avg speed >= 35 km/h on ride > 30km)
  if (km >= 30 && input.averageSpeedKph >= 35 && !input.alreadyUnlockedBadgeCodes.has("rocket_speed_40kph")) {
    const badge = SYSTEM_BADGES.find((b) => b.code === "rocket_speed_40kph");
    if (badge) unlocked.push(badge);
  }

  // Vampire Secret (started between 00:00 and 04:59)
  if (hour >= 0 && hour < 5 && !input.alreadyUnlockedBadgeCodes.has("vampire_secret")) {
    const badge = SYSTEM_BADGES.find((b) => b.code === "vampire_secret");
    if (badge) unlocked.push(badge);
  }

  return unlocked;
}
