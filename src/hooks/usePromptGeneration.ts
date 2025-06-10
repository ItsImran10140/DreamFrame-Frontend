import { useState } from "react";
import { codeGenerationApi } from "../services/codeGenerationApi";

export const usePromptGeneration = () => {
  const [generatingCode, setGeneratingCode] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");

  const generateCode = async (promptText: string) => {
    if (!promptText.trim()) return null;

    try {
      setGeneratingCode(true);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("You must be logged in to generate code.");
      }

      const result = await codeGenerationApi.generateCode(promptText);
      setPrompt("");

      return result;
    } catch (err) {
      console.error("Failed to process prompt:", err);
      throw err;
    } finally {
      setGeneratingCode(false);
    }
  };

  return {
    generatingCode,
    prompt,
    setPrompt,
    generateCode,
  };
};
