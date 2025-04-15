-- Create settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS "public"."settings" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "default_section_visibility" JSONB NOT NULL DEFAULT '{
    "personalInfo": true,
    "profileStatement": true,
    "skills": true,
    "experience": true,
    "education": true,
    "certifications": true,
    "achievements": true,
    "languages": true,
    "professionalMemberships": true,
    "earlierCareer": false,
    "publications": false,
    "additionalDetails": false
  }',
  "default_section_order" JSONB NOT NULL DEFAULT '{
    "sections": [
      "personalInfo",
      "profileStatement",
      "skills",
      "experience",
      "education",
      "achievements",
      "certifications",
      "languages",
      "professionalMemberships",
      "publications",
      "earlierCareer",
      "additionalDetails"
    ]
  }',
  "default_anonymise" BOOLEAN NOT NULL DEFAULT false,
  "keep_original_files" BOOLEAN NOT NULL DEFAULT true,
  "default_export_format" TEXT NOT NULL DEFAULT 'PDF' CHECK (default_export_format IN ('PDF', 'DOCX')),
  "theme" TEXT NOT NULL DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT "settings_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "settings_user_id_key" UNIQUE ("user_id")
);

-- Create index if it doesn't exist
CREATE INDEX IF NOT EXISTS "settings_user_id_idx" ON "public"."settings" ("user_id");

-- Enable RLS
ALTER TABLE "public"."settings" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own settings" ON "public"."settings";
DROP POLICY IF EXISTS "Users can insert their own settings" ON "public"."settings";
DROP POLICY IF EXISTS "Users can update their own settings" ON "public"."settings";

-- Create RLS policies
CREATE POLICY "Users can view their own settings"
  ON "public"."settings"
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON "public"."settings"
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON "public"."settings"
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_settings_updated_at ON "public"."settings";
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON "public"."settings"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 