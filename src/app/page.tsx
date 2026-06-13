"use client";

import { useState } from "react";
import { Sparkles, Loader2, Copy, Check, AlertCircle } from "lucide-react";

export default function Home() {
  const [inputPrompt, setInputPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleEnhance = async () => {
    if (!inputPrompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setEnhancedPrompt("");
    setIsCopied(false);

    try {
      const response = await fetch("/api/enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: inputPrompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setEnhancedPrompt(data.enhancedPrompt);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!enhancedPrompt) return;
    try {
      await navigator.clipboard.writeText(enhancedPrompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Qron - AI Prompt Enhancer
          </h1>
          <p className="text-lg text-gray-600">
            Transform vague ideas into highly structured, professional AI
            prompts.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-1">
          <textarea
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Paste your rough prompt here... (e.g., 'Write a blog post about AI')"
            className="w-full h-40 p-4 bg-transparent border-none resize-none focus:ring-0 text-gray-800 placeholder-gray-400 text-base outline-none"
            disabled={isLoading}
          />
          <div className="flex items-center justify-between p-2 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
            <span className="text-xs text-gray-400 font-medium px-2">
              {inputPrompt.length} characters
            </span>
            <button
              onClick={handleEnhance}
              disabled={isLoading || !inputPrompt.trim()}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Enhanced Prompt
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-2 p-4 text-red-700 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Output Section */}
        {enhancedPrompt && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold tracking-wide text-gray-500 uppercase">
                Enhanced Result
              </h2>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors px-2 py-1 rounded-md hover:bg-blue-50"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy to Clipboard
                  </>
                )}
              </button>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
              <p className="text-gray-100 whitespace-pre-wrap leading-relaxed font-mono text-sm">
                {enhancedPrompt}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
