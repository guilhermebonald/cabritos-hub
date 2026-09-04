export interface XpCalculationInput {
  distanceMeters: number;
  elevationGainMeters: number;
  activityType: "Outdoor" | "Virtual" | "EBike";
  daysRiddenInWeek?: number;
}

export interface XpCalculationResult {
  baseXp: number;
  distanceXp: number;
  elevationXp: number;
  totalXp: number;
}

export function calculateActivityXp(input: XpCalculationInput): XpCalculationResult {
  const km = input.distanceMeters / 1000;
  const elevation = input.elevationGainMeters;

  // Diminishing returns on extreme single-day mileage:
  // First 80km: 10 XP/km
  // 80km to 150km: 5 XP/km (50%)
  // Beyond 150km: 2.5 XP/km (25%)
  let distanceXp = 0;
  if (km <= 80) {
    distanceXp = km * 10;
  } else if (km <= 150) {
    distanceXp = 80 * 10 + (km - 80) * 5;
  } else {
    distanceXp = 80 * 10 + 70 * 5 + (km - 150) * 2.5;
  }

  // Elevation: 1 XP per 10m gain (0.1 XP/m)
  const elevationXp = elevation / 10;

  const baseXp = Math.round(distanceXp + elevationXp);

  // Consistency multiplier: (1 + 0.05 * (N - 1)) where N is distinct days in week
  const days = Math.max(1, Math.min(7, input.daysRiddenInWeek ?? 1));
  const consistencyMultiplier = 1 + 0.05 * (days - 1);

  const totalXp = Math.round(baseXp * consistencyMultiplier);

  return {
    baseXp,
    distanceXp: Math.round(distanceXp),
    elevationXp: Math.round(elevationXp),
    totalXp,
  };
}

export interface LevelInfo {
  level: number;
  tierName: string;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
}

export function getLevelFromXp(totalXp: number): LevelInfo {
  // Required XP for level L: 1000 * L^1.5
  let level = 1;
  while (totalXp >= Math.round(1000 * Math.pow(level, 1.5))) {
    level++;
  }

  const prevThreshold = level === 1 ? 0 : Math.round(1000 * Math.pow(level - 1, 1.5));
  const nextThreshold = Math.round(1000 * Math.pow(level, 1.5));
  const xpIntoCurrentLevel = totalXp - prevThreshold;
  const xpNeededForLevel = nextThreshold - prevThreshold;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpIntoCurrentLevel / xpNeededForLevel) * 100)));

  let tierName = "Novato";
  if (level >= 76) tierName = "Lenda";
  else if (level >= 51) tierName = "Monstro";
  else if (level >= 31) tierName = "Escalador";
  else if (level >= 16) tierName = "Explorador";
  else if (level >= 6) tierName = "Pedaleiro";

  return {
    level,
    tierName,
    currentLevelXp: totalXp,
    nextLevelXp: nextThreshold,
    progressPercent,
  };
}
