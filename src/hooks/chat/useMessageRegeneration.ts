
import { useState } from "react";
import { Message } from "@/components/Chat/types";
import { generateChatCompletion } from "@/services/openRouterService";
import { toast } from "sonner";

export const useMessageRegeneration = (
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegenerateLastMessage = async () => {
    console.log("Regenerating last message...");
    
    // Find the last assistant message, excluding the welcome message
    const assistantMessages = messages.filter(
      msg => msg.role === "assistant" && msg.id !== "assistant-welcome"
    );
    
    if (assistantMessages.length === 0) {
      toast.error("No message to regenerate");
      return;
    }
    
    const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];
    const actualIndex = messages.findIndex(msg => msg.id === lastAssistantMessage.id);
    
    if (actualIndex === -1) {
      toast.error("No message to regenerate");
      return;
    }
    
    try {
      setIsLoading(true);
      
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
      
      // If this was a continuation, we need to create a special prompt
      if (lastAssistantMessage.isContinuation) {
        userPrompt = {
          id: `user-continue-regen-${Date.now()}`,
          role: "user",
          content: "Please continue",
          timestamp: Date.now(),
        };
      } else if (lastUserIndex !== -1) {
        // For regular messages, include the last user message
        userPrompt = {
          id: `user-regen-${Date.now()}`,
          role: "user", 
          content: messages[lastUserIndex].content,
          timestamp: Date.now(),
        };
      }
      
      // Add continuity reminder
      const continuityReminder: Message = {
        id: `system-continuity-regen-${Date.now()}`,
        role: "system",
        content: "IMPORTANT: Maintain continuity with your previous physical positions and emotional state. Complete all thoughts and sentences. Keep your response under 75 words.",
        timestamp: Date.now(),
      };
      
      const messagesToSend: Message[] = [...systemMessages, continuityReminder, ...conversationMessages];
      
      // Add user message/prompt if we have one
      if (userPrompt) {
        messagesToSend.push(userPrompt);
      }
      
      console.log("Messages to send for regeneration:", messagesToSend);
      
      const response = await generateChatCompletion(messagesToSend);
      
      // Update the messages array with the new response
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages];
        
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
        updatedMessages[actualIndex].content = response;
        
        return updatedMessages;
      });
      
      toast.success("Response regenerated");
    } catch (error) {
      console.error("Error regenerating response:", error);
      toast.error("Failed to regenerate response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleRegenerateLastMessage
  };
};
