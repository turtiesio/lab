import React, { useEffect, useRef, useState } from "react";

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
  const [smoothTime, setSmoothTime] = useState(currentTime);
  const rafRef = useRef<number>();
  const lastUpdateRef = useRef<number>();

  useEffect(() => {
    if (isPlaying) {
      const animate = (timestamp: number) => {
        if (!lastUpdateRef.current) {
          lastUpdateRef.current = timestamp;
        }

        const deltaTime = timestamp - lastUpdateRef.current;
        lastUpdateRef.current = timestamp;

        setSmoothTime((prevTime) => {
          // Calculate new time based on actual elapsed time
          const newTime = prevTime + deltaTime / 1000;
          // Ensure we don't exceed currentTime from props
          return Math.min(newTime, currentTime);
        });

        rafRef.current = requestAnimationFrame(animate);
      };

      rafRef.current = requestAnimationFrame(animate);

      return () => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      };
    } else {
      // When not playing, immediately update to current time
      setSmoothTime(currentTime);
      lastUpdateRef.current = undefined;
    }
  }, [isPlaying, currentTime]);

  // Reset smooth time when currentTime changes significantly
  useEffect(() => {
    if (Math.abs(smoothTime - currentTime) > 0.5) {
      setSmoothTime(currentTime);
    }
  }, [currentTime]);

  const percentage = (smoothTime / duration) * 100;

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
        {formatTime(smoothTime)}
      </div>
    </div>
  );
};

// Helper function to format time as MM:SS.ms
const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const milliseconds = Math.floor((time % 1) * 100);

  return `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds
    .toString()
    .padStart(2, "0")}`;
};

export default Playhead;
