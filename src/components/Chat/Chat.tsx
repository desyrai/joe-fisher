
import { useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import PersonaManager from "./PersonaManager";
import { CharacterPromptModal } from "./CharacterPromptModal";
import { ChatProps, UserInfo } from "./types";
import { useChat } from "@/hooks/chat/useChat";

const Chat = ({
  characterName = "Joe Fisher",
  characterAvatar = "/lovable-uploads/759049ef-1d51-4aa0-b13c-87d10408dcb5.png",
  initialSystemMessage = "You are Joe Fisher, a dominant, emotionally raw, and protective confidant. You speak directly and with authority, while maintaining respect and boundaries. Your responses are strong and clear, never crude. Match the tone and depth of the user's messages.",
}: ChatProps) => {
  const [expandedAvatar, setExpandedAvatar] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [activePersonaId, setActivePersonaId] = useState<string | null>(
    localStorage.getItem("active_persona_id") || null
  );
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: "",
    name: localStorage.getItem("user_name") || "You",
    avatar: localStorage.getItem("user_avatar") || "",
    bio: localStorage.getItem("user_bio") || "",
  });
  
  // Load active persona from local storage
  useEffect(() => {
    const personaId = localStorage.getItem("active_persona_id");
    if (personaId) {
      setActivePersonaId(personaId);
      
      // Load personas from storage
      const savedPersonas = localStorage.getItem("user_personas");
      if (savedPersonas) {
        const personas = JSON.parse(savedPersonas);
        const activePersona = personas.find((p: UserInfo) => p.id === personaId);
        
        if (activePersona) {
          setUserInfo(activePersona);
        }
      }
    }
  }, []);
  
  // Generate a personalized system message that includes user information
  const getPersonalizedSystemMessage = () => {
    let message = initialSystemMessage;
    
    // Add user name personalization if available
    if (userInfo.name && userInfo.name !== "You") {
      message += ` The user's name is ${userInfo.name}. Always address them by name occasionally.`;
    }
    
    // Add bio context if available
    if (userInfo.bio) {
      message += ` IMPORTANT CONTEXT: ${userInfo.bio}. Adapt your responses to show awareness of this background information without explicitly mentioning it every time.`;
    }
    
    return message;
  };
  
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
    initialSystemMessage: getPersonalizedSystemMessage(),
  });
  
  // Re-initialize chat if user info changes
  useEffect(() => {
    initializeChat();
  }, [userInfo, initialSystemMessage, characterName]);
  
  // Handle selecting a persona
  const handleSelectPersona = (persona: UserInfo) => {
    setUserInfo(persona);
    setActivePersonaId(persona.id);
    
    // Save to localStorage for backward compatibility
    localStorage.setItem("user_name", persona.name);
    if (persona.avatar) {
      localStorage.setItem("user_avatar", persona.avatar);
    }
    if (persona.bio) {
      localStorage.setItem("user_bio", persona.bio);
    }
    
    // Start a new chat when switching personas
    handleNewChat();
  };

  return (
    <div className="flex flex-col h-full relative max-w-7xl mx-auto">
      <ChatHeader 
        characterName={characterName}
        characterAvatar={characterAvatar}
        expandedAvatar={expandedAvatar}
        setExpandedAvatar={setExpandedAvatar}
        onNewChat={handleNewChat}
        onShowPrompt={() => setShowPromptModal(true)}
      />
      
      {/* Persona Manager */}
      <div className="border-b border-desyr-soft-gold/20 p-3 flex justify-end">
        <PersonaManager
          activePersnaId={activePersonaId}
          onSelectPersona={handleSelectPersona}
        />
      </div>
      
      <div className="flex flex-col flex-1 overflow-hidden">
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
      
      {showPromptModal && (
        <CharacterPromptModal onClose={() => setShowPromptModal(false)} />
      )}
    </div>
  );
};

export default Chat;
