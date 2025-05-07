
import React from 'react';
import { Plus } from "lucide-react";
import { 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Card, CardHeader, CardTitle } from '../ui/card';
import PersonaItem from './PersonaItem';
import { UserInfo } from './types';

interface PersonaListProps {
  personas: UserInfo[];
  activePersonaId: string | null;
  onSelectPersona: (persona: UserInfo) => void;
  onEditPersona: (persona: UserInfo) => void;
  onDeletePersona: (personaId: string) => void;
  onCreateNewPersona: () => void;
}

const PersonaList: React.FC<PersonaListProps> = ({ 
  personas, 
  activePersonaId, 
  onSelectPersona, 
  onEditPersona, 
  onDeletePersona,
  onCreateNewPersona 
}) => {
  return (
    <DropdownMenuContent className="w-56 bg-background border-desyr-soft-gold/20">
      <Card className="border-none shadow-none">
        <CardHeader className="py-2 px-2">
          <CardTitle className="text-sm font-medium">Your Personas</CardTitle>
        </CardHeader>
      </Card>
      
      {personas.map(persona => (
        <PersonaItem
          key={persona.id}
          persona={persona}
          isActive={persona.id === activePersonaId}
          onSelect={onSelectPersona}
          onEdit={onEditPersona}
          onDelete={onDeletePersona}
          showDeleteButton={personas.length > 1}
        />
      ))}

      <DropdownMenuSeparator />
      <DropdownMenuItem 
        onClick={onCreateNewPersona}
        className="cursor-pointer"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create New Persona
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};

export default PersonaList;
