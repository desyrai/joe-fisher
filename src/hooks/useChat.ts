
import { useState } from "react";
import { generateChatCompletion } from "@/services/groqService";
import { toast } from "sonner";
import { Message } from "@/components/Chat/types";
import { processInstructions } from "@/components/Chat/utils";

interface UseChatProps {
  characterName: string;
  initialSystemMessage: string;
}

export const useChat = ({ characterName, initialSystemMessage }: UseChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const initializeChat = () => {
    const initialMessages: Message[] = [
      {
        id: "system-1",
        role: "system",
        content: initialSystemMessage,
        timestamp: Date.now(),
      },
      {
        id: "assistant-welcome",
        role: "assistant",
        content: `Hello, I'm ${characterName}. It's lovely to meet you. What's on your mind today?`,
        timestamp: Date.now(),
      },
    ];
    setMessages(initialMessages);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim() && !e) return;
    
    const { visibleText, instructions } = processInstructions(input);
    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: visibleText,
      timestamp: Date.now(),
    };
    
    setInput("");
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    
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
        messagesToSend.push({
          id: `user-temp`,
          role: "user" as const,
          content: messageContent,
          timestamp: Date.now(),
        });
      }
      
      const apiMessages = messagesToSend.map(({ role, content }) => ({
        role,
        content,
      }));
      
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

  const handleContinue = () => {
    handleSubmit();
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
      const messagesToSend = messages
        .slice(0, actualIndex)
        .map(({ role, content }) => ({ role, content }));
      
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

  const handleRemember = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, remembered: !msg.remembered } : msg
      )
    );
  };

  const handleNewChat = () => {
    const rememberedMessages = messages.filter(
      (msg) => msg.remembered || msg.role === "system"
    );
    
    const newMessages: Message[] = [
      ...rememberedMessages,
      {
        id: `assistant-welcome-${Date.now()}`,
        role: "assistant",
        content: `Starting a fresh conversation. Is there something specific you'd like to discuss?`,
        timestamp: Date.now(),
      },
    ];
    
    setMessages(newMessages);
    setInput("");
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, content: newContent } : msg
      )
    );
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    handleSubmit,
    handleContinue,
    handleRegenerateLastMessage,
    handleRemember,
    handleNewChat,
    handleEditMessage,
    initializeChat,
  };
};
