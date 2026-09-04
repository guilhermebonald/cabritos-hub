import { aggregateWeeklyRankings, AthleteWeeklyStats } from "./rankings";

export interface GiroActivityInput {
  id: string;
  athleteId: string;
  athleteName: string;
  distanceMeters: number;
  elevationGainMeters: number;
  movingTimeSeconds: number;
  startDateLocal: string; // ISO string or format "YYYY-MM-DDTHH:mm:ssZ"
  averageSpeedKph: number;
  activityType: "Outdoor" | "Virtual" | "EBike";
  isEligibleForRanking: boolean;
}

export interface AthleteHistoricalDistance {
  athleteId: string;
  totalDistanceKm: number;
}

export interface HumorousAwardWinner {
  athleteId: string;
  athleteName: string;
  title: string;
  icon: string;
  badgeCode: string;
  activityId?: string;
  metricDescription: string;
}

export interface HumorousAwardsSummary {
  vampiro?: HumorousAwardWinner;
  trator?: HumorousAwardWinner;
  foguete?: HumorousAwardWinner;
  cafe?: HumorousAwardWinner;
}

export interface GrowthHighlight {
  athleteId: string;
  athleteName: string;
  currentKm: number;
  previousKm: number;
  growthPercentage: number;
}

export interface GiroDaSemanaBulletin {
  weekNumber: number;
  year: number;
  status: "draft" | "published";
  summaryHeadline: string;
  editorialNotes?: string;
  totalDistanceKm: number;
  totalElevationMeters: number;
  totalActivities: number;
  reiDistancia: { first?: AthleteWeeklyStats; podium: AthleteWeeklyStats[] };
  reiMontanha: { first?: AthleteWeeklyStats; podium: AthleteWeeklyStats[] };
  maisConsistente: { first?: AthleteWeeklyStats; podium: AthleteWeeklyStats[] };
  maiorEvolucao?: GrowthHighlight;
  humorousAwards: HumorousAwardsSummary;
}

export function evaluateHumorousAwards(activities: GiroActivityInput[]): HumorousAwardsSummary {
  const eligible = activities.filter((a) => a.isEligibleForRanking && a.activityType === "Outdoor");

  let vampiroBest: { act: GiroActivityInput; timeStr: string } | null = null;
  let tratorBest: { act: GiroActivityInput; ratio: number } | null = null;
  let fogueteBest: { act: GiroActivityInput; speed: number } | null = null;
  let cafeBest: { act: GiroActivityInput; speed: number } | null = null;

  for (const act of eligible) {
    const km = act.distanceMeters / 1000;
    const timePart = act.startDateLocal.split("T")[1] || "";
    const hour = parseInt(timePart.slice(0, 2), 10);
    const timeFormatted = timePart.slice(0, 5);

    // Vampiro: 00:00 to 04:59
    if (hour >= 0 && hour < 5) {
      if (!vampiroBest || act.distanceMeters > vampiroBest.act.distanceMeters) {
        vampiroBest = { act, timeStr: timeFormatted };
      }
    }

    // Trator: highest elevation-to-distance ratio (m/km) on rides >= 15km
    if (km >= 15 && act.elevationGainMeters > 0) {
      const ratio = Math.round(act.elevationGainMeters / km);
      if (!tratorBest || ratio > tratorBest.ratio) {
        tratorBest = { act, ratio };
      }
    }

    // Foguete: highest avg speed on rides >= 30km
    if (km >= 30 && act.averageSpeedKph >= 35) {
      if (!fogueteBest || act.averageSpeedKph > fogueteBest.speed) {
        fogueteBest = { act, speed: act.averageSpeedKph };
      }
    }

    // Café: relaxed ride <= 20km and avg speed <= 20 km/h
    if (km <= 20 && act.averageSpeedKph <= 20) {
      if (!cafeBest || act.averageSpeedKph < cafeBest.speed) {
        cafeBest = { act, speed: act.averageSpeedKph };
      }
    }
  }

  const result: HumorousAwardsSummary = {};

  if (vampiroBest) {
    result.vampiro = {
      athleteId: vampiroBest.act.athleteId,
      athleteName: vampiroBest.act.athleteName,
      title: "Vampiro da Madrugada",
      icon: "🧛",
      badgeCode: "vampire_secret",
      activityId: vampiroBest.act.id,
      metricDescription: `Pedal iniciado às ${vampiroBest.timeStr} (${Math.round(vampiroBest.act.distanceMeters / 1000)} km)`,
    };
  }

  if (tratorBest) {
    result.trator = {
      athleteId: tratorBest.act.athleteId,
      athleteName: tratorBest.act.athleteName,
      title: "Trator da Semana",
      icon: "🚜",
      badgeCode: "trator_bruto",
      activityId: tratorBest.act.id,
      metricDescription: `${tratorBest.ratio} m/km escalados (${tratorBest.act.elevationGainMeters}m em ${Math.round(tratorBest.act.distanceMeters / 1000)}km)`,
    };
  }

  if (fogueteBest) {
    result.foguete = {
      athleteId: fogueteBest.act.athleteId,
      athleteName: fogueteBest.act.athleteName,
      title: "Foguete do Asfalto",
      icon: "🚀",
      badgeCode: "rocket_speed_40kph",
      activityId: fogueteBest.act.id,
      metricDescription: `Média avassaladora de ${fogueteBest.speed} km/h em ${Math.round(fogueteBest.act.distanceMeters / 1000)} km`,
    };
  }

  if (cafeBest) {
    result.cafe = {
      athleteId: cafeBest.act.athleteId,
      athleteName: cafeBest.act.athleteName,
      title: "Ciclista Café",
      icon: "☕",
      badgeCode: "coffee_ride",
      activityId: cafeBest.act.id,
      metricDescription: `Rolê suave de ${Math.round(cafeBest.act.distanceMeters / 1000)} km a ${cafeBest.speed} km/h`,
    };
  }

  return result;
}

export function compileGiroDaSemana(params: {
  weekNumber: number;
  year: number;
  activities: GiroActivityInput[];
  previousWeekDistance: AthleteHistoricalDistance[];
  editorialNotes?: string;
}): GiroDaSemanaBulletin {
  const eligible = params.activities.filter((a) => a.isEligibleForRanking);
  const rankings = aggregateWeeklyRankings(
    eligible.map((a) => ({
      athleteId: a.athleteId,
      athleteName: a.athleteName,
      distanceMeters: a.distanceMeters,
      elevationGainMeters: a.elevationGainMeters,
      movingTimeSeconds: a.movingTimeSeconds,
      startDateLocal: a.startDateLocal,
      isEligibleForRanking: a.isEligibleForRanking,
      activityType: a.activityType,
    }))
  );

  const totalDistanceKm = Math.round(eligible.reduce((acc, a) => acc + a.distanceMeters / 1000, 0) * 10) / 10;
  const totalElevationMeters = eligible.reduce((acc, a) => acc + a.elevationGainMeters, 0);
  const totalActivities = eligible.length;

  // Calculate Maior Evolução
  const prevMap = new Map<string, number>(params.previousWeekDistance.map((p) => [p.athleteId, p.totalDistanceKm]));
  let highestGrowth: GrowthHighlight | undefined;

  for (const curr of rankings.distancePodium) {
    const prevKm = prevMap.get(curr.athleteId);
    if (prevKm !== undefined && prevKm > 0) {
      const growth = Math.round(((curr.totalDistanceKm - prevKm) / prevKm) * 100);
      if (growth > 0 && (!highestGrowth || growth > highestGrowth.growthPercentage)) {
        highestGrowth = {
          athleteId: curr.athleteId,
          athleteName: curr.athleteName,
          currentKm: curr.totalDistanceKm,
          previousKm: prevKm,
          growthPercentage: growth,
        };
      }
    }
  }

  const humorousAwards = evaluateHumorousAwards(params.activities);

  // ponytail: dynamic headline template; add AI LLM summaries when editorial pipeline grows
  const topDistance = rankings.distancePodium[0];
  const summaryHeadline = topDistance
    ? `${topDistance.athleteName} dominou a semana com ${topDistance.totalDistanceKm} km pedalados!`
    : "Semana tranquila no Cabritos Hub.";

  return {
    weekNumber: params.weekNumber,
    year: params.year,
    status: "draft",
    summaryHeadline,
    editorialNotes: params.editorialNotes,
    totalDistanceKm,
    totalElevationMeters,
    totalActivities,
    reiDistancia: {
      first: rankings.distancePodium[0],
      podium: rankings.distancePodium.slice(0, 3),
    },
    reiMontanha: {
      first: rankings.mountainPodium[0],
      podium: rankings.mountainPodium.slice(0, 3),
    },
    maisConsistente: {
      first: rankings.consistencyPodium[0],
      podium: rankings.consistencyPodium.slice(0, 3),
    },
    maiorEvolucao: highestGrowth,
    humorousAwards,
  };
}
