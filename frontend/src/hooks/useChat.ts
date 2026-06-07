"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getConversation, sendMessage as sendChatMessage } from "@/services/chatApi";
import type { Message } from "@/types/chat";

const SESSION_STORAGE_KEY = "spur-chat-session";

function createLocalMessage(sender: Message["sender"], content: string): Message {
  return {
    id: `${sender.toLowerCase()}-${Date.now()}-${crypto.randomUUID()}`,
    sender,
    content,
    createdAt: new Date().toISOString(),
  };
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as
      | { message?: string; error?: string }
      | undefined;

    return (
      responseData?.message ??
      responseData?.error ??
      "The support service is unavailable. Please try again."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    async function loadConversation() {
      const savedSessionId = window.localStorage.getItem(SESSION_STORAGE_KEY);

      if (!savedSessionId) {
        setInitialLoading(false);
        return;
      }

      try {
        setSessionId(savedSessionId);
        setError(null);
        const conversation = await getConversation(savedSessionId);
        setMessages(conversation);
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      } finally {
        setInitialLoading(false);
      }
    }

    void loadConversation();
  }, []);

  const sendMessage = useCallback(
    async (message: string) => {
      const trimmedMessage = message.trim();

      if (!trimmedMessage || loading) {
        return;
      }

      const userMessage = createLocalMessage("USER", trimmedMessage);

      setMessages((currentMessages) => [...currentMessages, userMessage]);
      setLoading(true);
      setError(null);

      try {
        const response = await sendChatMessage(trimmedMessage, sessionId ?? undefined);
        const aiMessage = createLocalMessage("AI", response.reply);

        setSessionId(response.sessionId);
        window.localStorage.setItem(SESSION_STORAGE_KEY, response.sessionId);
        setMessages((currentMessages) => [...currentMessages, aiMessage]);
      } catch (sendError) {
        setError(getErrorMessage(sendError));
      } finally {
        setLoading(false);
      }
    },
    [loading, sessionId]
  );

  return useMemo(
    () => ({
      messages,
      loading,
      initialLoading,
      error,
      sessionId,
      sendMessage,
    }),
    [error, initialLoading, loading, messages, sendMessage, sessionId]
  );
}
