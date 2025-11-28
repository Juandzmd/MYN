import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qdhlnctwjpfcwzrgohbk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkaGxuY3R3anBmY3d6cmdvaGJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyODAxMzUsImV4cCI6MjA3OTg1NjEzNX0.ngSnqOADokApqzkR7T6CHOOL7k9uaTAC4rhnVm-JHLw';

export const supabase = createClient(supabaseUrl, supabaseKey);
