"use client";
import React from "react";
import ChatPanel from "./ChatPanel";
import "./styles/markdown.css";

// This will be our simple chat demo page that will house our chat functionality
export default function ChatDemoPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Simple header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <h1 className="text-lg font-medium text-gray-800">Chat Demo</h1>
      </header>

      {/* Main content - the chat panel */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-3xl mx-auto h-full">
          <ChatPanel />
        </div>
      </main>
    </div>
  );
}
