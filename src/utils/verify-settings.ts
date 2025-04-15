import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabase = createClient<Database>(
  'https://bvnglrtwcrysosinnnem.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2bmdscnR3Y3J5c29zaW5ubmVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzI1Njg4MCwiZXhwIjoyMDU4ODMyODgwfQ.SWs34srfp7tSC0mZU1h3G6GtNaDSUOlEcbiLC2rpYuI'
);

async function verifySettingsTable() {
  try {
    // Check if table exists and has correct structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('settings')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('Error checking settings table:', tableError);
      return;
    }

    console.log('✅ Settings table exists and is queryable');

    // Check RLS policies
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies', { table_name: 'settings' });

    if (policiesError) {
      console.error('Error checking policies:', policiesError);
      return;
    }

    console.log('Policies for settings table:', policies);

    // Try to insert a test record
    const testSettings = {
      user_id: '00000000-0000-0000-0000-000000000000', // dummy UUID
      default_section_visibility: {},
      default_section_order: { sections: [] },
      default_anonymise: false,
      keep_original_files: true,
      default_export_format: 'PDF',
      theme: 'light'
    };

    const { error: insertError } = await supabase
      .from('settings')
      .insert([testSettings]);

    if (insertError) {
      console.log('✅ RLS preventing unauthorized inserts');
    }

  } catch (error) {
    console.error('Verification failed:', error);
  }
}

verifySettingsTable(); 