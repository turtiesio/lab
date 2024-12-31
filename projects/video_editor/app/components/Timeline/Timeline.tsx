import React, { useRef, useEffect, MouseEvent } from "react";
import { ThumbnailTrack } from "./ThumbnailTrack";
import { WaveformTrack } from "./WaveformTrack";
import { SegmentsTrack } from "./SegmentsTrack";
import { Playhead } from "./Playhead";
import { VideoState, Segment, Thumbnail } from "../../types/video-editor.types";

interface TimelineProps {
  videoState: VideoState;
  thumbnails: Thumbnail[];
  waveformData: number[];
  segments: Segment[];
  onTimeUpdate: (time: number) => void;
  onSegmentAdd: (start: number, end: number) => void;
  onSegmentUpdate: (id: number, updates: Partial<Segment>) => void;
  onSegmentDelete: (id: number) => void;
  selectedSegmentId: number | null;
  onSegmentSelect: (id: number | null) => void;
  onTogglePlay: () => void;
  onZoomChange: (zoom: number) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const Timeline: React.FC<TimelineProps> = ({
  videoState,
  thumbnails,
  waveformData,
  segments,
  onTimeUpdate,
  onSegmentAdd,
  onSegmentUpdate,
  onSegmentDelete,
  selectedSegmentId,
  onSegmentSelect,
  onTogglePlay,
  onZoomChange,
  videoRef,
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartTimeRef = useRef(0);
  const dragStartXRef = useRef(0);
  const isResizingRef = useRef<"left" | "right" | null>(null);
  const activeSegmentRef = useRef<number | null>(null);

  // Add scroll container ref
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        onTogglePlay();
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        onZoomChange(Math.min(videoState.zoom + 0.1, 2));
      } else if (e.key === "-") {
        e.preventDefault();
        onZoomChange(Math.max(videoState.zoom - 0.1, 0.5));
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [onTogglePlay, onZoomChange, videoState.zoom]);

  const getTimeFromX = (x: number): number => {
    if (!timelineRef.current) return 0;
    const rect = timelineRef.current.getBoundingClientRect();
    const scrollLeft = scrollContainerRef.current?.scrollLeft || 0;

    // Adjust x position based on scroll
    const adjustedX = x + scrollLeft - rect.left;
    const percentage = adjustedX / rect.width;

    return Math.max(
      0,
      Math.min(videoState.duration, percentage * videoState.duration)
    );
  };

  const handleTimelineClick = (e: MouseEvent) => {
    // Prevent click handling if we were dragging
    if (isDraggingRef.current || isResizingRef.current) {
      return;
    }

    const target = e.target as HTMLElement;
    // Check if we clicked on a segment or its controls
    if (
      target.closest("[data-segment-id]") ||
      target.classList.contains("resize-handle-left") ||
      target.classList.contains("resize-handle-right")
    ) {
      return;
    }

    const time = getTimeFromX(e.clientX);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      onTimeUpdate(time);
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const segmentEl = target.closest("[data-segment-id]");

    if (segmentEl) {
      const segmentId = parseInt(
        segmentEl.getAttribute("data-segment-id") || ""
      );
      activeSegmentRef.current = segmentId;
      onSegmentSelect(segmentId);

      if (target.classList.contains("resize-handle-left")) {
        isResizingRef.current = "left";
      } else if (target.classList.contains("resize-handle-right")) {
        isResizingRef.current = "right";
      } else {
        isDraggingRef.current = true;
        dragStartXRef.current = e.clientX;
        dragStartTimeRef.current =
          segments.find((s) => s.id === segmentId)?.start || 0;
      }
    } else {
      onSegmentSelect(null);
      isDraggingRef.current = true;
      dragStartXRef.current = e.clientX;
      dragStartTimeRef.current = getTimeFromX(e.clientX);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!timelineRef.current) return;

    const currentTime = getTimeFromX(e.clientX);

    if (isResizingRef.current && activeSegmentRef.current !== null) {
      const segment = segments.find((s) => s.id === activeSegmentRef.current);
      if (!segment) return;

      if (isResizingRef.current === "left") {
        onSegmentUpdate(activeSegmentRef.current, {
          start: Math.min(currentTime, segment.end - 0.1),
        });
      } else {
        onSegmentUpdate(activeSegmentRef.current, {
          end: Math.max(currentTime, segment.start + 0.1),
        });
      }
    } else if (isDraggingRef.current && activeSegmentRef.current !== null) {
      const segment = segments.find((s) => s.id === activeSegmentRef.current);
      if (!segment) return;

      const delta =
        getTimeFromX(e.clientX) - getTimeFromX(dragStartXRef.current);
      const newStart = Math.max(0, dragStartTimeRef.current + delta);
      const duration = segment.end - segment.start;
      const newEnd = Math.min(videoState.duration, newStart + duration);

      onSegmentUpdate(activeSegmentRef.current, {
        start: newStart,
        end: newEnd,
      });
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (isDraggingRef.current && !activeSegmentRef.current) {
      const endTime = getTimeFromX(e.clientX);
      const startTime = dragStartTimeRef.current;
      if (Math.abs(endTime - startTime) > 0.1) {
        onSegmentAdd(
          Math.min(startTime, endTime),
          Math.max(startTime, endTime)
        );
      }
    }

    isDraggingRef.current = false;
    isResizingRef.current = null;
    activeSegmentRef.current = null;
  };

  return (
    <div
      ref={scrollContainerRef}
      className="overflow-x-auto relative"
      style={{ width: "100%" }}
    >
      <div
        ref={timelineRef}
        className="relative cursor-pointer"
        style={{ width: `${100 * videoState.zoom}%` }}
        onClick={handleTimelineClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="relative">
          <div className="select-none pointer-events-none">
            <ThumbnailTrack thumbnails={thumbnails} />
            <WaveformTrack data={waveformData} />
          </div>

          <div className="absolute inset-0">
            <SegmentsTrack
              segments={segments}
              duration={videoState.duration}
              selectedId={selectedSegmentId}
              onSegmentDelete={onSegmentDelete}
              onSegmentUpdate={onSegmentUpdate}
            />
          </div>
        </div>
        <Playhead
          currentTime={videoState.currentTime}
          duration={videoState.duration}
          isPlaying={videoState.isPlaying}
        />
      </div>
    </div>
  );
};

export default Timeline;
