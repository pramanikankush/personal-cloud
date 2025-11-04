// Debug script to test Supabase connection
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://alsyabmlypmwpydyxiql.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsc3lhYm1seXBtd3B5ZHl4aXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MTg5NzUsImV4cCI6MjA3MzQ5NDk3NX0.CNue1S8tiZUsGOKTeXJ6SEIbKaURbYeLvTRNTQc6Y8w';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  // Test storage buckets
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    console.log('Storage buckets:', buckets);
    if (error) console.error('Bucket error:', error);
  } catch (err) {
    console.error('Storage test failed:', err);
  }
  
  // Test database tables
  try {
    const { data, error } = await supabase.from('files').select('*').limit(1);
    console.log('Files table test:', data);
    if (error) console.error('Database error:', error);
  } catch (err) {
    console.error('Database test failed:', err);
  }
}

testConnection();