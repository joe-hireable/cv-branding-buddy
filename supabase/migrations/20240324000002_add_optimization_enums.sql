-- Create the analysis_task_type enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "public"."analysis_task_type" AS ENUM (
        'optimize_ps',
        'optimize_skills',
        'optimize_achievements',
        'optimize_experience'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Add new optimization task types to the analysis_task_type enum
ALTER TYPE "public"."analysis_task_type" ADD VALUE IF NOT EXISTS 'optimize_ps';
ALTER TYPE "public"."analysis_task_type" ADD VALUE IF NOT EXISTS 'optimize_skills';
ALTER TYPE "public"."analysis_task_type" ADD VALUE IF NOT EXISTS 'optimize_achievements';
ALTER TYPE "public"."analysis_task_type" ADD VALUE IF NOT EXISTS 'optimize_experience'; 