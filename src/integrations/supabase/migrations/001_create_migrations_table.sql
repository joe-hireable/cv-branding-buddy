-- Create migrations table
CREATE TABLE IF NOT EXISTS migrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  up_sql TEXT NOT NULL,
  down_sql TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  applied_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT
);

-- Create exec_sql function
CREATE OR REPLACE FUNCTION exec_sql(sql TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- Add RLS policies
ALTER TABLE migrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to view migrations"
  ON migrations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert migrations"
  ON migrations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update migrations"
  ON migrations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true); 