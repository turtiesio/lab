import React from "react";
import { Play, Pause, ZoomIn, ZoomOut } from "lucide-react";

interface VideoControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const VideoControls: React.FC<VideoControlsProps> = ({
  isPlaying,
  onPlayPause,
  onZoomIn,
  onZoomOut,
}) => {
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={onPlayPause}
        className="p-2 hover:bg-gray-700 rounded-full text-white"
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>
      <div className="ml-auto flex items-center space-x-2">
        <button
          onClick={onZoomOut}
          className="p-2 hover:bg-gray-700 rounded-full text-white"
        >
          <ZoomOut size={20} />
        </button>
        <button
          onClick={onZoomIn}
          className="p-2 hover:bg-gray-700 rounded-full text-white"
        >
          <ZoomIn size={20} />
        </button>
      </div>
    </div>
  );
};
