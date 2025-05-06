
import React, { useState, useEffect } from 'react';
import { UserInfo } from './types';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown, Plus, User, Edit, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from '../ui/card';
import PersonaSetup from './PersonaSetup';

interface PersonaManagerProps {
  activePersnaId: string | null;
  onSelectPersona: (persona: UserInfo) => void;
}

const PersonaManager: React.FC<PersonaManagerProps> = ({ activePersnaId, onSelectPersona }) => {
  const [personas, setPersonas] = useState<UserInfo[]>([]);
  const [showPersonaSetup, setShowPersonaSetup] = useState(false);
  const [editingPersona, setEditingPersona] = useState<UserInfo | null>(null);
  
  // Load personas from localStorage on component mount
  useEffect(() => {
    const savedPersonas = localStorage.getItem('user_personas');
    if (savedPersonas) {
      setPersonas(JSON.parse(savedPersonas));
    } else {
      // If no personas exist, create a default one from existing user data
      const name = localStorage.getItem('user_name');
      const avatar = localStorage.getItem('user_avatar');
      const bio = localStorage.getItem('user_bio');
      
      if (name || avatar || bio) {
        const defaultPersona: UserInfo = {
          id: 'default',
          name: name || 'You',
          avatar: avatar || '',
          bio: bio || ''
        };
        
        const initialPersonas = [defaultPersona];
        setPersonas(initialPersonas);
        localStorage.setItem('user_personas', JSON.stringify(initialPersonas));
        localStorage.setItem('active_persona_id', defaultPersona.id);
      }
    }
  }, []);
  
  // Save personas to localStorage whenever it changes
  useEffect(() => {
    if (personas.length > 0) {
      localStorage.setItem('user_personas', JSON.stringify(personas));
    }
  }, [personas]);
  
  const handleCreateNewPersona = () => {
    setEditingPersona(null);
    setShowPersonaSetup(true);
  };
  
  const handleEditPersona = (persona: UserInfo) => {
    setEditingPersona(persona);
    setShowPersonaSetup(true);
  };
  
  const handleDeletePersona = (personaId: string) => {
    const updatedPersonas = personas.filter(p => p.id !== personaId);
    setPersonas(updatedPersonas);
    
    // If the active persona was deleted, select the first available one
    if (personaId === activePersnaId && updatedPersonas.length > 0) {
      onSelectPersona(updatedPersonas[0]);
      localStorage.setItem('active_persona_id', updatedPersonas[0].id);
    }
  };
  
  const handleSelectPersona = (persona: UserInfo) => {
    onSelectPersona(persona);
    localStorage.setItem('active_persona_id', persona.id);
    
    // Also update the individual fields for backward compatibility
    localStorage.setItem('user_name', persona.name);
    if (persona.avatar) localStorage.setItem('user_avatar', persona.avatar);
    if (persona.bio) localStorage.setItem('user_bio', persona.bio);
  };
  
  const handleSavePersona = (personaData: UserInfo) => {
    if (editingPersona) {
      // Editing existing persona
      const updatedPersonas = personas.map(p => 
        p.id === editingPersona.id ? { ...personaData, id: editingPersona.id } : p
      );
      setPersonas(updatedPersonas);
      
      // If editing the active persona, update the selected one
      if (editingPersona.id === activePersnaId) {
        handleSelectPersona({ ...personaData, id: editingPersona.id });
      }
    } else {
      // Creating new persona
      const newPersona = {
        ...personaData,
        id: `persona-${Date.now()}`
      };
      
      const updatedPersonas = [...personas, newPersona];
      setPersonas(updatedPersonas);
      
      // Select the newly created persona
      handleSelectPersona(newPersona);
    }
    
    setShowPersonaSetup(false);
    setEditingPersona(null);
  };
  
  // Find the active persona
  const activePersona = personas.find(p => p.id === activePersnaId) || personas[0];
  
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
        <DropdownMenuContent className="w-56 bg-background border-desyr-soft-gold/20">
          <Card className="border-none shadow-none">
            <CardHeader className="py-2 px-2">
              <CardTitle className="text-sm font-medium">Your Personas</CardTitle>
            </CardHeader>
          </Card>
          
          {personas.map(persona => (
            <DropdownMenuItem 
              key={persona.id} 
              onClick={() => handleSelectPersona(persona)}
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
                {persona.id === activePersnaId && (
                  <Check className="h-4 w-4 mr-2" />
                )}
                <button 
                  onClick={(e) => { e.stopPropagation(); handleEditPersona(persona); }} 
                  className="text-muted-foreground hover:text-foreground ml-2"
                >
                  <Edit className="h-4 w-4" />
                </button>
                {personas.length > 1 && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeletePersona(persona.id); }}
                    className="text-muted-foreground hover:text-destructive ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleCreateNewPersona}
            className="cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Persona
          </DropdownMenuItem>
        </DropdownMenuContent>
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
