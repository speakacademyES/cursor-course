"use client";
import React from "react";
import ChatPanel from "@/app/components/ChatPanel";
import "./styles/markdown.css";
import DebugPanel from "@/app/components/DebugPanel";

// This will be our simple chat demo page that will house our chat functionality
export default function ChatDemoPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-100 p-8">
      {/* Main content - the chat panel */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-3xl mx-auto h-full">
          <ChatPanel />
        </div>
      </main>
      <DebugPanel />
    </div>
  );
}
