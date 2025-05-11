import React, { useState, useEffect } from "react";
import { getCookie, setCookie, deleteCookie, COOKIE_NAMES } from "./utils/cookieManager";

interface ConfigPanelProps {
  onClose: () => void;
  onSave: () => void;
}

export default function ConfigPanel({ onClose, onSave }: ConfigPanelProps) {
  const [apiKey, setApiKey] = useState("");
  const [savedKey, setSavedKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load saved API key on initial render
  useEffect(() => {
    const storedKey = getCookie(COOKIE_NAMES.API_KEY);
    if (storedKey) {
      setSavedKey(storedKey);
      setApiKey(storedKey);
    }
  }, []);

  // Save the API key to cookies
  const handleSave = async () => {
    if (!apiKey.trim()) {
      setError("Please enter a valid API key");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      // Validate the API key format (basic check)
      if (!apiKey.startsWith("sk-") || apiKey.length < 20) {
        setError(
          'The API key appears to be invalid. It should start with "sk-" and be at least 20 characters.'
        );
        setIsSaving(false);
        return;
      }

      // Store in cookie
      setCookie(COOKIE_NAMES.API_KEY, apiKey);
      setSavedKey(apiKey);

      // Show success message
      setSuccess("API key saved successfully!");
      setTimeout(() => {
        setSuccess("");
        onSave();
      }, 1500);
    } catch (e) {
      console.error("Error saving API key:", e);
      setError("Failed to save API key. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Clear the API key
  const handleClear = () => {
    deleteCookie(COOKIE_NAMES.API_KEY);
    setApiKey("");
    setSavedKey("");
    setSuccess("API key removed!");
    setTimeout(() => setSuccess(""), 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-green-200 mr-2 flex items-center justify-center overflow-hidden">
              <span className="text-sm font-medium text-green-800">M</span>
            </div>
            <h2 className="text-lg font-medium text-gray-800">API Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-4">
            To use streaming chat and image generation, you need to provide your OpenAI API key. The
            key is stored securely in your browser cookies and is only used for API calls.
          </p>

          <label className="block text-sm font-medium text-gray-700 mb-1">OpenAI API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
          />

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          {success && <p className="mt-2 text-sm text-green-600">{success}</p>}

          {savedKey && (
            <p className="mt-2 text-xs text-gray-500">
              You have an API key saved. For security, it's partially hidden.
            </p>
          )}

          <div className="mt-3 text-xs text-gray-500">
            <p>
              Your API key is stored only in your browser cookies and is never sent to our servers.
            </p>
            <p className="mt-1">
              Don't have an API key? Get one from the{" "}
              <a
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                OpenAI dashboard
              </a>
              .
            </p>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleClear}
            className="px-5 py-2 text-sm text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full"
            disabled={isSaving || !savedKey}
          >
            Clear API Key
          </button>

          <div className="space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-full"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
