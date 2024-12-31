import { useState, useCallback } from "react";

export function useWhisperTranscription() {
  const [transcription, setTranscription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const transcribeAudio = useCallback(async (audioFile: File) => {
    setIsLoading(true);
    try {
      // Implementation will go here
      setTranscription("Transcription result");
    } catch (error) {
      console.error("Transcription failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    transcription,
    isLoading,
    transcribeAudio,
  };
}
