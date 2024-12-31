import { useState } from "react";
import { Segment } from "../types/video-editor.types";

export const useSegments = () => {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [selectedSegmentId, setSelectedSegmentId] = useState<number | null>(
    null
  );

  const addSegment = (newSegment: Omit<Segment, "id">) => {
    const segment = {
      ...newSegment,
      id: Date.now(),
    };
    setSegments((prev) => [...prev, segment]);
    return segment.id;
  };

  const updateSegment = (id: number, updates: Partial<Segment>) => {
    setSegments((prev) =>
      prev.map((seg) => (seg.id === id ? { ...seg, ...updates } : seg))
    );
  };

  const deleteSegment = (id: number) => {
    setSegments((prev) => prev.filter((seg) => seg.id !== id));
    if (selectedSegmentId === id) {
      setSelectedSegmentId(null);
    }
  };

  return {
    segments,
    selectedSegmentId,
    setSelectedSegmentId,
    addSegment,
    updateSegment,
    deleteSegment,
  };
};
