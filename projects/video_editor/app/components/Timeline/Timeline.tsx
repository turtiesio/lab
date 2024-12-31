import React, { useRef, useEffect, MouseEvent, useState } from "react";
import { VIDEO_EDITOR_CONFIG } from "../../config/videoEditor.config";
import { ThumbnailTrack } from "./ThumbnailTrack";
import { WaveformTrack } from "./WaveformTrack";
import { SegmentsTrack } from "./SegmentsTrack";
import { Playhead } from "./Playhead";
import { useVideoEditorStore } from "../../store/videoEditorStore";

export const Timeline: React.FC = () => {
  const {
    videoState,
    segments,
    selectedSegmentId,
    thumbnails,
    waveformData,
    setCurrentTime,
    updateSegment,
    deleteSegment,
    selectSegment,
    addSegment,
    togglePlay,
    setZoom,
    saveState,
  } = useVideoEditorStore();

  // Add state for drag selection box
  const [dragBox, setDragBox] = useState<{
    startX: number;
    currentX: number;
  } | null>(null);

  const timelineRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartTimeRef = useRef(0);
  const dragStartXRef = useRef(0);
  const isResizingRef = useRef<"left" | "right" | null>(null);
  const activeSegmentRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getTimeFromX = (x: number): number => {
    if (!timelineRef.current) return 0;
    const rect = timelineRef.current.getBoundingClientRect();
    const scrollLeft = scrollContainerRef.current?.scrollLeft || 0;

    const adjustedX = x + scrollLeft - rect.left;
    const percentage = adjustedX / rect.width;

    return Math.max(
      0,
      Math.min(videoState.duration, percentage * videoState.duration)
    );
  };

  const handleTimelineClick = (e: MouseEvent) => {
    if (isDraggingRef.current || isResizingRef.current) {
      return;
    }

    const target = e.target as HTMLElement;
    if (
      target.closest("[data-segment-id]") ||
      target.classList.contains("resize-handle-left") ||
      target.classList.contains("resize-handle-right")
    ) {
      return;
    }

    const clickedTime = getTimeFromX(e.clientX);
    setCurrentTime(clickedTime);
  };

  const handleMouseDown = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const segmentEl = target.closest("[data-segment-id]");

    if (segmentEl) {
      const segmentId = parseInt(
        segmentEl.getAttribute("data-segment-id") || ""
      );
      activeSegmentRef.current = segmentId;
      selectSegment(segmentId);

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
      // Add cursor styling
      document.body.style.cursor = isResizingRef.current
        ? "ew-resize"
        : "grabbing";
    } else {
      selectSegment(null);
      isDraggingRef.current = true;
      // Just store the start position, don't show drag box yet
      dragStartXRef.current = e.clientX;
      document.body.style.cursor = "crosshair";
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!timelineRef.current) return;

    const currentTime = getTimeFromX(e.clientX);

    // Handle segment resizing
    if (isResizingRef.current && activeSegmentRef.current !== null) {
      const segment = segments.find((s) => s.id === activeSegmentRef.current);
      if (!segment) return;

      if (isResizingRef.current === "left") {
        updateSegment(activeSegmentRef.current, {
          start: Math.min(
            currentTime,
            segment.end - VIDEO_EDITOR_CONFIG.MIN_SEGMENT_DURATION
          ),
        });
      } else {
        updateSegment(activeSegmentRef.current, {
          end: Math.max(
            currentTime,
            segment.start + VIDEO_EDITOR_CONFIG.MIN_SEGMENT_DURATION
          ),
        });
      }
      saveState();

      // Handle segment dragging
    } else if (isDraggingRef.current) {
      if (activeSegmentRef.current !== null) {
        const segment = segments.find((s) => s.id === activeSegmentRef.current);
        if (!segment) return;

        const dragDelta =
          getTimeFromX(e.clientX) - getTimeFromX(dragStartXRef.current);
        const newStart = Math.max(0, dragStartTimeRef.current + dragDelta);
        const segmentDuration = segment.end - segment.start;
        const newEnd = Math.min(
          videoState.duration,
          newStart + segmentDuration
        );

        updateSegment(activeSegmentRef.current, {
          start: newStart,
          end: newEnd,
        });
      } else {
        const dragDistance = Math.abs(e.clientX - dragStartXRef.current);

        if (dragDistance >= VIDEO_EDITOR_CONFIG.MIN_DRAG_THRESHOLD) {
          setDragBox({
            startX: dragStartXRef.current,
            currentX: e.clientX,
          });
          dragStartTimeRef.current = getTimeFromX(dragStartXRef.current);
        }
      }
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (isDraggingRef.current && !activeSegmentRef.current && dragBox) {
      const endTime = getTimeFromX(e.clientX);
      const startTime = dragStartTimeRef.current;
      if (
        Math.abs(endTime - startTime) > VIDEO_EDITOR_CONFIG.MIN_SEGMENT_DURATION
      ) {
        addSegment({
          start: Math.min(startTime, endTime),
          end: Math.max(startTime, endTime),
          enabled: true,
        });
        saveState();
      }
    }

    // Reset all states
    isDraggingRef.current = false;
    isResizingRef.current = null;
    activeSegmentRef.current = null;
    setDragBox(null);
    document.body.style.cursor = "default";
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
              onSegmentDelete={deleteSegment}
              onSegmentUpdate={updateSegment}
            />
          </div>

          {/* Drag selection box */}
          {dragBox && (
            <div
              className="absolute top-0 bottom-0 bg-blue-500/30 border border-blue-500"
              style={{
                left:
                  (timelineRef.current
                    ? Math.min(dragBox.startX, dragBox.currentX) -
                      timelineRef.current.getBoundingClientRect().left +
                      (scrollContainerRef.current?.scrollLeft || 0)
                    : 0) + "px",
                width: Math.abs(dragBox.currentX - dragBox.startX) + "px",
              }}
            />
          )}
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
