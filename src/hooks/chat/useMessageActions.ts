
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
      const messagesToSend = [...messages];
      
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
      
      // Fix: Make sure we send complete Message objects to the API
      const apiMessages = messagesToSend;
      
      const response = await generateChatCompletion(apiMessages);
      
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
    const lastAssistantIndex = [...messages].reverse().findIndex(
      (msg) => msg.role === "assistant" && msg.id !== "assistant-welcome"
    );
    
    if (lastAssistantIndex === -1) return;
    
    const actualIndex = messages.length - 1 - lastAssistantIndex;
    const messageToRegenerate = messages[actualIndex];
    
    const updatedMessages = [...messages];
    if (!updatedMessages[actualIndex].regenerations) {
      updatedMessages[actualIndex].regenerations = [];
    }
    
    updatedMessages[actualIndex].regenerations!.push(
      updatedMessages[actualIndex].content
    );
    
    setMessages(updatedMessages);
    
    try {
      setIsLoading(true);
      // Fix: Use the complete Message objects without mapping and removing properties
      const messagesToSend = messages.slice(0, actualIndex);
      
      const response = await generateChatCompletion(messagesToSend);
      
      const finalMessages = [...updatedMessages];
      finalMessages[actualIndex].content = response;
      setMessages(finalMessages);
    } catch (error) {
      console.error("Error regenerating response:", error);
      toast.error("Failed to generate response. Please try again.");
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
