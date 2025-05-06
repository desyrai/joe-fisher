
import { RefreshCw, Bookmark, Edit, SkipForward, Check, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Message } from "./types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: Message;
  onRemember: () => void;
  onEdit: (newContent: string) => void;
  onRegenerate?: () => void;
  characterAvatar?: string;
  userInfo?: {
    name: string;
    avatar?: string;
  };
}

const ChatMessage = ({ 
  message, 
  onRemember, 
  onEdit, 
  onRegenerate, 
  characterAvatar,
  userInfo = { name: "You" } 
}: ChatMessageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  
  const isUser = message.role === "user";
  
  const handleSaveEdit = () => {
    onEdit(editContent);
    setIsEditing(false);
  };
  
  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const handleSelectPreviousVersion = (content: string) => {
    onEdit(content);
  };

  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate();
    }
  };
  
  // Show previous versions dropdown only if there are actual regenerations
  const hasRegenerations = message.regenerations && message.regenerations.length > 0;
  
  // Parse message content for color formatting
  const formatMessageContent = (content: string) => {
    // Apply any specific formatting here if needed
    return content;
  };

  return (
    <div className="mb-10"> {/* Increased bottom margin for better message separation */}
      <Card className="border border-desyr-soft-gold/20 shadow-sm">
        <div className="flex flex-col md:flex-row">
          {/* Left Column - Character Image and Name */}
          <div className="p-6 flex flex-col items-center min-w-[280px] max-w-[300px] border-r border-desyr-soft-gold/20">
            <Avatar className="w-full max-h-[350px] border-2 border-desyr-soft-gold/30 mb-4"> {/* Increased size and spacing */}
              <AvatarImage 
                src={isUser ? (userInfo.avatar || "/placeholder.svg") : characterAvatar} 
                alt={isUser ? userInfo.name : "Character"} 
                className="object-cover" 
              />
              <AvatarFallback className={`${isUser ? "bg-desyr-taupe" : "bg-desyr-deep-gold"} text-white text-2xl`}>
                {isUser ? userInfo.name.charAt(0) : "JF"}
              </AvatarFallback>
            </Avatar>
            <p className="text-center font-playfair text-xl mt-2">{isUser ? userInfo.name : "Joe Fisher"}</p>
          </div>

          {/* Right Column - Message Content */}
          <div className="flex-1 p-8"> {/* Increased padding for better text display */}
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[200px] border-desyr-soft-gold/30 text-lg" /* Increased height and font size */
                  autoFocus
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={handleCancelEdit}
                    className="text-desyr-taupe"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSaveEdit}
                    className="gold-button"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <ReactMarkdown 
                className="prose prose-lg max-w-none prose-p:my-4" /* Increased font size and paragraph spacing */
                components={{
                  p: ({node, ...props}) => <p className="mb-5 last:mb-0 text-lg" {...props} />, /* Larger text and spacing */
                  em: ({node, ...props}) => <em className="text-desyr-deep-gold font-normal not-italic" {...props} />,
                  strong: ({node, ...props}) => <strong className="text-desyr-soft-gold" {...props} />,
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-desyr-soft-gold/50 pl-4 italic text-desyr-deep-gold/80" {...props} />
                  )
                }}
              >
                {formatMessageContent(message.content)}
              </ReactMarkdown>
            )}

            {/* Message Controls - moved to bottom with more spacing */}
            <div className="mt-6 flex justify-end space-x-2 border-t border-desyr-soft-gold/10 pt-3">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={onRemember}
                className={`text-xs px-2 py-0 h-6 ${
                  message.remembered ? "text-desyr-deep-gold" : "text-desyr-taupe"
                }`}
              >
                <Bookmark className={`h-3 w-3 mr-1 ${message.remembered ? "fill-desyr-deep-gold" : ""}`} />
                {message.remembered ? "Remembered" : "Remember"}
              </Button>

              {!isUser && onRegenerate && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleRegenerate}
                  className="text-xs px-2 py-0 h-6 text-desyr-taupe hover:text-desyr-deep-gold hover:bg-desyr-soft-gold/10"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Regenerate
                </Button>
              )}
              
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="text-xs px-2 py-0 h-6 text-desyr-taupe"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </div>

            {/* Previous Versions */}
            {hasRegenerations && (
              <div className="mt-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs px-2 py-0 h-6 text-desyr-taupe flex items-center"
                    >
                      {message.regenerations!.length} previous version{message.regenerations!.length !== 1 ? 's' : ''}
                      <ChevronDown className="h-3 w-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    {message.regenerations!.map((content, index) => (
                      <DropdownMenuItem 
                        key={index}
                        className="cursor-pointer"
                        onClick={() => handleSelectPreviousVersion(content)}
                      >
                        {content.length > 30 ? `${content.substring(0, 30)}...` : content}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatMessage;
