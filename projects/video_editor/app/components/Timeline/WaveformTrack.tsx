"use client";
import React, { useEffect } from "react";

interface WaveformTrackProps {
  data: number[];
}

export const WaveformTrack: React.FC<WaveformTrackProps> = ({ data }) => {
  // Ensure we have valid data
  const validData = data.map((value) =>
    isNaN(value) ? 0 : Math.max(0, Math.min(1, value))
  );

  return (
    <div className="h-12 bg-gray-200 relative">
      <svg
        viewBox={`0 0 ${validData.length} 100`}
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        {validData.map((value, index) => {
          // Calculate height ensuring it's always a valid number
          const height = Math.max(1, value * 50); // Minimum height of 1
          const y = 50 - height / 2;

          return (
            <rect
              key={index}
              x={index}
              y={y}
              width="1"
              height={height}
              className="fill-gray-600"
            />
          );
        })}
      </svg>
    </div>
  );
};
