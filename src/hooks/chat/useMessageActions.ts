
import { useState } from "react";
import { Message } from "@/components/Chat/types";
import { useMessageSubmit } from "./useMessageSubmit";
import { useMessageRegeneration } from "./useMessageRegeneration";

export const useMessageActions = (
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  // Use our specialized hooks
  const { isLoading: isSubmitting, handleSubmit } = useMessageSubmit(messages, setMessages);
  const { isLoading: isRegenerating, handleRegenerateLastMessage } = useMessageRegeneration(messages, setMessages);

  // Combined loading state
  const isLoading = isSubmitting || isRegenerating;

  return {
    isLoading,
    handleSubmit,
    handleRegenerateLastMessage,
  };
};
