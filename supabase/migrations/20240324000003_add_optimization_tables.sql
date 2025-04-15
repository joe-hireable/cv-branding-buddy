-- Add new columns to cv_analysis_results table
ALTER TABLE "public"."cv_analysis_results" 
ADD COLUMN IF NOT EXISTS "optimized_content" JSONB,
ADD COLUMN IF NOT EXISTS "feedback" TEXT,
ADD COLUMN IF NOT EXISTS "original_content" JSONB,
ADD COLUMN IF NOT EXISTS "optimization_settings" JSONB;

-- Add indexes for optimization queries
CREATE INDEX IF NOT EXISTS idx_analysis_optimization_type 
ON "public"."cv_analysis_results" (task_type) 
WHERE task_type IN ('optimize_ps', 'optimize_skills', 'optimize_achievements', 'optimize_experience');

-- Add RLS policies for optimization results
CREATE POLICY "Users can view their own optimization results"
  ON "public"."cv_analysis_results"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "public"."cvs"
      WHERE "cvs"."id" = "cv_analysis_results"."cv_id"
      AND "cvs"."uploader_id" = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own optimization results"
  ON "public"."cv_analysis_results"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "public"."cvs"
      WHERE "cvs"."id" = "cv_analysis_results"."cv_id"
      AND "cvs"."uploader_id" = auth.uid()
    )
  );

CREATE POLICY "Users can update their own optimization results"
  ON "public"."cv_analysis_results"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "public"."cvs"
      WHERE "cvs"."id" = "cv_analysis_results"."cv_id"
      AND "cvs"."uploader_id" = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "public"."cvs"
      WHERE "cvs"."id" = "cv_analysis_results"."cv_id"
      AND "cvs"."uploader_id" = auth.uid()
    )
  ); 