-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    default_section_visibility JSONB NOT NULL DEFAULT '{
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
    }'::jsonb,
    default_section_order JSONB NOT NULL DEFAULT '{
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
    }'::jsonb,
    default_anonymise BOOLEAN NOT NULL DEFAULT false,
    keep_original_files BOOLEAN NOT NULL DEFAULT true,
    default_export_format TEXT NOT NULL DEFAULT 'PDF' CHECK (default_export_format IN ('PDF', 'DOCX')),
    theme TEXT NOT NULL DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create unique index on user_id
CREATE UNIQUE INDEX IF NOT EXISTS settings_user_id_idx ON settings(user_id);

-- Enable Row Level Security
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own settings"
    ON settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
    ON public.settings
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
    ON public.settings
    ON public.settings
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER handle_settings_updated_at
    BEFORE UPDATE ON public.settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at(); 