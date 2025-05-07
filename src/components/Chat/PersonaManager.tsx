
import React, { useState, useEffect } from 'react';
import { UserInfo } from './types';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, User } from "lucide-react";
import PersonaSetup from './PersonaSetup';
import PersonaList from './PersonaList';
import { usePersonaStorage } from './hooks/usePersonaStorage';

interface PersonaManagerProps {
  activePersnaId: string | null;
  onSelectPersona: (persona: UserInfo) => void;
}

const PersonaManager: React.FC<PersonaManagerProps> = ({ activePersnaId, onSelectPersona }) => {
  const { 
    personas, 
    activePersona,
    loadPersonas, 
    savePersonas, 
    selectPersona,
    savePersona, 
    deletePersona 
  } = usePersonaStorage(activePersnaId, onSelectPersona);
  
  const [showPersonaSetup, setShowPersonaSetup] = useState(false);
  const [editingPersona, setEditingPersona] = useState<UserInfo | null>(null);
  
  // Load personas from localStorage on component mount
  useEffect(() => {
    loadPersonas();
  }, []);
  
  // Handle creating a new persona
  const handleCreateNewPersona = () => {
    setEditingPersona(null);
    setShowPersonaSetup(true);
  };
  
  // Handle editing an existing persona
  const handleEditPersona = (persona: UserInfo) => {
    setEditingPersona(persona);
    setShowPersonaSetup(true);
  };
  
  // Handle deleting a persona
  const handleDeletePersona = (personaId: string) => {
    deletePersona(personaId);
  };
  
  // Handle selecting a persona
  const handleSelectPersona = (persona: UserInfo) => {
    selectPersona(persona);
  };
  
  // Handle saving a persona (new or edited)
  const handleSavePersona = (personaData: UserInfo) => {
    savePersona(personaData, editingPersona);
    setShowPersonaSetup(false);
    setEditingPersona(null);
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="border-desyr-soft-gold/30 hover:bg-desyr-soft-gold/10"
          >
            <User className="h-4 w-4 mr-2" />
            {activePersona?.name || "Select Persona"}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        
        <PersonaList
          personas={personas}
          activePersonaId={activePersnaId}
          onSelectPersona={handleSelectPersona}
          onEditPersona={handleEditPersona}
          onDeletePersona={handleDeletePersona}
          onCreateNewPersona={handleCreateNewPersona}
        />
      </DropdownMenu>
      
      {/* Persona Setup Modal */}
      {showPersonaSetup && (
        <PersonaSetup 
          userInfo={editingPersona || { id: '', name: '', avatar: '', bio: '' }}
          onSave={handleSavePersona}
          onCancel={() => {
            setShowPersonaSetup(false);
            setEditingPersona(null);
          }} 
          isEditing={!!editingPersona}
        />
      )}
    </>
  );
};

export default PersonaManager;
