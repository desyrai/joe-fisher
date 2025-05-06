
import { useState, useEffect } from "react";
import Chat from "@/components/Chat/Chat";
import Passcode from "@/components/Passcode";
import SignupForm from "@/components/SignupForm";

const ChatPage = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isApiKeySet, setIsApiKeySet] = useState(true); // Set to true since we're hardcoding the key
  
  useEffect(() => {
    // Check if user is already signed up
    const email = localStorage.getItem("desyr_email");
    if (email) {
      setIsSignedUp(true);
    }
    
    // Always set API key to true since we're hardcoding it
    setIsApiKeySet(true);
    
    // Set the API key in localStorage if it's not already there
    const apiKey = localStorage.getItem("openrouter_api_key");
    if (!apiKey) {
      localStorage.setItem("openrouter_api_key", "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");
    }
    
    // Check if the app is already unlocked in this session
    const unlocked = sessionStorage.getItem("app_unlocked");
    if (unlocked === "true") {
      setIsUnlocked(true);
    }

    // Initialize default persona if needed
    initializeDefaultPersona();
  }, []);
  
  // Initialize default persona if none exists
  const initializeDefaultPersona = () => {
    const savedPersonas = localStorage.getItem('user_personas');
    if (!savedPersonas) {
      const name = localStorage.getItem('user_name');
      const avatar = localStorage.getItem('user_avatar');
      const bio = localStorage.getItem('user_bio');
      
      // Create a default persona from existing user data or empty
      const defaultPersona = {
        id: 'default',
        name: name || 'You',
        avatar: avatar || '',
        bio: bio || ''
      };
      
      localStorage.setItem('user_personas', JSON.stringify([defaultPersona]));
      localStorage.setItem('active_persona_id', defaultPersona.id);
    }
  };
  
  const handleSignup = (email: string) => {
    setIsSignedUp(true);
  };
  
  const handleUnlock = () => {
    setIsUnlocked(true);
    // Store unlock state in session storage to persist during page refresh
    sessionStorage.setItem("app_unlocked", "true");
  };
  
  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Passcode onSuccess={handleUnlock} passcodeLength={4} />
      </div>
    );
  }
  
  if (!isSignedUp) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <SignupForm onSignup={handleSignup} />
      </div>
    );
  }
  
  // We're skipping the API key setup screen since the key is hardcoded
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-full flex-1 marble-card m-0 sm:m-2 md:m-4 rounded-none sm:rounded-xl overflow-hidden"> {/* Reduced margins to use more screen space */}
        <Chat 
          characterName="Joe Fisher" 
          characterAvatar="/lovable-uploads/759049ef-1d51-4aa0-b13c-87d10408dcb5.png"
        />
      </div>
    </div>
  );
};

export default ChatPage;
