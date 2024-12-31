import React from "react";
import { Segment } from "../../types/video-editor.types";
import { ToggleLeft } from "lucide-react";

interface SegmentsTrackProps {
  segments: Segment[];
  duration: number;
  selectedId: number | null;
  onSegmentDelete: (id: number) => void;
  onSegmentUpdate: (id: number, updates: Partial<Segment>) => void;
}

export const SegmentsTrack: React.FC<SegmentsTrackProps> = ({
  segments,
  duration,
  selectedId,
  onSegmentDelete,
  onSegmentUpdate,
}) => {
  return (
    <div className="h-full relative">
      {segments.map((segment) => (
        <div
          key={segment.id}
          data-segment-id={segment.id}
          className={`absolute border group ${
            segment.id === selectedId
              ? segment.enabled
                ? "bg-blue-500/70 border-blue-600"
                : "bg-gray-500/70 border-gray-600"
              : segment.enabled
              ? "bg-blue-500/50 border-blue-500"
              : "bg-gray-500/50 border-gray-500"
          } cursor-move`}
          style={{
            left: `${(segment.start / duration) * 100}%`,
            width: `${((segment.end - segment.start) / duration) * 100}%`,
            height: "100%",
          }}
        >
          {/* Resize handles - only shown when segment is selected */}
          {segment.id === selectedId && (
            <>
              <div className="resize-handle-left absolute left-0 top-0 bottom-0 w-1 bg-blue-600 cursor-ew-resize hover:bg-blue-700" />
              <div className="resize-handle-right absolute right-0 top-0 bottom-0 w-1 bg-blue-600 cursor-ew-resize hover:bg-blue-700" />
              <button
                className="absolute right-8 top-1/4 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-gray-700 text-white rounded-full p-1 hover:bg-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onSegmentUpdate(segment.id, { enabled: !segment.enabled });
                }}
              >
                <ToggleLeft size={14} />
              </button>
              <button
                className="absolute right-2 top-1/4 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onSegmentDelete(segment.id);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};
