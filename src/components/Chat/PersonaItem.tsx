
import React from 'react';
import { Check, Edit, Trash2, User } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { UserInfo } from './types';

interface PersonaItemProps {
  persona: UserInfo;
  isActive: boolean;
  onSelect: (persona: UserInfo) => void;
  onEdit: (persona: UserInfo) => void;
  onDelete: (personaId: string) => void;
  showDeleteButton: boolean;
}

const PersonaItem: React.FC<PersonaItemProps> = ({ 
  persona, 
  isActive, 
  onSelect, 
  onEdit, 
  onDelete,
  showDeleteButton 
}) => {
  return (
    <DropdownMenuItem 
      key={persona.id} 
      onClick={() => onSelect(persona)}
      className="flex justify-between items-center cursor-pointer"
    >
      <div className="flex items-center">
        {persona.avatar ? (
          <div className="h-6 w-6 mr-2 rounded-sm overflow-hidden">
            <img src={persona.avatar} alt={persona.name} className="h-full w-full object-cover" />
          </div>
        ) : (
          <User className="h-4 w-4 mr-2" />
        )}
        <span>{persona.name}</span>
      </div>
      <div className="flex items-center">
        {isActive && (
          <Check className="h-4 w-4 mr-2" />
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(persona); }} 
          className="text-muted-foreground hover:text-foreground ml-2"
        >
          <Edit className="h-4 w-4" />
        </button>
        {showDeleteButton && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(persona.id); }}
            className="text-muted-foreground hover:text-destructive ml-2"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </DropdownMenuItem>
  );
};

export default PersonaItem;
