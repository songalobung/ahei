import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cmqjqjmelaaglzpmityg.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcWpxam1lbGFhZ2x6cG1pdHlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3OTA0NjYsImV4cCI6MjEwNjM2NjQ2Nn0.4AOYzlJ6rVgQDY2gOHhcpKwwV6gG7VROQ5v8z2aE7rY';

export const supabase = createClient(supabaseUrl, supabaseKey);
