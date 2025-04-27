
import { useState } from "react";
import { Message } from "@/components/Chat/types";
import { generateChatCompletion } from "@/services/groqService";
import { toast } from "sonner";
import { processInstructions } from "@/components/Chat/utils";

export const useMessageActions = (messages: Message[], setMessages: React.Dispatch<React.SetStateAction<Message[]>>) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (input: string, e?: React.FormEvent) => {
    e?.preventDefault();
    
    // Filter out remembered messages to include in context
    const rememberedMessages = messages.filter(msg => msg.remembered);
    
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
      const messagesToSend = [
        ...rememberedMessages,
        ...messages.filter(msg => msg.role === "system")
      ];
      
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
      
      // Create a copy of messages to send for context, including system messages and remembered messages
      // Plus all messages leading up to but not including the message to regenerate
      const messagesToSend = [
        ...messages.filter(msg => msg.role === "system" || msg.remembered),
        ...messages.slice(0, actualIndex).filter(msg => msg.role !== "system" && !msg.remembered)
      ];
      
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
