
import { Message } from "@/components/Chat/types";

/**
 * Updates a message with newly regenerated content, storing the old content in regenerations array
 */
export const updateWithRegeneratedContent = (
  messages: Message[],
  actualIndex: number, 
  newContent: string
): Message[] => {
  const updatedMessages = [...messages];
  
  // Initialize regenerations array if it doesn't exist
  if (!updatedMessages[actualIndex].regenerations) {
    updatedMessages[actualIndex].regenerations = [];
  }
  
  // Store the current content in regenerations only if it's not already stored
  const currentContent = updatedMessages[actualIndex].content;
  if (!updatedMessages[actualIndex].regenerations!.includes(currentContent)) {
    updatedMessages[actualIndex].regenerations!.push(currentContent);
  }
  
  // Update the current message with the new response
  updatedMessages[actualIndex].content = newContent;
  
  return updatedMessages;
};
