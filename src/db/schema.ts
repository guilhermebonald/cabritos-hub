import { pgTable, text, integer, numeric, boolean, timestamp, uuid, bigint, pgEnum } from "drizzle-orm/pg-core";

export const activityTypeEnum = pgEnum("activity_type", ["Outdoor", "Virtual", "EBike"]);
export const challengeScopeEnum = pgEnum("challenge_scope", ["individual", "collective"]);
export const challengeDifficultyEnum = pgEnum("challenge_difficulty", ["easy", "medium", "hard"]);
export const challengeMetricEnum = pgEnum("challenge_metric", ["distance", "elevation", "days_active", "single_ride_distance"]);
export const weeklyEditionStatusEnum = pgEnum("weekly_edition_status", ["draft", "published"]);

export const athletes = pgTable("athletes", {
  id: uuid("id").defaultRandom().primaryKey(),
  stravaId: bigint("strava_id", { mode: "number" }).notNull().unique(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  profilePictureUrl: text("profile_picture_url"),
  isClubMember: boolean("is_club_member").default(false).notNull(),
  stravaAccessToken: text("strava_access_token"),
  stravaRefreshToken: text("strava_refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at"),
  totalXp: integer("total_xp").default(0).notNull(),
  currentLevel: integer("current_level").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const activities = pgTable("activities", {
  id: uuid("id").defaultRandom().primaryKey(),
  athleteId: uuid("athlete_id").references(() => athletes.id, { onDelete: "cascade" }).notNull(),
  stravaActivityId: bigint("strava_activity_id", { mode: "number" }).notNull().unique(),
  name: text("name").notNull(),
  type: activityTypeEnum("type").notNull(),
  startDateLocal: timestamp("start_date_local").notNull(),
  distanceMeters: numeric("distance_meters").notNull(),
  movingTimeSeconds: integer("moving_time_seconds").notNull(),
  elevationGainMeters: numeric("elevation_gain_meters").notNull(),
  averageSpeedKph: numeric("average_speed_kph").notNull(),
  maxSpeedKph: numeric("max_speed_kph").notNull(),
  summaryPolyline: text("summary_polyline"),
  isEligibleForRanking: boolean("is_eligible_for_ranking").default(true).notNull(),
  xpAwarded: integer("xp_awarded").default(0).notNull(),
  processedAt: timestamp("processed_at").defaultNow().notNull(),
});
