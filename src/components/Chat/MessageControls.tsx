
import React from 'react';
import { Bookmark, Edit, RefreshCw, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface MessageControlsProps {
  isUser: boolean;
  remembered: boolean;
  onRemember: () => void;
  onEdit: () => void;
  onRegenerate?: () => void;
  regenerations?: string[];
  onSelectVersion?: (content: string) => void;
}

const MessageControls = ({ 
  isUser, 
  remembered, 
  onRemember, 
  onEdit, 
  onRegenerate,
  regenerations = [],
  onSelectVersion
}: MessageControlsProps) => {
  const hasRegenerations = regenerations && regenerations.length > 0;

  return (
    <div className="mt-6 flex justify-end space-x-2 border-t border-desyr-soft-gold/10 pt-3">
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={onRemember}
        className={`text-xs px-2 py-0 h-6 ${
          remembered ? "text-desyr-deep-gold" : "text-desyr-taupe"
        }`}
      >
        <Bookmark className={`h-3 w-3 mr-1 ${remembered ? "fill-desyr-deep-gold" : ""}`} />
        {remembered ? "Remembered" : "Remember"}
      </Button>

      {!isUser && onRegenerate && (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onRegenerate}
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
        onClick={onEdit}
        className="text-xs px-2 py-0 h-6 text-desyr-taupe"
      >
        <Edit className="h-3 w-3 mr-1" />
        Edit
      </Button>

      {/* Previous Versions Dropdown */}
      {hasRegenerations && (
        <div className="mt-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs px-2 py-0 h-6 text-desyr-taupe flex items-center"
              >
                {regenerations.length} previous version{regenerations.length !== 1 ? 's' : ''}
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {regenerations.map((content, index) => (
                <DropdownMenuItem 
                  key={index}
                  className="cursor-pointer"
                  onClick={() => onSelectVersion && onSelectVersion(content)}
                >
                  {content.length > 30 ? `${content.substring(0, 30)}...` : content}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

export default MessageControls;
