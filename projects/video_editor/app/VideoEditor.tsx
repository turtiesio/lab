// VideoEditor.tsx
"use client";
import React, { useRef, useEffect } from "react";
import { useVideoEditorStore } from "./store/videoEditorStore";
import { useHotkeys } from "@/app/hooks/useHotkeys";
import { useVideoProcessor } from "./hooks/useVideoProcessor";
import { Timeline } from "./components/Timeline/Timeline";
import { VideoControls } from "./components/Controls/VideoControls";
import VideoPreview from "./components/VideoPreview";
import SegmentsList from "./components/SegmentsList";
import FileSelector from "./components/FileSelector";

const VideoEditor: React.FC = () => {
  const {
    videoState,
    segments,
    selectedSegmentId,
    thumbnails,
    waveformData,
    setVideoState,
    togglePlay,
    setCurrentTime,
    setZoom,
    addSegment,
    updateSegment,
    deleteSegment,
    selectSegment,
    setThumbnails,
    setWaveformData,
    undo,
    redo,
  } = useVideoEditorStore();

  const videoRef = useRef<HTMLVideoElement>(
    null
  ) as React.RefObject<HTMLVideoElement>;
  const { processVideoFile } = useVideoProcessor(videoRef);

  // Setup keyboard shortcuts
  useHotkeys({
    "mod+z": undo,
    "mod+shift+z": redo,
    space: togglePlay,
  });

  const handleTogglePlay = () => {
    if (!videoRef.current) return;

    if (videoState.isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    togglePlay();
  };

  // Sync video state with store
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    if (videoState.isPlaying) {
      video.play().catch(() => {
        // If play fails (e.g., not yet loaded), update store
        togglePlay();
      });
    } else {
      video.pause();
    }
  }, [videoState.isPlaying, togglePlay]);

  // Initialize video element
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    video.addEventListener("loadedmetadata", () => {
      setVideoState({ duration: video.duration });
    });

    return () => {
      if (videoRef.current?.src) {
        URL.revokeObjectURL(videoRef.current.src);
      }
    };
  }, [setVideoState]);

  const handleFileSelect = async (file: File) => {
    try {
      if (!videoRef.current) {
        throw new Error("Video element not initialized");
      }

      // Clear previous video
      if (videoRef.current.src) {
        URL.revokeObjectURL(videoRef.current.src);
      }

      const videoURL = await processVideoFile(file);
      videoRef.current.src = videoURL;
    } catch (err) {
      console.error("Error processing video file:", err);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleSegmentAdd = (start: number, end: number) => {
    addSegment({
      start,
      end,
      enabled: true,
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-gray-100 rounded-lg">
      <VideoPreview
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        segments={segments}
      />

      {!videoRef.current?.src ? (
        <FileSelector onFileSelect={handleFileSelect} />
      ) : (
        <>
          <VideoControls
            isPlaying={videoState.isPlaying}
            onPlayPause={togglePlay}
            onZoomIn={() => setZoom(Math.min(videoState.zoom + 0.1, 2))}
            onZoomOut={() => setZoom(Math.max(videoState.zoom - 0.1, 0.5))}
          />
          <Timeline />
          <SegmentsList
            segments={segments}
            selectedId={selectedSegmentId}
            onDelete={deleteSegment}
            onUpdate={updateSegment}
          />
        </>
      )}
    </div>
  );
};

export default VideoEditor;
