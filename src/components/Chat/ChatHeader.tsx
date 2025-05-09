
import { useState } from "react";
import { RefreshCw, ArrowDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatHeaderProps {
  characterName: string;
  characterAvatar?: string;
  expandedAvatar: boolean;
  setExpandedAvatar: (expanded: boolean) => void;
  onNewChat: () => void;
  onShowPrompt: () => void;
}

const ChatHeader = ({
  characterName,
  characterAvatar,
  expandedAvatar,
  setExpandedAvatar,
  onNewChat,
  onShowPrompt
}: ChatHeaderProps) => {
  return (
    <div className="py-3 px-6 border-b border-desyr-soft-gold/20 bg-desyr-cream/80 backdrop-blur-sm flex items-center justify-between">
      <div className="flex gap-3 items-center">
        <div 
          className="cursor-pointer transition-transform" 
          onClick={() => setExpandedAvatar(!expandedAvatar)}
        >
          <Avatar className="h-10 w-10 border border-desyr-soft-gold/30">
            <AvatarImage src={characterAvatar} alt={characterName} className="object-cover" />
            <AvatarFallback className="bg-desyr-deep-gold text-white">
              {characterName.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex flex-col">
          <p className="font-bold font-playfair text-lg text-desyr-taupe">{characterName}</p>
          <p className="text-xs text-desyr-taupe/70">MMA Fighter & Gym Owner</p>
        </div>
        
        {expandedAvatar && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 h-6 text-desyr-taupe opacity-70 hover:opacity-100"
            onClick={() => setExpandedAvatar(false)}
          >
            <ArrowDown size={16} />
          </Button>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-desyr-taupe opacity-70 hover:opacity-100 hover:bg-desyr-soft-gold/10" 
          onClick={onShowPrompt}
        >
          <Info size={18} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-desyr-taupe opacity-70 hover:opacity-100 hover:bg-desyr-soft-gold/10" 
          onClick={onNewChat}
        >
          <RefreshCw size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
