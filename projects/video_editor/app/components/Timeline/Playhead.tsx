import React, { useEffect, useRef } from "react";

interface PlayheadProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
}

export const Playhead: React.FC<PlayheadProps> = ({
  currentTime,
  duration,
  isPlaying,
}) => {
  const lastFrameTimeRef = useRef<number>(undefined);
  const rafRef = useRef<number>(undefined);
  const lastTimeRef = useRef(currentTime);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 100);
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    lastTimeRef.current = currentTime;
  }, [currentTime]);

  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      lastFrameTimeRef.current = undefined;
      return;
    }

    const updatePlayheadPosition = (timestamp: number) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp;
      }

      const deltaTime = timestamp - lastFrameTimeRef.current;
      lastFrameTimeRef.current = timestamp;

      lastTimeRef.current = Math.min(
        lastTimeRef.current + deltaTime / 1000,
        duration
      );

      rafRef.current = requestAnimationFrame(updatePlayheadPosition);
    };

    rafRef.current = requestAnimationFrame(updatePlayheadPosition);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isPlaying, duration]);

  const percentage = (currentTime / duration) * 100;

  return (
    <div
      className="absolute top-0 bottom-0 pointer-events-none"
      style={{ left: `${percentage}%` }}
    >
      {/* Main playhead line */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-yellow-500 shadow-lg" />

      {/* Top handle */}
      <div className="absolute -left-1.5 -top-1 w-3 h-3 bg-yellow-500 rounded-full shadow-md" />

      {/* Time indicator */}
      <div className="absolute -left-8 -top-8 bg-yellow-500 px-2 py-1 rounded text-xs text-white shadow-lg whitespace-nowrap">
        {formatTime(currentTime)}
      </div>
    </div>
  );
};

export default Playhead;
