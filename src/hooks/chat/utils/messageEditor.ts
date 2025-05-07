
import { Message } from "@/components/Chat/types";

/**
 * Updates a message with new content, preserving previous content in regenerations array
 */
export const editMessageContent = (
  messages: Message[],
  messageId: string,
  newContent: string
): Message[] => {
  return messages.map((msg) => {
    if (msg.id === messageId) {
      // If the message doesn't have regenerations array, create one
      const regenerations = msg.regenerations || [];
      
      // Only add the current content to regenerations if it's different from the new content
      // and not already in the regenerations array
      if (msg.content !== newContent && !regenerations.includes(msg.content)) {
        regenerations.push(msg.content);
      }
      
      return {
        ...msg,
        content: newContent,
        regenerations
      };
    }
    return msg;
  });
};
