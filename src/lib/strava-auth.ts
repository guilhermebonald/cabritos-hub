export interface StravaClubSummary {
  id: number;
  name: string;
  sport_type?: string;
}

export function checkClubMembership(userClubs: StravaClubSummary[], requiredClubId: number): boolean {
  if (!userClubs || !Array.isArray(userClubs)) {
    return false;
  }
  return userClubs.some((club) => club.id === requiredClubId);
}

export interface ActivityClassificationInput {
  type: string;
  trainer?: boolean;
}

export function classifyActivity(activity: ActivityClassificationInput): "Outdoor" | "Virtual" | "EBike" {
  if (activity.type === "EBikeRide") {
    return "EBike";
  }
  if (activity.type === "VirtualRide" || activity.trainer === true) {
    return "Virtual";
  }
  return "Outdoor";
}
