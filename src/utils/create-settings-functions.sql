-- Function to create the settings table
CREATE OR REPLACE FUNCTION create_settings_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    default_section_visibility JSONB NOT NULL DEFAULT '{}'::JSONB,
    default_section_order JSONB NOT NULL DEFAULT '{"sections": []}'::JSONB,
    default_anonymise BOOLEAN NOT NULL DEFAULT false,
    keep_original_files BOOLEAN NOT NULL DEFAULT true,
    default_export_format TEXT NOT NULL DEFAULT 'PDF' CHECK (default_export_format IN ('PDF', 'DOCX')),
    theme TEXT NOT NULL DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
  );

  -- Create updated_at trigger function if it doesn't exist
  CREATE OR REPLACE FUNCTION public.handle_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  -- Create trigger
  DROP TRIGGER IF EXISTS handle_settings_updated_at ON public.settings;
  CREATE TRIGGER handle_settings_updated_at
    BEFORE UPDATE ON public.settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
END;
$$;

-- Function to setup RLS policies
CREATE OR REPLACE FUNCTION setup_settings_rls()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Enable RLS
  ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view their own settings" ON public.settings;
  DROP POLICY IF EXISTS "Users can insert their own settings" ON public.settings;
  DROP POLICY IF EXISTS "Users can update their own settings" ON public.settings;
  DROP POLICY IF EXISTS "Users can delete their own settings" ON public.settings;

  -- Create policies
  CREATE POLICY "Users can view their own settings"
    ON public.settings FOR SELECT
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can insert their own settings"
    ON public.settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can update their own settings"
    ON public.settings FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can delete their own settings"
    ON public.settings FOR DELETE
    USING (auth.uid() = user_id);
END;
$$; 