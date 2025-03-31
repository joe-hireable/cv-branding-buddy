create type "public"."analysis_task_type" as enum ('ps', 'cs', 'ka', 'role', 'scoring');

create type "public"."chat_sender_type" as enum ('user', 'assistant');

create type "public"."cv_status" as enum ('Uploaded', 'Parsing', 'Parsed', 'Optimizing_PS', 'Optimizing_CS', 'Optimizing_KA', 'Optimizing_Role', 'Scoring', 'OptimizationComplete', 'Generating', 'Generated', 'Error');

create sequence "public"."cv_chats_id_seq";

create table "public"."candidates" (
    "id" uuid not null default gen_random_uuid(),
    "first_name" text,
    "last_name" text,
    "current_position" text,
    "current_company" text,
    "owner_id" uuid,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."candidates" enable row level security;

create table "public"."companies" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "website" text,
    "address" text,
    "description" text,
    "brand_color" text,
    "logo_storage_path" text,
    "default_cv_template" text default 'professional'::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."companies" enable row level security;

create table "public"."cv_analysis_results" (
    "id" uuid not null default gen_random_uuid(),
    "cv_id" uuid not null,
    "task_type" analysis_task_type not null,
    "result_data" jsonb,
    "model_used" text,
    "jd_storage_path" text,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."cv_analysis_results" enable row level security;

create table "public"."cv_chats" (
    "id" bigint not null default nextval('cv_chats_id_seq'::regclass),
    "cv_id" uuid not null,
    "user_id" uuid,
    "sender_type" chat_sender_type not null,
    "message_text" text not null,
    "timestamp" timestamp with time zone not null default now()
);


alter table "public"."cv_chats" enable row level security;

create table "public"."cvs" (
    "id" uuid not null default gen_random_uuid(),
    "candidate_id" uuid not null,
    "uploader_id" uuid not null,
    "original_file_storage_path" text,
    "original_filename" text,
    "parsed_data" jsonb,
    "status" cv_status not null default 'Uploaded'::cv_status,
    "error_message" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."cvs" enable row level security;

create table "public"."generated_documents" (
    "id" uuid not null default gen_random_uuid(),
    "cv_id" uuid not null,
    "generator_id" uuid not null,
    "generated_file_storage_path" text not null,
    "format" text not null,
    "template_style" text,
    "included_recruiter_branding" boolean,
    "included_cover_page" boolean,
    "client_logo_storage_path" text,
    "settings_snapshot" jsonb,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."generated_documents" enable row level security;

create table "public"."profiles" (
    "id" uuid not null,
    "first_name" text,
    "last_name" text,
    "email" text,
    "phone" text,
    "job_title" text,
    "bio" text,
    "company_id" uuid,
    "default_anonymize" boolean default false,
    "default_section_visibility" jsonb,
    "default_section_order" jsonb,
    "default_ai_model" text default 'balanced'::text,
    "auto_optimize_upload" boolean default true,
    "smart_keyword_detection" boolean default true,
    "grammar_correction" boolean default true,
    "custom_ai_instructions" text,
    "default_export_format" text default 'pdf'::text,
    "default_include_cover_page" boolean default false,
    "default_include_recruiter_details" boolean default true,
    "default_email_template" text,
    "email_notifications" boolean default true,
    "processing_notifications" boolean default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."profiles" enable row level security;

alter sequence "public"."cv_chats_id_seq" owned by "public"."cv_chats"."id";

CREATE UNIQUE INDEX candidates_pkey ON public.candidates USING btree (id);

CREATE UNIQUE INDEX companies_pkey ON public.companies USING btree (id);

CREATE UNIQUE INDEX cv_analysis_results_pkey ON public.cv_analysis_results USING btree (id);

CREATE UNIQUE INDEX cv_chats_pkey ON public.cv_chats USING btree (id);

CREATE UNIQUE INDEX cvs_pkey ON public.cvs USING btree (id);

CREATE UNIQUE INDEX generated_documents_pkey ON public.generated_documents USING btree (id);

CREATE INDEX idx_analysis_cv_id ON public.cv_analysis_results USING btree (cv_id);

CREATE INDEX idx_analysis_task_type ON public.cv_analysis_results USING btree (task_type);

CREATE INDEX idx_candidate_owner ON public.candidates USING btree (owner_id);

CREATE INDEX idx_chat_cv_id ON public.cv_chats USING btree (cv_id);

CREATE INDEX idx_chat_timestamp ON public.cv_chats USING btree ("timestamp");

CREATE INDEX idx_cv_candidate ON public.cvs USING btree (candidate_id);

CREATE INDEX idx_cv_status ON public.cvs USING btree (status);

CREATE INDEX idx_cv_uploader ON public.cvs USING btree (uploader_id);

CREATE INDEX idx_gen_doc_cv_id ON public.generated_documents USING btree (cv_id);

CREATE INDEX idx_gen_doc_generator_id ON public.generated_documents USING btree (generator_id);

CREATE INDEX idx_profile_company_id ON public.profiles USING btree (company_id);

CREATE INDEX idx_profile_email ON public.profiles USING btree (email);

CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

alter table "public"."candidates" add constraint "candidates_pkey" PRIMARY KEY using index "candidates_pkey";

alter table "public"."companies" add constraint "companies_pkey" PRIMARY KEY using index "companies_pkey";

alter table "public"."cv_analysis_results" add constraint "cv_analysis_results_pkey" PRIMARY KEY using index "cv_analysis_results_pkey";

alter table "public"."cv_chats" add constraint "cv_chats_pkey" PRIMARY KEY using index "cv_chats_pkey";

alter table "public"."cvs" add constraint "cvs_pkey" PRIMARY KEY using index "cvs_pkey";

alter table "public"."generated_documents" add constraint "generated_documents_pkey" PRIMARY KEY using index "generated_documents_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."candidates" add constraint "candidates_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."candidates" validate constraint "candidates_owner_id_fkey";

alter table "public"."cv_analysis_results" add constraint "cv_analysis_results_cv_id_fkey" FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE not valid;

alter table "public"."cv_analysis_results" validate constraint "cv_analysis_results_cv_id_fkey";

alter table "public"."cv_chats" add constraint "cv_chats_cv_id_fkey" FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE not valid;

alter table "public"."cv_chats" validate constraint "cv_chats_cv_id_fkey";

alter table "public"."cv_chats" add constraint "cv_chats_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."cv_chats" validate constraint "cv_chats_user_id_fkey";

alter table "public"."cvs" add constraint "cvs_candidate_id_fkey" FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE not valid;

alter table "public"."cvs" validate constraint "cvs_candidate_id_fkey";

alter table "public"."cvs" add constraint "cvs_uploader_id_fkey" FOREIGN KEY (uploader_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."cvs" validate constraint "cvs_uploader_id_fkey";

alter table "public"."generated_documents" add constraint "generated_documents_cv_id_fkey" FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE not valid;

alter table "public"."generated_documents" validate constraint "generated_documents_cv_id_fkey";

alter table "public"."generated_documents" add constraint "generated_documents_format_check" CHECK ((format = ANY (ARRAY['pdf'::text, 'docx'::text]))) not valid;

alter table "public"."generated_documents" validate constraint "generated_documents_format_check";

alter table "public"."generated_documents" add constraint "generated_documents_generator_id_fkey" FOREIGN KEY (generator_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."generated_documents" validate constraint "generated_documents_generator_id_fkey";

alter table "public"."profiles" add constraint "profiles_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL not valid;

alter table "public"."profiles" validate constraint "profiles_company_id_fkey";

alter table "public"."profiles" add constraint "profiles_email_key" UNIQUE using index "profiles_email_key";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."candidates" to "anon";

grant insert on table "public"."candidates" to "anon";

grant references on table "public"."candidates" to "anon";

grant select on table "public"."candidates" to "anon";

grant trigger on table "public"."candidates" to "anon";

grant truncate on table "public"."candidates" to "anon";

grant update on table "public"."candidates" to "anon";

grant delete on table "public"."candidates" to "authenticated";

grant insert on table "public"."candidates" to "authenticated";

grant references on table "public"."candidates" to "authenticated";

grant select on table "public"."candidates" to "authenticated";

grant trigger on table "public"."candidates" to "authenticated";

grant truncate on table "public"."candidates" to "authenticated";

grant update on table "public"."candidates" to "authenticated";

grant delete on table "public"."candidates" to "service_role";

grant insert on table "public"."candidates" to "service_role";

grant references on table "public"."candidates" to "service_role";

grant select on table "public"."candidates" to "service_role";

grant trigger on table "public"."candidates" to "service_role";

grant truncate on table "public"."candidates" to "service_role";

grant update on table "public"."candidates" to "service_role";

grant delete on table "public"."companies" to "anon";

grant insert on table "public"."companies" to "anon";

grant references on table "public"."companies" to "anon";

grant select on table "public"."companies" to "anon";

grant trigger on table "public"."companies" to "anon";

grant truncate on table "public"."companies" to "anon";

grant update on table "public"."companies" to "anon";

grant delete on table "public"."companies" to "authenticated";

grant insert on table "public"."companies" to "authenticated";

grant references on table "public"."companies" to "authenticated";

grant select on table "public"."companies" to "authenticated";

grant trigger on table "public"."companies" to "authenticated";

grant truncate on table "public"."companies" to "authenticated";

grant update on table "public"."companies" to "authenticated";

grant delete on table "public"."companies" to "service_role";

grant insert on table "public"."companies" to "service_role";

grant references on table "public"."companies" to "service_role";

grant select on table "public"."companies" to "service_role";

grant trigger on table "public"."companies" to "service_role";

grant truncate on table "public"."companies" to "service_role";

grant update on table "public"."companies" to "service_role";

grant delete on table "public"."cv_analysis_results" to "anon";

grant insert on table "public"."cv_analysis_results" to "anon";

grant references on table "public"."cv_analysis_results" to "anon";

grant select on table "public"."cv_analysis_results" to "anon";

grant trigger on table "public"."cv_analysis_results" to "anon";

grant truncate on table "public"."cv_analysis_results" to "anon";

grant update on table "public"."cv_analysis_results" to "anon";

grant delete on table "public"."cv_analysis_results" to "authenticated";

grant insert on table "public"."cv_analysis_results" to "authenticated";

grant references on table "public"."cv_analysis_results" to "authenticated";

grant select on table "public"."cv_analysis_results" to "authenticated";

grant trigger on table "public"."cv_analysis_results" to "authenticated";

grant truncate on table "public"."cv_analysis_results" to "authenticated";

grant update on table "public"."cv_analysis_results" to "authenticated";

grant delete on table "public"."cv_analysis_results" to "service_role";

grant insert on table "public"."cv_analysis_results" to "service_role";

grant references on table "public"."cv_analysis_results" to "service_role";

grant select on table "public"."cv_analysis_results" to "service_role";

grant trigger on table "public"."cv_analysis_results" to "service_role";

grant truncate on table "public"."cv_analysis_results" to "service_role";

grant update on table "public"."cv_analysis_results" to "service_role";

grant delete on table "public"."cv_chats" to "anon";

grant insert on table "public"."cv_chats" to "anon";

grant references on table "public"."cv_chats" to "anon";

grant select on table "public"."cv_chats" to "anon";

grant trigger on table "public"."cv_chats" to "anon";

grant truncate on table "public"."cv_chats" to "anon";

grant update on table "public"."cv_chats" to "anon";

grant delete on table "public"."cv_chats" to "authenticated";

grant insert on table "public"."cv_chats" to "authenticated";

grant references on table "public"."cv_chats" to "authenticated";

grant select on table "public"."cv_chats" to "authenticated";

grant trigger on table "public"."cv_chats" to "authenticated";

grant truncate on table "public"."cv_chats" to "authenticated";

grant update on table "public"."cv_chats" to "authenticated";

grant delete on table "public"."cv_chats" to "service_role";

grant insert on table "public"."cv_chats" to "service_role";

grant references on table "public"."cv_chats" to "service_role";

grant select on table "public"."cv_chats" to "service_role";

grant trigger on table "public"."cv_chats" to "service_role";

grant truncate on table "public"."cv_chats" to "service_role";

grant update on table "public"."cv_chats" to "service_role";

grant delete on table "public"."cvs" to "anon";

grant insert on table "public"."cvs" to "anon";

grant references on table "public"."cvs" to "anon";

grant select on table "public"."cvs" to "anon";

grant trigger on table "public"."cvs" to "anon";

grant truncate on table "public"."cvs" to "anon";

grant update on table "public"."cvs" to "anon";

grant delete on table "public"."cvs" to "authenticated";

grant insert on table "public"."cvs" to "authenticated";

grant references on table "public"."cvs" to "authenticated";

grant select on table "public"."cvs" to "authenticated";

grant trigger on table "public"."cvs" to "authenticated";

grant truncate on table "public"."cvs" to "authenticated";

grant update on table "public"."cvs" to "authenticated";

grant delete on table "public"."cvs" to "service_role";

grant insert on table "public"."cvs" to "service_role";

grant references on table "public"."cvs" to "service_role";

grant select on table "public"."cvs" to "service_role";

grant trigger on table "public"."cvs" to "service_role";

grant truncate on table "public"."cvs" to "service_role";

grant update on table "public"."cvs" to "service_role";

grant delete on table "public"."generated_documents" to "anon";

grant insert on table "public"."generated_documents" to "anon";

grant references on table "public"."generated_documents" to "anon";

grant select on table "public"."generated_documents" to "anon";

grant trigger on table "public"."generated_documents" to "anon";

grant truncate on table "public"."generated_documents" to "anon";

grant update on table "public"."generated_documents" to "anon";

grant delete on table "public"."generated_documents" to "authenticated";

grant insert on table "public"."generated_documents" to "authenticated";

grant references on table "public"."generated_documents" to "authenticated";

grant select on table "public"."generated_documents" to "authenticated";

grant trigger on table "public"."generated_documents" to "authenticated";

grant truncate on table "public"."generated_documents" to "authenticated";

grant update on table "public"."generated_documents" to "authenticated";

grant delete on table "public"."generated_documents" to "service_role";

grant insert on table "public"."generated_documents" to "service_role";

grant references on table "public"."generated_documents" to "service_role";

grant select on table "public"."generated_documents" to "service_role";

grant trigger on table "public"."generated_documents" to "service_role";

grant truncate on table "public"."generated_documents" to "service_role";

grant update on table "public"."generated_documents" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

create policy "Users can manage their own candidates."
on "public"."candidates"
as permissive
for all
to public
using ((auth.uid() = owner_id))
with check ((auth.uid() = owner_id));


create policy "Users can update their own company details."
on "public"."companies"
as permissive
for update
to public
using ((id = ( SELECT profiles.company_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))))
with check ((id = ( SELECT profiles.company_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


create policy "Users can view their own company details."
on "public"."companies"
as permissive
for select
to public
using ((id = ( SELECT profiles.company_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


create policy "Users can manage analysis results for their CVs."
on "public"."cv_analysis_results"
as permissive
for all
to public
using ((cv_id IN ( SELECT cv.id
   FROM (cvs cv
     JOIN candidates c ON ((cv.candidate_id = c.id)))
  WHERE (c.owner_id = auth.uid()))));


create policy "Users can manage chats for their CVs."
on "public"."cv_chats"
as permissive
for all
to public
using ((cv_id IN ( SELECT cv.id
   FROM (cvs cv
     JOIN candidates c ON ((cv.candidate_id = c.id)))
  WHERE (c.owner_id = auth.uid()))))
with check (((user_id = auth.uid()) OR (sender_type = 'assistant'::chat_sender_type)));


create policy "Users can manage CVs for their candidates."
on "public"."cvs"
as permissive
for all
to public
using ((candidate_id IN ( SELECT c.id
   FROM candidates c
  WHERE (c.owner_id = auth.uid()))))
with check ((candidate_id IN ( SELECT c.id
   FROM candidates c
  WHERE (c.owner_id = auth.uid()))));


create policy "Users can manage generated documents for their CVs."
on "public"."generated_documents"
as permissive
for all
to public
using ((cv_id IN ( SELECT cv.id
   FROM (cvs cv
     JOIN candidates c ON ((cv.candidate_id = c.id)))
  WHERE (c.owner_id = auth.uid()))))
with check ((generator_id = auth.uid()));


create policy "Users can update their own profile."
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id))
with check ((auth.uid() = id));


create policy "Users can view their own profile."
on "public"."profiles"
as permissive
for select
to public
using ((auth.uid() = id));


CREATE TRIGGER set_candidates_timestamp BEFORE UPDATE ON public.candidates FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_companies_timestamp BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_cvs_timestamp BEFORE UPDATE ON public.cvs FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_profiles_timestamp BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();


