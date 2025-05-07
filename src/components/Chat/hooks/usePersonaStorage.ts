
import { useState } from 'react';
import { UserInfo } from '../types';

export const usePersonaStorage = (
  activePersonaId: string | null,
  onPersonaSelect: (persona: UserInfo) => void
) => {
  const [personas, setPersonas] = useState<UserInfo[]>([]);
  
  // Load personas from localStorage
  const loadPersonas = () => {
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
        savePersonasToStorage(initialPersonas);
        localStorage.setItem('active_persona_id', defaultPersona.id);
      }
    }
  };
  
  // Save personas to localStorage
  const savePersonasToStorage = (updatedPersonas: UserInfo[]) => {
    if (updatedPersonas.length > 0) {
      localStorage.setItem('user_personas', JSON.stringify(updatedPersonas));
    }
  };
  
  // Delete a persona
  const deletePersona = (personaId: string) => {
    const updatedPersonas = personas.filter(p => p.id !== personaId);
    setPersonas(updatedPersonas);
    savePersonasToStorage(updatedPersonas);
    
    // If the active persona was deleted, select the first available one
    if (personaId === activePersonaId && updatedPersonas.length > 0) {
      selectPersona(updatedPersonas[0]);
    }
  };
  
  // Select a persona
  const selectPersona = (persona: UserInfo) => {
    onPersonaSelect(persona);
    localStorage.setItem('active_persona_id', persona.id);
    
    // Also update the individual fields for backward compatibility
    localStorage.setItem('user_name', persona.name);
    if (persona.avatar) localStorage.setItem('user_avatar', persona.avatar);
    if (persona.bio) localStorage.setItem('user_bio', persona.bio);
  };
  
  // Save a persona (new or edited)
  const savePersona = (personaData: UserInfo, editingPersona: UserInfo | null) => {
    let updatedPersonas: UserInfo[];
    
    if (editingPersona) {
      // Editing existing persona
      updatedPersonas = personas.map(p => 
        p.id === editingPersona.id ? { ...personaData, id: editingPersona.id } : p
      );
      setPersonas(updatedPersonas);
      
      // If editing the active persona, update the selected one
      if (editingPersona.id === activePersonaId) {
        selectPersona({ ...personaData, id: editingPersona.id });
      }
    } else {
      // Creating new persona
      const newPersona = {
        ...personaData,
        id: `persona-${Date.now()}`
      };
      
      updatedPersonas = [...personas, newPersona];
      setPersonas(updatedPersonas);
      
      // Select the newly created persona
      selectPersona(newPersona);
    }
    
    savePersonasToStorage(updatedPersonas);
  };
  
  // Find the active persona
  const activePersona = personas.find(p => p.id === activePersonaId) || personas[0];
  
  return {
    personas,
    activePersona,
    loadPersonas,
    savePersonas: savePersonasToStorage,
    deletePersona,
    selectPersona,
    savePersona,
  };
};
