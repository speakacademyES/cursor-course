"use client";
import React, { useState, useRef, useEffect } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import {
  generateImage,
  streamTextCompletion,
} from "@/app/services/openaiService";

// Updated TypeScript interface for our message structure
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string; // New property for image messages
  isStreaming?: boolean; // Flag to indicate a message is currently streaming
}

// Message format to send to the API
interface MessageForAPI {
  role: "user" | "assistant";
  content: string;
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
  const [isImageMode, setIsImageMode] = useState(false);

  // Reference for auto-scrolling to bottom of messages
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Convert messages to API format (exclude system messages, IDs, etc.)
  const getMessageHistoryForAPI = (): MessageForAPI[] => {
    // Skip the first welcome message as it's not part of the actual conversation
    return messages.slice(1).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
  };

  // Handle sending a new message
  const handleSendMessage = async (
    message: string,
    generateImageMode: boolean = false
  ) => {
    // Update image mode state
    setIsImageMode(generateImageMode);

    if (!message.trim() || isLoading) return;

    // Add user message to state
    const newUserMessage: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, newUserMessage]);

    // Set loading state
    setIsLoading(true);

    if (generateImageMode) {
      try {
        console.log("Requesting image generation for prompt:", message);

        // Add a temporary message indicating image generation is in progress
        const tempMessageId = `temp-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}`;
        setMessages((prev) => [
          ...prev,
          {
            id: tempMessageId,
            role: "assistant",
            content: "Generating your image... This might take a moment.",
          },
        ]);

        // Call the actual image generation API
        const result = await generateImage(message);

        // Remove the temporary message
        setMessages((prev) => prev.filter((msg) => msg.id !== tempMessageId));

        if (result.success && result.imageUrl) {
          // Add successful image message
          setMessages((prev) => [
            ...prev,
            {
              id: `img-${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 9)}`,
              role: "assistant",
              content: `Here's the image you requested based on: "${message}".`,
              imageUrl: result.imageUrl,
            },
          ]);
        } else {
          // Add error message
          setMessages((prev) => [
            ...prev,
            {
              id: `err-${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 9)}`,
              role: "assistant",
              content:
                result.error ||
                "Sorry, there was an error generating the image. Please try again later.",
            },
          ]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error in image generation process:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}-${Math.random()
              .toString(36)
              .substring(2, 9)}`,
            role: "assistant",
            content:
              "Sorry, there was an unexpected error generating the image. Please try again later.",
          },
        ]);
        setIsLoading(false);
      }
    } else {
      // Text completion
      // Create a message with streaming state
      const streamingMsgId = `ai-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;

      setMessages((prev) => [
        ...prev,
        {
          id: streamingMsgId,
          role: "assistant",
          content: "",
          isStreaming: true,
        },
      ]);

      try {
        // Get conversation history for context
        const messageHistory = getMessageHistoryForAPI();

        // Add the current message
        messageHistory.push({ role: "user", content: message });

        // Stream the text completion with full conversation history
        await streamTextCompletion(messageHistory, (chunk) => {
          // Update the streaming message with each chunk
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === streamingMsgId
                ? { ...msg, content: msg.content + chunk }
                : msg
            )
          );
        });

        // When streaming is complete, update the message
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === streamingMsgId ? { ...msg, isStreaming: false } : msg
          )
        );
      } catch (error) {
        console.error("Error in text completion:", error);

        // Update the streaming message with an error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === streamingMsgId
              ? {
                  ...msg,
                  content:
                    "Sorry, there was an error processing your request. Please try again.",
                  isStreaming: false,
                }
              : msg
          )
        );
      }

      setIsLoading(false);
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
            onClick={resetChat}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            disabled={isLoading}
          >
            New Chat
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <ChatMessages messages={messages} isLoading={isLoading} />
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        isImageMode={isImageMode}
        setIsImageMode={setIsImageMode}
      />
    </div>
  );
}
