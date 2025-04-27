
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { generateChatCompletion } from "@/services/groqService";
import ChatMessage from "./ChatMessage";
import ChatHeader from "./ChatHeader";
import { toast } from "sonner";
import { RefreshCw, Send, Italic } from "lucide-react";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  remembered?: boolean;
  regenerations?: string[];
  timestamp: number;
}

interface ChatProps {
  characterName?: string;
  characterAvatar?: string;
  initialSystemMessage?: string;
}

const Chat = ({
  characterName = "Alexandra",
  characterAvatar = "/character-avatar.jpg",
  initialSystemMessage = "You are Alexandra, a sophisticated, warm, and wise confidante. You speak with elegance and sensuality, offering insights on relationships, intimacy, and personal growth. Your responses are thoughtful and nuanced, never crude. Match the tone and depth of the user's messages.",
}: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedAvatar, setExpandedAvatar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    // Add system message when component mounts
    setMessages([
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
    ]);
  }, [initialSystemMessage, characterName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim() && !e) return; // Allow empty for continuation
    
    const processedInput = processInstructions(input);
    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: processedInput.visibleText,
      timestamp: Date.now(),
    };
    
    // Clear input and add user message
    setInput("");
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    
    // Add any hidden instructions as system messages
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
      const messagesToSend = [...messages];
      
      // Add new messages
      if (processedInput.instructions) {
        messagesToSend.push({
          id: `system-temp`,
          role: "system" as const,
          content: processedInput.instructions,
          timestamp: Date.now(),
        });
      }
      
      if (processedInput.visibleText || !e) {
        // Only add user message if there's visible text or it's a continuation
        const messageContent = processedInput.visibleText || "Please continue";
        messagesToSend.push({
          id: `user-temp`,
          role: "user" as const,
          content: messageContent,
          timestamp: Date.now(),
        });
      }
      
      // Filter to only include role and content for the API
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleContinue = () => {
    // Just call handleSubmit with no form event
    handleSubmit();
  };

  const handleRegenerateLastMessage = async () => {
    // Find last assistant message
    const lastAssistantIndex = [...messages].reverse().findIndex(
      (msg) => msg.role === "assistant" && msg.id !== "assistant-welcome"
    );
    
    if (lastAssistantIndex === -1) return;
    
    const actualIndex = messages.length - 1 - lastAssistantIndex;
    const messageToRegenerate = messages[actualIndex];
    
    // Save current response in regenerations
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
      // Get all messages up to but not including the one to regenerate
      const messagesToSend = messages
        .slice(0, actualIndex)
        .map(({ role, content }) => ({ role, content }));
      
      const response = await generateChatCompletion(messagesToSend);
      
      // Update the message with the new content
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
    // Keep only remembered messages and system instructions
    const rememberedMessages = messages.filter(
      (msg) => msg.remembered || msg.role === "system"
    );
    
    // Add a new welcome message
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

  const insertItalics = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const selectedText = input.substring(start, end);
      const newText = 
        input.substring(0, start) + 
        `*${selectedText}*` + 
        input.substring(end);
      
      setInput(newText);
      
      // Focus back on textarea and set cursor position after italics
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const newPosition = start + selectedText.length + 2;
          textareaRef.current.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
    }
  };

  // Process instructions enclosed in double parentheses
  const processInstructions = (text: string) => {
    const instructionRegex = /\(\((.*?)\)\)/g;
    const instructions: string[] = [];
    let visibleText = text;
    
    // Extract instructions
    let match;
    while ((match = instructionRegex.exec(text)) !== null) {
      instructions.push(match[1]);
    }
    
    // Remove instructions from visible text
    visibleText = visibleText.replace(instructionRegex, "").trim();
    
    return {
      visibleText,
      instructions: instructions.length > 0 ? instructions.join(". ") : "",
    };
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
      
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages
          .filter(msg => msg.role !== "system")
          .map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onRemember={() => handleRemember(message.id)}
              onEdit={(content) => handleEditMessage(message.id, content)}
              characterAvatar={characterAvatar}
            />
          ))}
        
        {isLoading && (
          <div className="flex justify-center my-4">
            <div className="chat-bubble-ai w-fit">
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin text-desyr-deep-gold" />
                <span className="text-desyr-taupe">{characterName} is typing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-desyr-soft-gold/20 p-4">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (use (( )) for instructions)"
              className="min-h-[100px] pr-10 resize-none border-desyr-soft-gold/30"
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 text-desyr-deep-gold hover:text-desyr-soft-gold hover:bg-transparent"
              onClick={insertItalics}
            >
              <Italic className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex justify-between space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleRegenerateLastMessage}
              disabled={isLoading || !messages.some(m => m.role === "assistant" && m.id !== "assistant-welcome")}
              className="border-desyr-soft-gold/30 hover:bg-desyr-soft-gold/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </Button>
            
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleContinue}
                disabled={isLoading}
                className="border-desyr-soft-gold/30 hover:bg-desyr-soft-gold/10"
              >
                Continue
              </Button>
              
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim()} 
                className="gold-button"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
