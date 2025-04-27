
import React, { useRef, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { Message } from "./types";

interface ChatMessageListProps {
  messages: Message[];
  isLoading: boolean;
  onRemember: (messageId: string) => void;
  onEdit: (messageId: string, content: string) => void;
  onRegenerate: () => void;
  characterAvatar?: string;
}

const ChatMessageList = ({
  messages,
  isLoading,
  onRemember,
  onEdit,
  onRegenerate,
  characterAvatar
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
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
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
          />
        ))}
      
      {isLoading && (
        <div className="flex justify-center my-4">
          <div className="chat-bubble-ai w-fit">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin text-desyr-deep-gold" />
              <span className="text-desyr-taupe">Typing...</span>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
