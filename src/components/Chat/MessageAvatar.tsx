
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageAvatarProps {
  isUser: boolean;
  avatar?: string;
  name: string;
}

const MessageAvatar = ({ isUser, avatar, name }: MessageAvatarProps) => {
  return (
    <div className="p-6 flex flex-col items-center min-w-[280px] max-w-[300px] border-r border-desyr-soft-gold/20">
      <Avatar className="w-full max-h-[350px] border-2 border-desyr-soft-gold/30 mb-4">
        <AvatarImage 
          src={isUser ? (avatar || "/placeholder.svg") : avatar} 
          alt={isUser ? name : "Character"} 
          className="object-cover" 
        />
        <AvatarFallback className={`${isUser ? "bg-desyr-taupe" : "bg-desyr-deep-gold"} text-white text-2xl`}>
          {isUser ? name.charAt(0) : "JF"}
        </AvatarFallback>
      </Avatar>
      <p className="text-center font-playfair text-xl mt-2">{isUser ? name : "Joe Fisher"}</p>
    </div>
  );
};

export default MessageAvatar;
