import { supabase } from "./supabase";

/**
 * Test the connection to Supabase
 * @returns Success message or error
 */
export async function testSupabaseConnection() {
  try {
    // First, try a connection test that doesn't depend on any specific table
    const { data: versionData, error: versionError } = await supabase
      .rpc("version", {}, { count: "exact" })
      .maybeSingle();

    if (!versionError) {
      return {
        success: true,
        message: "Successfully connected to Supabase",
        data: {
          postgresVersion: versionData || "Unknown",
          note: "Database connection is working, but tables may not be set up yet",
        },
      };
    }

    // Fallback to a simple query - try against the categories table
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .limit(1);

    // Handle specific database errors
    if (error) {
      // If table doesn't exist, it means we need to run migrations
      if (error.code === "42P01") {
        // PostgreSQL code for "relation does not exist"
        return {
          success: true, // Still mark as success since the connection works
          message:
            "Connected to Supabase, but the database tables don't exist yet. You need to run migrations.",
          data: [],
          databaseStatus: "needs_setup",
        };
      }
      throw error;
    }

    return {
      success: true,
      message:
        "Successfully connected to Supabase and verified database tables",
      data: data || [],
      databaseStatus: "ready",
    };
  } catch (error: any) {
    console.error("Supabase connection error:", error);
    return {
      success: false,
      message: `Failed to connect to Supabase: ${error.message}`,
      error,
    };
  }
}

/**
 * Initialize a health check table
 * This is helpful for simple connection testing
 */
export async function initializeHealthCheck() {
  try {
    // First try to create the table if it doesn't exist
    const createTableRes = await supabase
      .rpc("create_health_check_table")
      .single();

    // Then insert a health check record
    const { error } = await supabase
      .from("_health_check")
      .insert([{ status: "ok", timestamp: new Date().toISOString() }]);

    if (error && error.code === "42P01") {
      return {
        success: false,
        message:
          "Health check table doesn't exist. Tables need to be created first.",
        error,
      };
    } else if (error) {
      throw error;
    }

    return {
      success: true,
      message: "Health check table initialized",
    };
  } catch (error: any) {
    console.error("Failed to initialize health check:", error);
    return {
      success: false,
      message: `Failed to initialize health check: ${error.message}`,
      error,
    };
  }
}
