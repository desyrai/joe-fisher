
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Maximize, Minimize, RefreshCw } from "lucide-react";

interface ChatHeaderProps {
  characterName: string;
  characterAvatar?: string;
  expandedAvatar: boolean;
  setExpandedAvatar: (expanded: boolean) => void;
  onNewChat: () => void;
}

const ChatHeader = ({
  characterName,
  characterAvatar,
  expandedAvatar,
  setExpandedAvatar,
  onNewChat,
}: ChatHeaderProps) => {
  return (
    <div className="border-b border-desyr-soft-gold/20 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className="cursor-pointer transition-transform duration-300"
            onClick={() => setExpandedAvatar(!expandedAvatar)}
          >
            <Avatar
              className={`border-2 border-desyr-soft-gold/30 transition-all duration-300 ${
                expandedAvatar ? "h-16 w-16" : "h-10 w-10"
              }`}
            >
              <AvatarImage src={characterAvatar} alt={characterName} />
              <AvatarFallback className="bg-desyr-deep-gold text-white">
                {characterName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h3 className="font-playfair text-lg font-medium">{characterName}</h3>
            <p className="text-xs text-desyr-taupe">Online now</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setExpandedAvatar(!expandedAvatar)}
            className="text-desyr-taupe hover:text-desyr-deep-gold"
          >
            {expandedAvatar ? 
              <Minimize className="h-4 w-4" /> : 
              <Maximize className="h-4 w-4" />
            }
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onNewChat}
            className="text-desyr-taupe hover:text-desyr-deep-gold"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            New Chat
          </Button>
        </div>
      </div>
      
      {expandedAvatar && (
        <div className="mt-3 text-sm text-desyr-taupe">
          <p>Alexandra is a sophisticated and experienced confidante, here to engage with you in deep, meaningful conversation.</p>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
