import { createClient } from "@supabase/supabase-js";

// These environment variables will be set in .env.local
// Fallback to dummy values in development to prevent errors
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";

// For development environments, check for credentials
if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  console.warn(
    "⚠️ Supabase credentials not found in environment variables. Using dummy values. Please set up your .env.local file with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export type Category = {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  color: string | null;
};

export type Task = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string | null;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  due_date: string | null;
  category_id: string | null;
};
