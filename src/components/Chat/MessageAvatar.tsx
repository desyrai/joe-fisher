
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageAvatarProps {
  isUser: boolean;
  avatar?: string;
  name: string;
}

const MessageAvatar = ({ isUser, avatar, name }: MessageAvatarProps) => {
  // Log the avatar URL for debugging
  console.log("MessageAvatar rendering:", { isUser, avatar, name });
  
  // Use the avatar directly, with a placeholder fallback
  const imageSource = avatar || "/placeholder.svg";

  return (
    <div className="p-6 flex flex-col items-center min-w-[280px] max-w-[300px] border-r border-desyr-soft-gold/20">
      <Avatar className="w-full max-h-[350px] border-2 border-desyr-soft-gold/30 mb-4">
        <AvatarImage 
          src={imageSource} 
          alt={isUser ? name : "Character"} 
          className="object-cover" 
          onError={(e) => {
            console.error("Avatar image failed to load:", imageSource);
            // If image fails to load, set src to placeholder
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
        <AvatarFallback className={`${isUser ? "bg-desyr-taupe" : "bg-desyr-deep-gold"} text-white text-2xl`}>
          {isUser ? name.charAt(0).toUpperCase() : "JF"}
        </AvatarFallback>
      </Avatar>
      <p className="text-center font-playfair text-xl mt-2">{isUser ? name : "Joe Fisher"}</p>
    </div>
  );
};

export default MessageAvatar;
