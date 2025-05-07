
import { Message } from "@/components/Chat/types";

/**
 * Toggles the remembered state of a specific message
 */
export const toggleRememberMessage = (
  messages: Message[],
  messageId: string
): Message[] => {
  return messages.map((msg) =>
    msg.id === messageId ? { ...msg, remembered: !msg.remembered } : msg
  );
};
