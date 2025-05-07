
import { Message } from "@/components/Chat/types";

/**
 * Prepares the message context for regeneration by creating a proper message array
 * including system messages and relevant conversation context
 */
export const prepareMessagesForRegeneration = (
  messages: Message[],
  actualIndex: number
): Message[] => {
  // Create a copy of all messages to send for context up to the message to regenerate
  const systemMessages = messages.filter(msg => msg.role === "system");
  const conversationMessages = messages.slice(0, actualIndex).filter(msg => msg.role !== "system");
  
  // Find the most recent user message to add to prompt
  let lastUserIndex = -1;
  for (let i = actualIndex - 1; i >= 0; i--) {
    if (messages[i].role === "user") {
      lastUserIndex = i;
      break;
    }
  }

  // For continuation messages, we need to make sure we have proper context
  let userPrompt: Message | null = null;
  
  if (lastUserIndex !== -1) {
    // For regular messages, include the last user message
    userPrompt = {
      id: `user-regen-${Date.now()}`,
      role: "user", 
      content: messages[lastUserIndex].content,
      timestamp: Date.now(),
    };
  }
  
  // Add continuity reminder with enhanced length and detail instructions
  const continuityReminder: Message = {
    id: `system-continuity-regen-${Date.now()}`,
    role: "system",
    content: "IMPORTANT: Maintain continuity with your previous physical positions and emotional state. Complete all thoughts and sentences. Create a vivid, immersive scene with emotional depth and sensory details. Write a detailed, lengthy response (500-800 words minimum) that includes both descriptive actions and dialogue. Don't worry about the visual length of your response - the user interface can scroll to accommodate long messages. Vary your pacing to build tension or intimacy. Include physical sensations, environmental details, and emotional reactions. Be raw and intense in your emotions and actions. Do not truncate or limit your response based on perceived text container size.",
    timestamp: Date.now(),
  };
  
  const messagesToSend: Message[] = [...systemMessages, continuityReminder, ...conversationMessages];
  
  // Add user message/prompt if we have one
  if (userPrompt) {
    messagesToSend.push(userPrompt);
  }
  
  return messagesToSend;
};

/**
 * Finds the last assistant message index that isn't the welcome message
 */
export const findLastAssistantMessageIndex = (messages: Message[]): number => {
  const assistantMessages = messages.filter(
    msg => msg.role === "assistant" && msg.id !== "assistant-welcome"
  );
  
  if (assistantMessages.length === 0) {
    return -1;
  }
  
  const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];
  return messages.findIndex(msg => msg.id === lastAssistantMessage.id);
};
