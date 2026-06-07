"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import MessageBubble from "@/components/MessageBubble";
import type { Message } from "@/types/chat";

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  initialLoading: boolean;
  error: string | null;
  onSuggestedQuestion: (question: string) => Promise<void>;
}

export default function MessageList({
  messages,
  loading,
  initialLoading,
  error,
  onSuggestedQuestion,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, error, initialLoading]);

  if (initialLoading) {
    return (
      <div className="flex h-full items-center justify-center text-sm font-medium text-zinc-500">
        <Loader2 aria-hidden className="mr-2 h-4 w-4 animate-spin" />
        Loading conversation...
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-4 py-5">
      {messages.length === 0 ? (
        <div className="flex min-h-full flex-col items-center justify-center gap-4 py-6 text-center">
          <div className="w-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-950">
              Welcome to Spur Support
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              I can help answer questions about:
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2">
              {["Return Policy", "Shipping", "Refunds", "Support Hours"].map(
                (question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => void onSuggestedQuestion(question)}
                    disabled={loading}
                    className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {question}
                  </button>
                ),
              )}
            </div>
          </div>
          {error ? (
            <div className="w-full rounded-2xl rounded-bl-md border border-red-100 bg-red-50 px-4 py-3 text-left text-sm leading-6 text-red-700 shadow-sm">
              Sorry, our support assistant is temporarily unavailable. Please
              try again.
            </div>
          ) : null}
          <div ref={bottomRef} />
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {loading ? (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-500 shadow-sm">
                <span className="inline-flex items-center gap-1">
                  Loading
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400 [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          ) : null}
          {error ? (
            <div className="flex justify-start">
              <div className="max-w-[82%] rounded-2xl rounded-bl-md border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 shadow-sm">
                Sorry, our support assistant is temporarily unavailable. Please
                try again.
              </div>
            </div>
          ) : null}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
