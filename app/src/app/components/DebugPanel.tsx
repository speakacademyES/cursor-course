import { FC, useEffect, useState } from "react";

const DebugPanel: FC = () => {
  const [apiStatus, setApiStatus] = useState<string>("Checking...");

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:54321/functions/v1/hello-world",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: "Functions" }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          setApiStatus(`OK - ${JSON.stringify(data)}`);
        } else {
          setApiStatus(`Error: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        setApiStatus(
          `Error: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    };

    checkApi();
  }, []);

  const getStatusColor = (status: string) => {
    if (status.startsWith("OK")) return "text-green-500";
    if (status === "Checking...") return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="w-full mb-8 p-4 bg-muted rounded-lg">
      <h2 className={`text-xl font-semibold mb-2`}>
        ⚡️ Supabase Status:{" "}
        <span className={getStatusColor(apiStatus)}>{apiStatus}</span>
      </h2>
      <div className="font-mono text-sm">
        <p className="mb-1 text-xs">Supabase URL: {SUPABASE_URL}</p>
        <p className="mb-1 text-xs">Supabase Anon Key: {SUPABASE_ANON_KEY}</p>
      </div>
    </div>
  );
};

export default DebugPanel;
