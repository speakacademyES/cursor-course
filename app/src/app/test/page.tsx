"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function TestPage() {
  const [connectionStatus, setConnectionStatus] = useState<{
    success?: boolean;
    message?: string;
    data?: any;
    error?: any;
    healthCheck?: any;
    databaseStatus?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [initializeHealthCheck, setInitializeHealthCheck] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const url = initializeHealthCheck
        ? "/api/test-connection?initialize=true"
        : "/api/test-connection";

      const response = await fetch(url);
      const data = await response.json();
      setConnectionStatus(data);
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: `Error during fetch: ${
          error instanceof Error ? error.message : String(error)
        }`,
        error,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>

      <Card className="w-full max-w-md mx-auto mb-8">
        <CardHeader>
          <CardTitle>Database Connection Status</CardTitle>
          {!connectionStatus.success && !connectionStatus.message && (
            <CardDescription>
              Test your Supabase connection to ensure everything is set up
              correctly
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {connectionStatus.success !== undefined ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Status:</span>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    connectionStatus.success
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                  }`}
                >
                  {connectionStatus.success ? "Connected" : "Failed"}
                </span>
              </div>
              <p>
                <span className="font-semibold">Message:</span>{" "}
                {connectionStatus.message}
              </p>

              {connectionStatus.data && (
                <div>
                  <p className="font-semibold">Data:</p>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm overflow-auto">
                    {JSON.stringify(connectionStatus.data, null, 2)}
                  </pre>
                </div>
              )}

              {connectionStatus.healthCheck && (
                <div>
                  <p className="font-semibold">Health Check:</p>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm overflow-auto">
                    {JSON.stringify(connectionStatus.healthCheck, null, 2)}
                  </pre>
                </div>
              )}

              {connectionStatus.error && (
                <div>
                  <p className="font-semibold">Error Details:</p>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm overflow-auto">
                    {JSON.stringify(connectionStatus.error, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">
              Click the button below to test the Supabase connection.
            </p>
          )}

          <div className="flex items-center space-x-2 mt-4">
            <Checkbox
              id="initialize"
              checked={initializeHealthCheck}
              onCheckedChange={(checked) =>
                setInitializeHealthCheck(checked === true)
              }
            />
            <Label htmlFor="initialize">Initialize health check table</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={testConnection}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Testing..." : "Test Connection"}
          </Button>
        </CardFooter>
      </Card>

      {connectionStatus.databaseStatus === "needs_setup" && (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-amber-600 dark:text-amber-400">
              Database Setup Required
            </CardTitle>
            <CardDescription>
              Your Supabase connection is working, but the required tables don't
              exist yet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-base mb-2">
                Set Up Using Supabase UI:
              </h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Go to your Supabase project dashboard</li>
                <li>Navigate to the SQL Editor tab</li>
                <li>
                  Open and run each migration file in the supabase/migrations
                  directory
                </li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-base mb-2">
                Or Using Supabase CLI:
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm overflow-auto">
                # Install CLI if needed npm install -g supabase # Link to your
                project (once) supabase link --project-ref your-project-ref #
                Push migrations supabase db push
              </pre>
            </div>

            <Link
              href="/supabase/README.md"
              target="_blank"
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              View full setup instructions
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
