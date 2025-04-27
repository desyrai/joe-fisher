
import { useState } from "react";
import { Message } from "@/components/Chat/types";
import { generateChatCompletion } from "@/services/groqService";
import { toast } from "sonner";
import { processInstructions } from "@/components/Chat/utils";

export const useMessageActions = (messages: Message[], setMessages: React.Dispatch<React.SetStateAction<Message[]>>) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (input: string, e?: React.FormEvent) => {
    e?.preventDefault();
    
    // Allow empty input for the continue functionality
    if (!input.trim() && e) return;
    
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
    
    if (instructions) {
      const instructionMessage: Message = {
        id: `system-instruction-${Date.now()}`,
        role: "system",
        content: instructions,
        timestamp: Date.now(),
      };
      setMessages((prevMessages) => [...prevMessages, instructionMessage]);
    }
    
    try {
      setIsLoading(true);
      
      // Prepare messages for API call with proper context
      // Get system messages for context and instructions
      const systemMessages = messages.filter(msg => msg.role === "system");
      
      // Get all user and assistant messages to maintain conversation flow
      const conversationMessages = messages.filter(msg => msg.role !== "system");
      
      // Enhanced system prompt to enforce continuity
      const enhancedSystemPrompt = {
        id: `system-continuity-${Date.now()}`,
        role: "system" as const,
        content: "CRITICAL: Remember the entire conversation context. Reference previous statements or actions when appropriate. Maintain spatial and emotional continuity between messages. If you referenced an object or location in previous messages, be consistent with it. Complete all sentences and thoughts. Keep responses under 75 words.",
        timestamp: Date.now(),
      };
      
      // Combine all messages to send
      let messagesToSend = [...systemMessages, enhancedSystemPrompt, ...conversationMessages];
      
      if (instructions) {
        messagesToSend.push({
          id: `system-temp`,
          role: "system" as const,
          content: instructions,
          timestamp: Date.now(),
        });
      }
      
      if (visibleText || !e) {
        const messageContent = visibleText || "Please continue";
        
        // Only add a user message to send if it's not a continuation with no text
        if (visibleText || !input.trim()) {
          messagesToSend.push({
            id: `user-temp`,
            role: "user" as const,
            content: messageContent,
            timestamp: Date.now(),
          });
        }
      }
      
      const response = await generateChatCompletion(messagesToSend);
      
      const newAssistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
        regenerations: [],
        timestamp: Date.now(),
      };
      
      setMessages((prevMessages) => [...prevMessages, newAssistantMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      toast.error("Failed to generate response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
      
      // Add continuity reminder
      const continuityReminder = {
        role: "system" as const,
        content: "IMPORTANT: Maintain continuity with your previous physical positions and emotional state. Complete all thoughts and sentences. Keep your response under 75 words."
      };
      
      const messagesToSend = [...systemMessages, continuityReminder, ...conversationMessages];
      
      console.log("Messages to send for regeneration:", messagesToSend);
      
      const response = await generateChatCompletion(messagesToSend);
      
      // Update the messages array with the new response
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages];
        
        // Initialize regenerations array if it doesn't exist
        if (!updatedMessages[actualIndex].regenerations) {
          updatedMessages[actualIndex].regenerations = [];
        }
        
        // Store the current content in regenerations
        updatedMessages[actualIndex].regenerations!.push(
          updatedMessages[actualIndex].content
        );
        
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
    handleSubmit,
    handleRegenerateLastMessage,
  };
};
