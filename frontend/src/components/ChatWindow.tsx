"use client";

import { MessageCircle, Minus, Sparkles, X } from "lucide-react";
import { useState } from "react";
import ChatInput from "@/components/ChatInput";
import MessageList from "@/components/MessageList";
import { useChat } from "@/hooks/useChat";

export default function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, loading, initialLoading, error, sendMessage } = useChat();

  async function handleSuggestedQuestion(question: string) {
    await sendMessage(question);
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
        <div className="max-w-[260px] animate-[fadeIn_220ms_ease-out] rounded-2xl rounded-br-md border border-zinc-200 bg-white px-4 py-3 text-sm leading-5 text-zinc-700 shadow-xl shadow-zinc-900/10">
          <div className="mb-1 flex items-center gap-2 font-semibold text-zinc-950">
            <Sparkles aria-hidden className="h-4 w-4 text-emerald-600" />
            Hi, I am your AI assistant.
          </div>
          I am here to help you with any questions about our store.
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex h-18 w-18 items-center justify-center rounded-full bg-zinc-950 text-white shadow-2xl shadow-zinc-900/30 transition hover:-translate-y-0.5 hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-emerald-200"
          aria-label="Open Spur Support chat"
          title="Open Spur Support"
        >
          <span className="absolute -right-0.5 -top-0.5 h-5 w-5 rounded-full border-4 border-white bg-emerald-500" />
          <span className="absolute inset-0 rounded-full bg-emerald-400/20 opacity-0 transition group-hover:scale-125 group-hover:opacity-100" />
          <MessageCircle aria-hidden className="relative h-8 w-8" />
        </button>
      </div>
    );
  }

  return (
    <section className="fixed inset-x-3 bottom-3 z-50 flex h-[calc(100dvh-1.5rem)] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/20 sm:inset-x-auto sm:bottom-7 sm:right-7 sm:h-[760px] sm:max-h-[calc(100dvh-3.5rem)] sm:w-[480px] lg:w-[520px]">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-white">
              <MessageCircle aria-hidden className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold text-zinc-950">
                Spur Support
              </h1>
              <p className="truncate text-xs font-medium text-zinc-500">
                AI Customer Support Assistant
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              Online
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="hidden h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 sm:flex"
              aria-label="Minimize chat"
              title="Minimize"
            >
              <Minus aria-hidden className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 sm:hidden"
              aria-label="Close chat"
              title="Close"
            >
              <X aria-hidden className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 bg-zinc-50/80">
        <MessageList
          messages={messages}
          loading={loading}
          initialLoading={initialLoading}
          error={error}
          onSuggestedQuestion={handleSuggestedQuestion}
        />
      </div>

      <div className="border-t border-zinc-200 bg-white px-4 py-3">
        {messages.length > 0 ? (
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {[
              "Return Policy",
              "Shipping Time",
              "Refund Process",
              "Support Hours",
            ].map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => void handleSuggestedQuestion(question)}
                disabled={loading}
                className="shrink-0 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {question}
              </button>
            ))}
          </div>
        ) : null}
        <ChatInput loading={loading} onSendMessage={sendMessage} />
      </div>
    </section>
  );
}
