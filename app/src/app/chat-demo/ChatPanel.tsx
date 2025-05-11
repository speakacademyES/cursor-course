"use client";
import React, { useState, useRef, useEffect } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ConfigPanel from "./ConfigPanel";
import * as openaiService from "./services/openaiService";

// Updated TypeScript interface for our message structure
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string; // New property for image messages
  isStreaming?: boolean; // Flag to indicate a message is currently streaming
}

export default function ChatPanel() {
  // State for messages and input
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "# Welcome to the Chat Demo!\n\nHow can I help you today? You can ask me questions or generate images with the Image Mode toggle.\n\n**Features:**\n- Text chat with markdown support\n- Image generation\n- Streaming responses\n\n```\nTry asking a question to get started!\n```",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Reference for auto-scrolling to bottom of messages
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if API key exists on mount
  useEffect(() => {
    setHasApiKey(openaiService.hasApiKey());
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = async (message: string, generateImage: boolean = false) => {
    if (!message.trim() || isLoading) return;

    // Reset error state
    setApiError(null);

    // Add user message to state
    const newUserMessage: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, newUserMessage]);

    // Set loading state
    setIsLoading(true);

    if (generateImage) {
      // Check if API key is configured
      if (!openaiService.hasApiKey()) {
        setIsConfigOpen(true);
        setIsLoading(false);
        return;
      }

      try {
        console.log("Starting image generation for prompt:", message);

        // Add a temporary message indicating image generation is in progress
        const tempMessageId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        setMessages((prev) => [
          ...prev,
          {
            id: tempMessageId,
            role: "assistant",
            content: "Generating your image... This might take a moment.",
          },
        ]);

        // Call the OpenAI service to generate image
        const result = await openaiService.generateImage(message);

        // Remove the temporary message
        setMessages((prev) => prev.filter((msg) => msg.id !== tempMessageId));

        if (result.success && result.imageUrl) {
          console.log("Image generated successfully");
          setMessages((prev) => [
            ...prev,
            {
              id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              role: "assistant",
              content: `Here's the image I generated based on your prompt: "${message}"`,
              imageUrl: result.imageUrl,
            },
          ]);
        } else {
          console.error("Image generation failed:", result.error);
          setApiError(result.error || "Unknown error occurred");

          // Show error and fallback to a placeholder image
          setMessages((prev) => [
            ...prev,
            {
              id: `err-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              role: "assistant",
              content: `I couldn't generate the image: ${result.error}. Here's a placeholder instead.`,
              imageUrl: openaiService.getFallbackImage(message),
            },
          ]);
        }
      } catch (error) {
        console.error("Error in image generation process:", error);
        setApiError(error instanceof Error ? error.message : "Unknown error");

        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            role: "assistant",
            content: "Sorry, there was an error generating the image. Please try again later.",
            imageUrl: openaiService.getFallbackImage(message),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Check if we have an API key for text streaming
      if (!openaiService.hasApiKey()) {
        // Fall back to mock responses if no API key
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              role: "assistant",
              content: getMockResponse(message),
            },
          ]);
          setIsLoading(false);
        }, 1000);
        return;
      }

      // Create a streaming message with initial empty content
      const streamingMessageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      setMessages((prev) => [
        ...prev,
        {
          id: streamingMessageId,
          role: "assistant",
          content: "",
          isStreaming: true,
        },
      ]);

      try {
        // Stream the text completion
        const result = await openaiService.streamTextCompletion(message, (chunk) => {
          // Update the message content with each new chunk
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === streamingMessageId ? { ...msg, content: msg.content + chunk } : msg
            )
          );
        });

        if (!result.success) {
          setApiError(result.error || "Failed to get a response");
          // Update the streaming message to show the error
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === streamingMessageId
                ? {
                    ...msg,
                    content:
                      "Sorry, there was an error getting a response. " + (result.error || ""),
                    isStreaming: false,
                  }
                : msg
            )
          );
        } else {
          // Mark the message as no longer streaming
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === streamingMessageId ? { ...msg, isStreaming: false } : msg
            )
          );
        }
      } catch (error) {
        console.error("Error in text streaming:", error);
        setApiError(error instanceof Error ? error.message : "Unknown error");

        // Update the streaming message with the error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === streamingMessageId
              ? {
                  ...msg,
                  content: "Sorry, an unexpected error occurred. Please try again.",
                  isStreaming: false,
                }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Reset the chat to initial state
  const resetChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "# Welcome to the Chat Demo!\n\nHow can I help you today? You can ask me questions or generate images with the Image Mode toggle.\n\n**Features:**\n- Text chat with markdown support\n- Image generation\n- Streaming responses\n\n```\nTry asking a question to get started!\n```",
      },
    ]);
    setApiError(null);
  };

  // Handle API key configuration
  const handleApiConfigSave = () => {
    setIsConfigOpen(false);
    const hasKey = openaiService.hasApiKey();
    setHasApiKey(hasKey);

    // Add a confirmation message when API key is saved
    if (hasKey) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "API key configured successfully! You can now generate images with the Image Mode toggle.",
        },
      ]);
    }
  };

  // Generate mock responses based on user input
  const getMockResponse = (userMessage: string): string => {
    const userMsgLower = userMessage.toLowerCase();

    if (userMsgLower.includes("hello") || userMsgLower.includes("hi")) {
      return "Hello! Nice to meet you. How can I assist you today?";
    }

    if (userMsgLower.includes("how are you")) {
      return "I'm just a demo chatbot, but I'm functioning well. Thanks for asking!";
    }

    if (userMsgLower.includes("bye") || userMsgLower.includes("goodbye")) {
      return "Goodbye! Feel free to come back if you have more questions.";
    }

    if (userMsgLower.includes("help")) {
      return "This is a simplified chat demo. You can type any message and I'll respond with a real-time streaming response. You can also generate images by toggling the Image Mode button and entering a description.";
    }

    if (userMsgLower.includes("image")) {
      return "You can generate images by toggling the Image Mode button above the input field. Then enter a description of the image you want to create.";
    }

    if (userMsgLower.includes("api") || userMsgLower.includes("key")) {
      return "To use the streaming text and image generation features, you need to provide your OpenAI API key. Click the settings icon in the header to configure your API key.";
    }

    // Default response with some variability
    const defaultResponses = [
      "Thanks for your message! This is a demo chatbot with predefined responses.",
      'I understand you said: "' + userMessage + '". This is a simple demo without API connection.',
      "In a full implementation, I would connect to the OpenAI API here to get a meaningful response.",
      "This is a mock response to demonstrate the chat UI functionality.",
      "Thanks for testing this chat demo! Your message has been received.",
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat header - simplified */}
      <div className="p-4 border-b flex justify-between items-center bg-white shadow-sm">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-green-200 mr-3 flex items-center justify-center overflow-hidden border-2 border-white shadow">
            <span className="text-sm font-medium text-green-800">M</span>
          </div>
          <h2 className="font-medium text-gray-700">matchya</h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsConfigOpen(true)}
            className="p-1 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100"
            title="Configure API Key"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>

          {/* API key status indicator - more subtle */}
          <div
            className={`w-2 h-2 rounded-full ${hasApiKey ? "bg-green-500" : "bg-red-500"}`}
            title={hasApiKey ? "API key configured" : "API key not configured"}
          ></div>

          <button
            onClick={resetChat}
            className="p-1 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100"
            title="New Chat"
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* API Error Alert - more subtle */}
      {apiError && (
        <div className="bg-red-50 text-red-700 p-3 text-xs border-b border-red-200">
          <div className="font-medium">API Error:</div>
          <div>{apiError}</div>
          <button onClick={() => setIsConfigOpen(true)} className="mt-1 text-red-800 underline">
            Check API key configuration
          </button>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <ChatMessages messages={messages} isLoading={isLoading} />
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />

      {/* Configuration panel (conditionally rendered) */}
      {isConfigOpen && (
        <ConfigPanel onClose={() => setIsConfigOpen(false)} onSave={handleApiConfigSave} />
      )}
    </div>
  );
}
