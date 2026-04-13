// src/lib/supabase.ts

import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://racgtmmxdfypubkbobxj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhY2d0bW14ZGZ5cHVia2JvYnhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjA2NDMyOSwiZXhwIjoyMDkxNjQwMzI5fQ.is-uktAyp10XloV4nzUqEIYWvR5n-1VmB3I-buggCL4' // important
);