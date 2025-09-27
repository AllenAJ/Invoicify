// Supabase Configuration
// Copy this file to .env.local and fill in your Supabase credentials

export const SUPABASE_CONFIG = {
  // Get these from your Supabase project settings
  url: import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here',
}

// Instructions:
// 1. Go to https://supabase.com and create a new project
// 2. Go to Settings > API to get your URL and anon key
// 3. Create a .env.local file in the root directory with:
//    VITE_SUPABASE_URL=https://your-project.supabase.co
//    VITE_SUPABASE_ANON_KEY=your-anon-key-here
