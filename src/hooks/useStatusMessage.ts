import { useState, useCallback } from "react";

export const useStatusMessage = () => {
  const [message, setMessage] = useState<string | null>(null);

  const showMessage = useCallback((text: string, duration: number = 3000) => {
    setMessage(text);
    setTimeout(() => setMessage(null), duration);
  }, []);

  const clearMessage = useCallback(() => {
    setMessage(null);
  }, []);

  return {
    message,
    showMessage,
    clearMessage,
  };
};
