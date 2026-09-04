export interface ChallengeItem {
  id: string;
  scope: "individual" | "collective";
  difficulty: "easy" | "medium" | "hard";
  title: string;
  description: string;
  metric: "distance" | "elevation" | "days_active" | "single_ride_distance";
  targetValue: number;
  xpReward: number;
}

export const DEFAULT_WEEKLY_CHALLENGES: ChallengeItem[] = [
  {
    id: "ch_easy_dist",
    scope: "individual",
    difficulty: "easy",
    title: "Giro de Aquecimento",
    description: "Pedale pelo menos 60 km durante a semana.",
    metric: "distance",
    targetValue: 60, // km
    xpReward: 250,
  },
  {
    id: "ch_med_consist",
    scope: "individual",
    difficulty: "medium",
    title: "Consistência de Ferro",
    description: "Pedale em pelo menos 4 dias diferentes da semana.",
    metric: "days_active",
    targetValue: 4, // dias
    xpReward: 500,
  },
  {
    id: "ch_hard_mountain",
    scope: "individual",
    difficulty: "hard",
    title: "Desafio das Alturas",
    description: "Acumule 2.500 metros de altimetria na semana.",
    metric: "elevation",
    targetValue: 2500, // metros
    xpReward: 800,
  },
  {
    id: "ch_club_collective",
    scope: "collective",
    difficulty: "hard",
    title: "Missão Cabritos 2.000k",
    description: "O clube deve somar 2.000 km coletivos até domingo.",
    metric: "distance",
    targetValue: 2000, // km do clube
    xpReward: 300, // bônus para todos
  },
];

export function evaluateChallengeProgress(
  challenge: ChallengeItem,
  currentValue: number
): { progressPercent: number; isCompleted: boolean } {
  const percent = Math.min(100, Math.max(0, Math.round((currentValue / challenge.targetValue) * 100)));
  return {
    progressPercent: percent,
    isCompleted: currentValue >= challenge.targetValue,
  };
}
