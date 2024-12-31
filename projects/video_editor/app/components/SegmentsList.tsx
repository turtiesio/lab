import React from "react";
import { ToggleLeft } from "lucide-react";
import { Segment } from "../types/video-editor.types";

interface SegmentsListProps {
  segments: Segment[];
  selectedId: number | null;
  onDelete: (id: number) => void;
  onUpdate: (id: number, updates: Partial<Segment>) => void;
}

const SegmentsList: React.FC<SegmentsListProps> = ({
  segments,
  selectedId,
  onDelete,
  onUpdate,
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 100);
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Segments</h3>
      <div className="space-y-2">
        {segments.map((segment) => (
          <div
            key={segment.id}
            className={`p-2 rounded ${
              segment.id === selectedId
                ? "bg-blue-100"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="font-medium">
                  {formatTime(segment.start)} - {formatTime(segment.end)}
                </span>
                <button
                  onClick={() =>
                    onUpdate(segment.id, { enabled: !segment.enabled })
                  }
                  className={`flex items-center space-x-1 px-2 py-1 rounded ${
                    segment.enabled
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <ToggleLeft size={16} />
                  <span className="text-sm">
                    {segment.enabled ? "Enabled" : "Disabled"}
                  </span>
                </button>
              </div>
              <button
                onClick={() => onDelete(segment.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SegmentsList;
