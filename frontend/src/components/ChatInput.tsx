"use client";

import { FormEvent, KeyboardEvent, useState } from "react";
import { Loader2, Send } from "lucide-react";

interface ChatInputProps {
  loading: boolean;
  onSendMessage: (message: string) => Promise<void>;
}

export default function ChatInput({ loading, onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const canSend = message.trim().length > 0 && !loading;

  async function submitMessage() {
    if (!canSend) {
      return;
    }

    const nextMessage = message.trim();
    setMessage("");
    await onSendMessage(nextMessage);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitMessage();
  }

  async function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();
    await submitMessage();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white"
    >
      <div className="flex items-end gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-2 shadow-inner focus-within:border-zinc-400 focus-within:bg-white">
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Ask a question..."
          disabled={loading}
          className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm leading-5 text-zinc-900 outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:text-zinc-500"
          aria-label="Message"
        />
        <button
          type="submit"
          disabled={!canSend}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
          aria-label="Send message"
          title="Send message"
        >
          {loading ? (
            <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
          ) : (
            <Send aria-hidden className="h-4 w-4" />
          )}
        </button>
      </div>
    </form>
  );
}
