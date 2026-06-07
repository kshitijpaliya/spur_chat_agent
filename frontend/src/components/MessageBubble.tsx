import clsx from "clsx";
import { Bot, User } from "lucide-react";
import type { Message } from "@/types/chat";

interface MessageBubbleProps {
  message: Message;
}

function formatMessageTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "USER";
  const time = formatMessageTime(message.createdAt);

  return (
    <article
      className={clsx(
        "flex w-full animate-[fadeIn_180ms_ease-out] gap-2.5",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser ? (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200">
          <Bot aria-hidden className="h-4 w-4" />
        </div>
      ) : null}

      <div
        className={clsx(
          "flex max-w-[82%] flex-col gap-1 sm:max-w-[72%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={clsx(
            "rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm whitespace-pre-wrap break-words",
            isUser
              ? "rounded-br-md bg-zinc-950 text-white"
              : "rounded-bl-md border border-zinc-200 bg-white text-zinc-800"
          )}
        >
          {message.content}
        </div>
        {time ? (
          <time
            dateTime={message.createdAt}
            className="px-1 text-[11px] font-medium text-zinc-400"
          >
            {time}
          </time>
        ) : null}
      </div>

      {isUser ? (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-white ring-1 ring-zinc-800">
          <User aria-hidden className="h-4 w-4" />
        </div>
      ) : null}
    </article>
  );
}
