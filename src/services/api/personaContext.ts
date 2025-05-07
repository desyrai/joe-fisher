
export const getUserPersonaInfo = (): { userName: string; userBio: string } => {
  let userName = "You";
  let userBio = "";
  
  // Try to get the active persona from localStorage
  const activePersonaId = localStorage.getItem("active_persona_id");
  const savedPersonas = localStorage.getItem("user_personas");
  
  if (activePersonaId && savedPersonas) {
    try {
      const personas = JSON.parse(savedPersonas);
      const activePersona = personas.find((p: any) => p.id === activePersonaId);
      
      if (activePersona) {
        userName = activePersona.name || "You";
        userBio = activePersona.bio || "";
      }
    } catch (error) {
      console.error("Error parsing personas:", error);
      // Fallback to legacy storage
      userName = localStorage.getItem("user_name") || "You";
      userBio = localStorage.getItem("user_bio") || "";
    }
  } else {
    // Fallback to legacy storage
    userName = localStorage.getItem("user_name") || "You";
    userBio = localStorage.getItem("user_bio") || "";
  }
  
  return { userName, userBio };
};
