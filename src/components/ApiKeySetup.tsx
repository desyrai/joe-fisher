
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getGroqApiKey, setGroqApiKey } from "@/services/groqService";

interface ApiKeySetupProps {
  onComplete: () => void;
}

const ApiKeySetup = ({ onComplete }: ApiKeySetupProps) => {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  
  useEffect(() => {
    // Check if API key already exists
    const existingKey = getGroqApiKey();
    if (existingKey) {
      onComplete();
    }
  }, [onComplete]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setError("Please enter your Groq API key");
      return;
    }
    
    // Basic validation - Groq keys usually start with 'gsk_'
    if (!apiKey.startsWith("gsk_")) {
      setError("This doesn't look like a valid Groq API key");
      return;
    }
    
    // Save the API key
    setGroqApiKey(apiKey);
    onComplete();
  };
  
  return (
    <div className="w-full max-w-md animate-fade-in">
      <h2 className="text-2xl font-playfair gold-gradient mb-2">Connect Your Groq API</h2>
      <p className="text-desyr-taupe mb-6">
        To enable the chat functionality, please enter your Groq API key.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="password"
            placeholder="Your Groq API key (starts with gsk_)"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              setError("");
            }}
            className="py-6 border-desyr-soft-gold/30 focus:border-desyr-deep-gold"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        
        <Button 
          type="submit" 
          className="w-full gold-button py-6"
        >
          Connect API
        </Button>
        
        <p className="text-xs text-center text-desyr-taupe mt-4">
          Your API key is stored locally in your browser and is never sent to our servers.
          <br />
          <a 
            href="https://console.groq.com/keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-desyr-deep-gold hover:underline"
          >
            Get a Groq API key here
          </a>
        </p>
      </form>
    </div>
  );
};

export default ApiKeySetup;
