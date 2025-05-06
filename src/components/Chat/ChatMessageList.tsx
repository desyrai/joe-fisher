
import React, { useRef, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { Message } from "./types";
import { Card } from "@/components/ui/card";

interface ChatMessageListProps {
  messages: Message[];
  isLoading: boolean;
  onRemember: (messageId: string) => void;
  onEdit: (messageId: string, content: string) => void;
  onRegenerate: () => void;
  characterAvatar?: string;
  userInfo?: {
    name: string;
    avatar?: string;
  };
}

const ChatMessageList = ({
  messages,
  isLoading,
  onRemember,
  onEdit,
  onRegenerate,
  characterAvatar,
  userInfo
}: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Find all assistant messages that can be regenerated
  const assistantMessages = messages
    .filter(msg => msg.role === "assistant" && msg.id !== "assistant-welcome");
  
  // Get the last assistant message for regeneration
  const lastAssistantMessage = assistantMessages.length > 0 ? 
    assistantMessages[assistantMessages.length - 1] : null;

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8"> {/* Main container with overflow handling */}
      {messages
        .filter(msg => msg.role !== "system")
        .map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onRemember={() => onRemember(message.id)}
            onEdit={(content) => onEdit(message.id, content)}
            onRegenerate={message.id === lastAssistantMessage?.id ? onRegenerate : undefined}
            characterAvatar={characterAvatar}
            userInfo={userInfo}
          />
        ))}
      
      {isLoading && (
        <Card className="p-4 border border-desyr-soft-gold/20 shadow-sm">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 animate-spin text-desyr-deep-gold" />
            <span className="text-desyr-taupe text-lg">Joe is typing...</span>
          </div>
        </Card>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
