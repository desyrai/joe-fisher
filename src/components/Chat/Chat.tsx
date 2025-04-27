
import { useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import { ChatProps } from "./types";
import { useChat } from "@/hooks/chat/useChat";

const Chat = ({
  characterName = "Joe Fisher",
  characterAvatar = "/character-avatar.jpg",
  initialSystemMessage = "You are Joe Fisher, a dominant, emotionally raw, and protective confidant. You speak directly and with authority, while maintaining respect and boundaries. Your responses are strong and clear, never crude. Match the tone and depth of the user's messages.",
}: ChatProps) => {
  const [expandedAvatar, setExpandedAvatar] = useState(false);
  
  const {
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
  } = useChat({
    characterName,
    initialSystemMessage,
  });
  
  useEffect(() => {
    initializeChat();
  }, [initialSystemMessage, characterName]);

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
        onRegenerate={handleRegenerateLastMessage}
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
