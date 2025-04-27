
import { useState, useEffect } from "react";
import { generateChatCompletion } from "@/services/groqService";
import { toast } from "sonner";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import { Message, ChatProps } from "./types";
import { processInstructions } from "./utils";

const Chat = ({
  characterName = "Joe Fisher",
  characterAvatar = "/character-avatar.jpg",
  initialSystemMessage = "You are Joe Fisher, a dominant, emotionally raw, and protective confidant. You speak directly and with authority, while maintaining respect and boundaries. Your responses are strong and clear, never crude. Match the tone and depth of the user's messages.",
}: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedAvatar, setExpandedAvatar] = useState(false);
  
  useEffect(() => {
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
  }, [initialSystemMessage, characterName]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim() && !e) return;
    
    const processedInput = processInstructions(input);
    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: processedInput.visibleText,
      timestamp: Date.now(),
    };
    
    setInput("");
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    
    if (processedInput.instructions) {
      const instructionMessage: Message = {
        id: `system-instruction-${Date.now()}`,
        role: "system",
        content: processedInput.instructions,
        timestamp: Date.now(),
      };
      setMessages((prevMessages) => [...prevMessages, instructionMessage]);
    }
    
    try {
      setIsLoading(true);
      const messagesToSend: Message[] = [...messages];
      
      if (processedInput.instructions) {
        messagesToSend.push({
          id: `system-temp`,
          role: "system",
          content: processedInput.instructions,
          timestamp: Date.now(),
        });
      }
      
      if (processedInput.visibleText || !e) {
        const messageContent = processedInput.visibleText || "Please continue";
        messagesToSend.push({
          id: `user-temp`,
          role: "user",
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
    
    const newMessages = [
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

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        characterName={characterName}
        characterAvatar={characterAvatar}
        expandedAvatar={expandedAvatar}
        setExpandedAvatar={setExpandedAvatar}
        onNewChat={handleNewChat}
      />
      
      <ChatMessageList
        messages={messages}
        isLoading={isLoading}
        onRemember={handleRemember}
        onEdit={handleEditMessage}
        characterAvatar={characterAvatar}
      />
      
      <ChatInput
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onContinue={handleContinue}
        onRegenerate={handleRegenerateLastMessage}
        hasMessages={messages.some(m => m.role === "assistant" && m.id !== "assistant-welcome")}
      />
    </div>
  );
};

export default Chat;
