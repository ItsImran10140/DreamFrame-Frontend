/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from "react";
import { projectApi } from "../services/projectApi";
import type { Project } from "../types/projects";

export const useCodeExecution = () => {
  const [runningCode, setRunningCode] = useState<boolean>(false);
  const [responseLog, setResponseLog] = useState<string>("");
  const editorRef = useRef<any>(null);

  const executeCode = async (project: Project) => {
    if (!project) return;

    try {
      setRunningCode(true);
      setResponseLog("Starting code execution...\n");

      const response = await projectApi.executeCode(project.id, project.code);

      if (response?.data) {
        setResponseLog(
          (prev) => prev + JSON.stringify(response.data, null, 2) + "\n"
        );
      }

      // Wait for backend processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return response;
    } catch (err) {
      console.error("Failed to execute code:", err);
      setResponseLog(
        (prev) =>
          prev + "\nError: Failed to execute code. Please check your syntax.\n"
      );
      throw err;
    } finally {
      setRunningCode(false);
    }
  };

  const clearLog = () => {
    setResponseLog("");
  };

  const appendToLog = (message: string) => {
    setResponseLog((prev) => prev + message);
  };

  return {
    runningCode,
    responseLog,
    editorRef,
    executeCode,
    clearLog,
    appendToLog,
  };
};
