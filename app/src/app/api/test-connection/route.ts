import { NextRequest, NextResponse } from "next/server";
import {
  testSupabaseConnection,
  initializeHealthCheck,
} from "@/lib/supabase-utils";

export async function GET(request: NextRequest) {
  try {
    // Check if we need to initialize health check
    const searchParams = request.nextUrl.searchParams;
    const initialize = searchParams.get("initialize") === "true";

    // Test the connection
    const connectionResult = await testSupabaseConnection();

    // If connection successful and initialize flag is set, also initialize health check
    if (connectionResult.success && initialize) {
      const healthCheckResult = await initializeHealthCheck();
      return NextResponse.json({
        ...connectionResult,
        healthCheck: healthCheckResult,
      });
    }

    return NextResponse.json(connectionResult);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Failed to test connection", details: String(error) },
      { status: 500 }
    );
  }
}
