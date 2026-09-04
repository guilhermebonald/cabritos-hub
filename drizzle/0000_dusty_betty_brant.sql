CREATE TYPE "public"."activity_type" AS ENUM('Outdoor', 'Virtual', 'EBike');--> statement-breakpoint
CREATE TYPE "public"."challenge_difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."challenge_metric" AS ENUM('distance', 'elevation', 'days_active', 'single_ride_distance');--> statement-breakpoint
CREATE TYPE "public"."challenge_scope" AS ENUM('individual', 'collective');--> statement-breakpoint
CREATE TYPE "public"."weekly_edition_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"athlete_id" uuid NOT NULL,
	"strava_activity_id" bigint NOT NULL,
	"name" text NOT NULL,
	"type" "activity_type" NOT NULL,
	"start_date_local" timestamp NOT NULL,
	"distance_meters" numeric NOT NULL,
	"moving_time_seconds" integer NOT NULL,
	"elevation_gain_meters" numeric NOT NULL,
	"average_speed_kph" numeric NOT NULL,
	"max_speed_kph" numeric NOT NULL,
	"summary_polyline" text,
	"is_eligible_for_ranking" boolean DEFAULT true NOT NULL,
	"xp_awarded" integer DEFAULT 0 NOT NULL,
	"processed_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "activities_strava_activity_id_unique" UNIQUE("strava_activity_id")
);
--> statement-breakpoint
CREATE TABLE "athlete_badges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"athlete_id" uuid NOT NULL,
	"badge_code" text NOT NULL,
	"unlocked_at" timestamp DEFAULT now() NOT NULL,
	"trigger_activity_id" uuid
);
--> statement-breakpoint
CREATE TABLE "athlete_challenges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"athlete_id" uuid NOT NULL,
	"challenge_id" uuid NOT NULL,
	"current_value" numeric DEFAULT '0' NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "athletes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"strava_id" bigint NOT NULL,
	"firstname" text NOT NULL,
	"lastname" text NOT NULL,
	"profile_picture_url" text,
	"is_club_member" boolean DEFAULT false NOT NULL,
	"strava_access_token" text,
	"strava_refresh_token" text,
	"token_expires_at" timestamp,
	"total_xp" integer DEFAULT 0 NOT NULL,
	"current_level" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "athletes_strava_id_unique" UNIQUE("strava_id")
);
--> statement-breakpoint
CREATE TABLE "badges" (
	"code" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"icon" text NOT NULL,
	"is_secret" boolean DEFAULT false NOT NULL,
	"xp_bonus" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "challenges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"weekly_edition_id" uuid,
	"scope" "challenge_scope" NOT NULL,
	"difficulty" "challenge_difficulty" NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"metric" "challenge_metric" NOT NULL,
	"target_value" numeric NOT NULL,
	"xp_reward" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weekly_editions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"week_number" integer NOT NULL,
	"year" integer NOT NULL,
	"starts_at" timestamp NOT NULL,
	"ends_at" timestamp NOT NULL,
	"status" "weekly_edition_status" DEFAULT 'draft' NOT NULL,
	"summary_headline" text,
	"editorial_notes" text,
	"published_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_athlete_id_athletes_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_badges" ADD CONSTRAINT "athlete_badges_athlete_id_athletes_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_badges" ADD CONSTRAINT "athlete_badges_badge_code_badges_code_fk" FOREIGN KEY ("badge_code") REFERENCES "public"."badges"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_badges" ADD CONSTRAINT "athlete_badges_trigger_activity_id_activities_id_fk" FOREIGN KEY ("trigger_activity_id") REFERENCES "public"."activities"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_challenges" ADD CONSTRAINT "athlete_challenges_athlete_id_athletes_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_challenges" ADD CONSTRAINT "athlete_challenges_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_weekly_edition_id_weekly_editions_id_fk" FOREIGN KEY ("weekly_edition_id") REFERENCES "public"."weekly_editions"("id") ON DELETE cascade ON UPDATE no action;