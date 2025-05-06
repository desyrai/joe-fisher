
import { useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import PersonaSetup from "./PersonaSetup";
import { ChatProps, UserInfo } from "./types";
import { useChat } from "@/hooks/chat/useChat";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const Chat = ({
  characterName = "Joe Fisher",
  characterAvatar = "/lovable-uploads/759049ef-1d51-4aa0-b13c-87d10408dcb5.png",
  initialSystemMessage = "You are Joe Fisher, a dominant, emotionally raw, and protective confidant. You speak directly and with authority, while maintaining respect and boundaries. Your responses are strong and clear, never crude. Match the tone and depth of the user's messages.",
}: ChatProps) => {
  const [expandedAvatar, setExpandedAvatar] = useState(false);
  const [showPersonaSetup, setShowPersonaSetup] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: localStorage.getItem("user_name") || "You",
    avatar: localStorage.getItem("user_avatar") || "",
  });
  
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
  
  // Save user info to localStorage
  useEffect(() => {
    localStorage.setItem("user_name", userInfo.name);
    if (userInfo.avatar) {
      localStorage.setItem("user_avatar", userInfo.avatar);
    }
  }, [userInfo]);

  return (
    <div className="flex flex-col h-full relative max-w-7xl mx-auto"> {/* Added max width and centered */}
      <ChatHeader 
        characterName={characterName}
        characterAvatar={characterAvatar}
        expandedAvatar={expandedAvatar}
        setExpandedAvatar={setExpandedAvatar}
        onNewChat={handleNewChat}
      />
      
      {/* Persona Setup Button */}
      <div className="border-b border-desyr-soft-gold/20 p-3 flex justify-end"> {/* Increased padding */}
        <Button 
          variant="outline" 
          className="border-desyr-soft-gold/30 hover:bg-desyr-soft-gold/10"
          onClick={() => setShowPersonaSetup(true)}
        >
          <User className="h-4 w-4 mr-2" />
          {userInfo.name !== "You" ? userInfo.name : "Set Your Persona"}
        </Button>
      </div>
      
      {/* Persona Setup Modal */}
      {showPersonaSetup && (
        <PersonaSetup 
          userInfo={userInfo}
          onSave={(info) => {
            setUserInfo(info);
            setShowPersonaSetup(false);
          }}
          onCancel={() => setShowPersonaSetup(false)} 
        />
      )}
      
      <div className="flex flex-col flex-1 overflow-hidden"> {/* Added container for better scroll control */}
        <ChatMessageList
          messages={messages}
          isLoading={isLoading}
          onRemember={handleRemember}
          onEdit={handleEditMessage}
          onRegenerate={handleRegenerateLastMessage}
          characterAvatar={characterAvatar}
          userInfo={userInfo}
        />
      </div>
      
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
