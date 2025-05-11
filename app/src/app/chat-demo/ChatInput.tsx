import React, { useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string, generateImage?: boolean) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isImageMode, setIsImageMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage(input, isImageMode);
    setInput("");
  };

  // Determine the placeholder text based on current state
  const getPlaceholderText = () => {
    if (isLoading) {
      return isImageMode ? "Generating image..." : "Streaming response...";
    }
    return isImageMode ? "Describe the image you want to generate..." : "What's on your mind?";
  };

  return (
    <div className="border-t p-4">
      {/* Image generation toggle as a small control above the input */}
      {isImageMode && (
        <div className="mb-2 text-xs text-purple-600 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Image Mode enabled
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative">
        {/* Main input field with the circular send button */}
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={getPlaceholderText()}
            className={`w-full py-3 px-4 pr-12 text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white ${
              isLoading ? "opacity-70" : ""
            }`}
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              isLoading || !input.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : isImageMode
                ? "bg-purple-600 text-white"
                : "bg-blue-500 text-white"
            }`}
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Switch for image mode below the input */}
        <div className="mt-2 flex justify-between items-center">
          <button
            type="button"
            onClick={() => setIsImageMode(!isImageMode)}
            className={`text-xs px-2 py-1 rounded-full transition-colors ${
              isImageMode
                ? "bg-purple-100 text-purple-700 border border-purple-300"
                : "bg-gray-100 text-gray-600 border border-gray-200"
            }`}
            disabled={isLoading}
          >
            {isImageMode ? "Text Mode" : "Image Mode"}
          </button>

          <span className="text-xs text-gray-400">
            {isImageMode ? "Generating images requires an API key" : ""}
          </span>
        </div>
      </form>
    </div>
  );
}
