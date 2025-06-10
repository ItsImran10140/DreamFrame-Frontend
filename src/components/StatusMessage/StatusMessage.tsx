import React from "react";

interface StatusMessageProps {
  message: string | null;
  className?: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({
  message,
  className = "fixed top-4 right-4 z-50",
}) => {
  if (!message) return null;

  return (
    <div
      className={`${className} bg-zinc-800 text-zinc-400 px-4 py-2 rounded-md shadow-lg animate-fade-in-out`}
    >
      {message}
    </div>
  );
};

export default StatusMessage;
