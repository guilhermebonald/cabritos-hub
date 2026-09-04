export interface StravaClubMember {
  id: number;
  firstname: string;
  lastname: string;
  profile_medium?: string;
}

export interface HubRegisteredAthlete {
  stravaId: number;
  name: string;
}

export interface PendingClubMembersResult {
  totalClubMembers: number;
  registeredCount: number;
  pendingCount: number;
  pendingMembers: StravaClubMember[];
}

export function computePendingClubMembers(
  stravaClubMembers: StravaClubMember[],
  registeredAthletes: HubRegisteredAthlete[]
): PendingClubMembersResult {
  const registeredIds = new Set(registeredAthletes.map((a) => a.stravaId));

  const pendingMembers = stravaClubMembers.filter((member) => !registeredIds.has(member.id));

  return {
    totalClubMembers: stravaClubMembers.length,
    registeredCount: registeredAthletes.length,
    pendingCount: pendingMembers.length,
    pendingMembers,
  };
}
