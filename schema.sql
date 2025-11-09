


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."handle_new_user_confirmation"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  pending_data JSONB;
BEGIN
  -- Only proceed if email_confirmed_at was just set (not null now, was null before)
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN

    -- Check if user profile already exists
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = NEW.id) THEN

      -- Create the user profile with default values
      INSERT INTO public.users (
        id,
        username,
        phone_number,
        longest_streak,
        current_streak,
        last_active_date,
        dates_active,
        total_solved,
        pre_submissions,
        mains_answer_copies,
        total_points,
        points_history,
        created_at
      ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)), -- Use metadata or email username
        COALESCE(NEW.raw_user_meta_data->>'phone_number', NULL),
        0,
        0,
        NULL,
        '{}'::jsonb,
        0,
        '{}'::jsonb,
        '{}'::jsonb,
        0,
        '{}'::jsonb,
        NOW()
      );

      RAISE LOG 'Created user profile for user %', NEW.id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user_confirmation"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "post_id" "uuid" NOT NULL,
    "author_id" "uuid" NOT NULL,
    "author_username" "text" NOT NULL,
    "content" "text" NOT NULL,
    "is_anonymous" boolean DEFAULT false,
    "is_edited" boolean DEFAULT false,
    "like_count" integer DEFAULT 0,
    "dislike_count" integer DEFAULT 0,
    "liked_by" "uuid"[] DEFAULT '{}'::"uuid"[],
    "disliked_by" "uuid"[] DEFAULT '{}'::"uuid"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."daily_mains_questions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "date" "date" NOT NULL,
    "question_id" "uuid",
    "question" "text" NOT NULL,
    "paper" "text",
    "year" integer,
    "marks" numeric,
    "code" "text"
);


ALTER TABLE "public"."daily_mains_questions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."daily_prelims_questions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "date" "date" NOT NULL,
    "question_id" "uuid",
    "question" "text" NOT NULL,
    "year" integer,
    "chapters" "text",
    "answer" "text",
    "explanation" "text",
    "options" "jsonb",
    "section" "text",
    "table_name" "text"
);


ALTER TABLE "public"."daily_prelims_questions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."dataset_prelims_questions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "question_and_year" "text" NOT NULL,
    "year" integer,
    "chapters" "text",
    "answer" "text",
    "explanation" "text",
    "options" "jsonb",
    "section" "text",
    "table_name" "text",
    "date_added" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."dataset_prelims_questions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "author_id" "uuid" NOT NULL,
    "username" "text" NOT NULL,
    "question" "text" NOT NULL,
    "year" "text",
    "paper" "text",
    "question_id" "uuid",
    "is_anonymous" boolean DEFAULT false,
    "images" "text"[],
    "like_count" integer DEFAULT 0,
    "comment_count" integer DEFAULT 0,
    "liked_by" "uuid"[] DEFAULT '{}'::"uuid"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "hidepost" boolean DEFAULT false,
    "discussionlocked" boolean DEFAULT false,
    "post_type" character varying DEFAULT 'daily_challenge'::character varying
);


ALTER TABLE "public"."posts" OWNER TO "postgres";


COMMENT ON COLUMN "public"."posts"."hidepost" IS 'flag to display the post if true posts will be hidden from the community';



COMMENT ON COLUMN "public"."posts"."discussionlocked" IS 'boolean flag for locking the discussion';



COMMENT ON COLUMN "public"."posts"."post_type" IS 'Type of post: daily_challenge or custom_question';



CREATE TABLE IF NOT EXISTS "public"."push_tokens" (
    "user_id" "uuid" NOT NULL,
    "token" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "failure_count" bigint DEFAULT '0'::bigint NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."push_tokens" OWNER TO "postgres";


COMMENT ON TABLE "public"."push_tokens" IS 'User Token for Sending the push notifications';



CREATE TABLE IF NOT EXISTS "public"."questions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "question" "text" NOT NULL,
    "paper" "text",
    "year" integer,
    "marks" numeric,
    "code" "text",
    "date_added" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."questions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_pyq_solved" (
    "user_id" "uuid" NOT NULL,
    "question_id" "uuid" NOT NULL,
    "selected_option" integer NOT NULL,
    "verdict" "text" NOT NULL,
    "solved_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_pyq_solved" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "username" "text" NOT NULL,
    "phone_number" "text",
    "longest_streak" integer DEFAULT 0,
    "current_streak" integer DEFAULT 0,
    "last_active_date" "date",
    "dates_active" "jsonb" DEFAULT '{}'::"jsonb",
    "total_solved" integer DEFAULT 0,
    "pre_submissions" "jsonb" DEFAULT '{}'::"jsonb",
    "mains_answer_copies" "jsonb" DEFAULT '{}'::"jsonb",
    "total_points" integer DEFAULT 0,
    "points_history" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."users" OWNER TO "postgres";


ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."daily_mains_questions"
    ADD CONSTRAINT "daily_mains_questions_date_key" UNIQUE ("date");



ALTER TABLE ONLY "public"."daily_mains_questions"
    ADD CONSTRAINT "daily_mains_questions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."daily_prelims_questions"
    ADD CONSTRAINT "daily_prelims_questions_date_key" UNIQUE ("date");



ALTER TABLE ONLY "public"."daily_prelims_questions"
    ADD CONSTRAINT "daily_prelims_questions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."dataset_prelims_questions"
    ADD CONSTRAINT "dataset_prelims_questions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."push_tokens"
    ADD CONSTRAINT "push_notification_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."questions"
    ADD CONSTRAINT "questions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_pyq_solved"
    ADD CONSTRAINT "user_pyq_solved_pkey" PRIMARY KEY ("user_id", "question_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_comments_author_id" ON "public"."comments" USING "btree" ("author_id");



CREATE INDEX "idx_comments_created_at" ON "public"."comments" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_comments_like_count" ON "public"."comments" USING "btree" ("like_count" DESC);



CREATE INDEX "idx_comments_post_created" ON "public"."comments" USING "btree" ("post_id", "created_at" DESC);



CREATE INDEX "idx_comments_post_id" ON "public"."comments" USING "btree" ("post_id");



CREATE INDEX "idx_comments_post_likes" ON "public"."comments" USING "btree" ("post_id", "like_count" DESC);



CREATE INDEX "idx_daily_mains_date" ON "public"."daily_mains_questions" USING "btree" ("date" DESC);



CREATE INDEX "idx_daily_mains_question_id" ON "public"."daily_mains_questions" USING "btree" ("question_id");



CREATE INDEX "idx_daily_prelims_date" ON "public"."daily_prelims_questions" USING "btree" ("date" DESC);



CREATE INDEX "idx_daily_prelims_question_id" ON "public"."daily_prelims_questions" USING "btree" ("question_id");



CREATE INDEX "idx_dataset_prelims_section" ON "public"."dataset_prelims_questions" USING "btree" ("section");



CREATE INDEX "idx_dataset_prelims_year" ON "public"."dataset_prelims_questions" USING "btree" ("year");



CREATE INDEX "idx_posts_author_id" ON "public"."posts" USING "btree" ("author_id");



CREATE INDEX "idx_posts_author_question" ON "public"."posts" USING "btree" ("author_id", "question_id");



CREATE INDEX "idx_posts_created_at" ON "public"."posts" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_posts_post_type" ON "public"."posts" USING "btree" ("post_type");



CREATE INDEX "idx_posts_question_id" ON "public"."posts" USING "btree" ("question_id");



CREATE INDEX "idx_posts_type_created" ON "public"."posts" USING "btree" ("post_type", "created_at" DESC);



CREATE INDEX "idx_posts_type_likes" ON "public"."posts" USING "btree" ("post_type", "like_count" DESC);



CREATE INDEX "idx_questions_paper" ON "public"."questions" USING "btree" ("paper");



CREATE INDEX "idx_questions_year" ON "public"."questions" USING "btree" ("year");



CREATE INDEX "idx_users_username" ON "public"."users" USING "btree" ("username");



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."daily_mains_questions"
    ADD CONSTRAINT "daily_mains_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id");



ALTER TABLE ONLY "public"."daily_prelims_questions"
    ADD CONSTRAINT "daily_prelims_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."dataset_prelims_questions"("id");



ALTER TABLE ONLY "public"."user_pyq_solved"
    ADD CONSTRAINT "user_pyq_solved_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."dataset_prelims_questions"("id");



ALTER TABLE ONLY "public"."user_pyq_solved"
    ADD CONSTRAINT "user_pyq_solved_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



CREATE POLICY "Anyone can update comments" ON "public"."comments" FOR UPDATE USING (true);



CREATE POLICY "Anyone can update posts" ON "public"."posts" FOR UPDATE USING (true);



CREATE POLICY "Anyone can view comments" ON "public"."comments" FOR SELECT USING (true);



CREATE POLICY "Anyone can view daily mains" ON "public"."daily_mains_questions" FOR SELECT USING (true);



CREATE POLICY "Anyone can view daily prelims" ON "public"."daily_prelims_questions" FOR SELECT USING (true);



CREATE POLICY "Anyone can view dataset" ON "public"."dataset_prelims_questions" FOR SELECT USING (true);



CREATE POLICY "Anyone can view posts" ON "public"."posts" FOR SELECT USING (true);



CREATE POLICY "Anyone can view questions" ON "public"."questions" FOR SELECT USING (true);



CREATE POLICY "Authenticated users can create comments" ON "public"."comments" FOR INSERT WITH CHECK (("auth"."uid"() = "author_id"));



CREATE POLICY "Authenticated users can create posts" ON "public"."posts" FOR INSERT WITH CHECK (("auth"."uid"() = "author_id"));



CREATE POLICY "Authenticated users can create profile" ON "public"."users" FOR INSERT WITH CHECK ((("auth"."uid"() = "id") AND ("auth"."jwt"() IS NOT NULL)));



CREATE POLICY "Users can delete own comments" ON "public"."comments" FOR DELETE USING (("auth"."uid"() = "author_id"));



CREATE POLICY "Users can delete own posts" ON "public"."posts" FOR DELETE USING (("auth"."uid"() = "author_id"));



CREATE POLICY "Users can delete own submissions" ON "public"."user_pyq_solved" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own push tokens" ON "public"."push_tokens" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own submissions" ON "public"."user_pyq_solved" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own push tokens" ON "public"."push_tokens" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own data" ON "public"."users" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can update their own push tokens" ON "public"."push_tokens" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own data" ON "public"."users" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view own submissions" ON "public"."user_pyq_solved" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own push tokens" ON "public"."push_tokens" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."comments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."daily_mains_questions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."daily_prelims_questions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."dataset_prelims_questions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."push_tokens" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."questions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_pyq_solved" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user_confirmation"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user_confirmation"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user_confirmation"() TO "service_role";



GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";



GRANT ALL ON TABLE "public"."daily_mains_questions" TO "anon";
GRANT ALL ON TABLE "public"."daily_mains_questions" TO "authenticated";
GRANT ALL ON TABLE "public"."daily_mains_questions" TO "service_role";



GRANT ALL ON TABLE "public"."daily_prelims_questions" TO "anon";
GRANT ALL ON TABLE "public"."daily_prelims_questions" TO "authenticated";
GRANT ALL ON TABLE "public"."daily_prelims_questions" TO "service_role";



GRANT ALL ON TABLE "public"."dataset_prelims_questions" TO "anon";
GRANT ALL ON TABLE "public"."dataset_prelims_questions" TO "authenticated";
GRANT ALL ON TABLE "public"."dataset_prelims_questions" TO "service_role";



GRANT ALL ON TABLE "public"."posts" TO "anon";
GRANT ALL ON TABLE "public"."posts" TO "authenticated";
GRANT ALL ON TABLE "public"."posts" TO "service_role";



GRANT ALL ON TABLE "public"."push_tokens" TO "anon";
GRANT ALL ON TABLE "public"."push_tokens" TO "authenticated";
GRANT ALL ON TABLE "public"."push_tokens" TO "service_role";



GRANT ALL ON TABLE "public"."questions" TO "anon";
GRANT ALL ON TABLE "public"."questions" TO "authenticated";
GRANT ALL ON TABLE "public"."questions" TO "service_role";



GRANT ALL ON TABLE "public"."user_pyq_solved" TO "anon";
GRANT ALL ON TABLE "public"."user_pyq_solved" TO "authenticated";
GRANT ALL ON TABLE "public"."user_pyq_solved" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







