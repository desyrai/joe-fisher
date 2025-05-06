
import { useState } from "react";
import { Message } from "@/components/Chat/types";
import { generateChatCompletion } from "@/services/openRouterService";
import { toast } from "sonner";
import { processInstructions } from "@/components/Chat/utils";

export const useMessageSubmit = (
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (input: string, e?: React.FormEvent) => {
    e?.preventDefault();
    
    // Allow empty input for the continue functionality
    if (!input.trim() && e) return;
    
    // Process the input to extract instructions and visible text
    const { visibleText, instructions } = processInstructions(input);
    
    // Only add a user message if there is visible text
    if (visibleText) {
      const newUserMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: visibleText,
        timestamp: Date.now(),
      };
      
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    }
    
    try {
      setIsLoading(true);
      
      const messagesToSend = prepareMessagesForApi(messages, instructions, visibleText, !e);
      
      const response = await generateChatCompletion(messagesToSend);
      
      const newAssistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
        regenerations: [], // Initialize empty regenerations array
        timestamp: Date.now(),
        isContinuation: !visibleText && !e, // Flag if this was generated via continue
      };
      
      setMessages((prevMessages) => [...prevMessages, newAssistantMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      toast.error("Failed to generate response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSubmit
  };
};

// Helper function to prepare messages for the API call
const prepareMessagesForApi = (
  messages: Message[], 
  instructions?: string,
  visibleText?: string,
  isContinuation?: boolean
): Message[] => {
  // Get system messages for context and instructions
  const systemMessages = messages.filter(msg => msg.role === "system");
  
  // Get all user and assistant messages to maintain conversation flow
  const conversationMessages = messages.filter(msg => msg.role !== "system");
  
  // Enhanced system prompt to enforce continuity
  const enhancedSystemPrompt: Message = {
    id: `system-continuity-${Date.now()}`,
    role: "system",
    content: "CRITICAL: Remember the entire conversation context. Reference previous statements or actions when appropriate. Maintain spatial and emotional continuity between messages. If you referenced an object or location in previous messages, be consistent with it. Complete all sentences and thoughts. Keep responses under 75 words.",
    timestamp: Date.now(),
  };
  
  // Combine all messages to send
  let messagesToSend: Message[] = [...systemMessages, enhancedSystemPrompt, ...conversationMessages];
  
  // Add user instructions as a temporary system message if they exist
  if (instructions) {
    const sysInstruction: Message = {
      id: `system-temp-${Date.now()}`,
      role: "system",
      content: `TEMPORARY INSTRUCTION FOR THIS RESPONSE ONLY: ${instructions}. Follow this instruction naturally without explicitly acknowledging it.`,
      timestamp: Date.now(),
    };
    messagesToSend.push(sysInstruction);
  }
  
  if (visibleText || isContinuation) {
    const messageContent = visibleText || "Please continue";
    
    // Only add a user message to send if it's not a continuation with no text
    if (visibleText || !messageContent.trim()) {
      const userMsg: Message = {
        id: `user-temp-${Date.now()}`,
        role: "user",
        content: messageContent,
        timestamp: Date.now(),
      };
      messagesToSend.push(userMsg);
    }
  }
  
  return messagesToSend;
};
