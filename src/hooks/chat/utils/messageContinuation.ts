
import { Message } from "@/components/Chat/types";

/**
 * Handles continuation of previous messages by appending to the last assistant message
 */
export const appendToPreviousMessage = (
  prevMessages: Message[], 
  response: string
): Message[] => {
  // Find the last assistant message that's not the welcome message
  const lastAssistantIndex = [...prevMessages]
    .reverse()
    .findIndex(msg => msg.role === "assistant" && msg.id !== "assistant-welcome");
  
  if (lastAssistantIndex === -1) {
    // If no assistant message found (unlikely), create a new one
    return [...prevMessages, {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: response,
      regenerations: [],
      timestamp: Date.now(),
    }];
  }
  
  // Get the actual index from the end
  const actualIndex = prevMessages.length - 1 - lastAssistantIndex;
  
  // Create a new array with the updated message
  const updatedMessages = [...prevMessages];
  updatedMessages[actualIndex] = {
    ...updatedMessages[actualIndex],
    content: updatedMessages[actualIndex].content + "\n\n" + response, // Add line breaks for better formatting
  };
  
  return updatedMessages;
};

/**
 * Creates a new message from the assistant's response
 */
export const createNewAssistantMessage = (response: string): Message => {
  return {
    id: `assistant-${Date.now()}`,
    role: "assistant",
    content: response,
    regenerations: [], // Initialize empty regenerations array
    timestamp: Date.now(),
  };
};
