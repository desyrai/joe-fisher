
export const processInstructions = (text: string) => {
  const instructionRegex = /\(\((.*?)\)\)/g;
  const instructions: string[] = [];
  let visibleText = text;
  
  // Extract instructions
  let match;
  while ((match = instructionRegex.exec(text)) !== null) {
    instructions.push(match[1].trim());
  }
  
  // Remove instructions from visible text
  visibleText = visibleText.replace(instructionRegex, "").trim();
  
  return {
    visibleText,
    instructions: instructions.length > 0 ? instructions.join(". ") : "",
  };
};
