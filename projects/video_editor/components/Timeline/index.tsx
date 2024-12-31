import { useRef } from "react";
import Waveform from "./Waveform";
import VideoPreview from "./VideoPreview";
import Cursor from "./Cursor";

export interface TimelineProps {
  duration: number;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  waveformData?: Float32Array;
  segments: {
    start: number;
    end: number;
    type: "silence" | "speech";
  }[];
  videoUrl: string;
  isPlaying: boolean;
}

export default function Timeline({
  duration,
  currentTime,
  onTimeUpdate,
  waveformData,
  segments,
  videoUrl,
  isPlaying,
}: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col space-y-4 relative" ref={timelineRef}>
      <VideoPreview
        videoUrl={videoUrl}
        currentTime={currentTime}
        isPlaying={isPlaying}
        onTimeUpdate={onTimeUpdate}
      />
      <div className="relative w-full h-20 bg-gray-800 rounded-lg overflow-hidden">
        <Waveform data={waveformData} />
        {segments.map((segment, index) => (
          <div
            key={index}
            className={`absolute h-full ${
              segment.type === "silence" ? "bg-red-500/30" : "bg-green-500/30"
            }`}
            style={{
              left: `${(segment.start / duration) * 100}%`,
              width: `${((segment.end - segment.start) / duration) * 100}%`,
            }}
          />
        ))}
        <Cursor
          position={currentTime / duration}
          onDrag={onTimeUpdate}
          duration={duration}
        />
      </div>
    </div>
  );
}
