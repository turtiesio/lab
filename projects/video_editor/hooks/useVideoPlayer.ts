import { useState, useCallback } from "react";

export function useVideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  return {
    isPlaying,
    currentTime,
    togglePlay,
    setCurrentTime,
  };
}
