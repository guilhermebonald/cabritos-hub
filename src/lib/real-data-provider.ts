import { getCollectiveClubData, getAthleteProfileById } from "./club-store";

export async function getRealProfile(athleteId?: string) {
  return await getAthleteProfileById(athleteId);
}

export async function getRealCollectiveData() {
  return await getCollectiveClubData();
}

export async function getRealWeeklyRankings() {
  const collective = await getCollectiveClubData();
  return collective.weeklyRankings;
}

export async function getRealGiroBulletin() {
  const collective = await getCollectiveClubData();
  return collective.giroBulletin;
}

export async function getRealClubRoutes() {
  const collective = await getCollectiveClubData();
  return collective.clubRoutes;
}

export async function getRegisteredAthletes() {
  const collective = await getCollectiveClubData();
  return collective.athletes;
}

export async function getActiveCompetitionWeek() {
  const collective = await getCollectiveClubData();
  return collective.activeWeek;
}
