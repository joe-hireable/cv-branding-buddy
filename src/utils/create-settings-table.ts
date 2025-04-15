import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://bvnglrtwcrysosinnnem.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2bmdscnR3Y3J5c29zaW5ubmVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzI1Njg4MCwiZXhwIjoyMDU4ODMyODgwfQ.SWs34srfp7tSC0mZU1h3G6GtNaDSUOlEcbiLC2rpYuI'
);

async function createSettingsTable() {
  try {
    // Create the settings table
    const { error: tableError } = await supabase.rpc('create_settings_table');
    
    if (tableError) {
      console.error('Error creating settings table:', tableError);
      return;
    }

    console.log('✅ Settings table created successfully');

    // Create RLS policies
    const { error: rlsError } = await supabase.rpc('setup_settings_rls');
    
    if (rlsError) {
      console.error('Error setting up RLS:', rlsError);
      return;
    }

    console.log('✅ RLS policies created successfully');

  } catch (error) {
    console.error('Failed to create settings table:', error);
  }
}

createSettingsTable(); 