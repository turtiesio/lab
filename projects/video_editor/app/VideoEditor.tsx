// VideoEditor.tsx
"use client";
import React, { useRef, useState, useEffect } from "react";
import { useVideoProcessor } from "./hooks/useVideoProcessor";
import { useSegments } from "./hooks/useSegments";
import { Timeline } from "./components/Timeline/Timeline";
import { VideoControls } from "./components/Controls/VideoControls";
import { VideoEditorProvider } from "./context/VideoEditorContext";
import { VideoState, Segment } from "./types/video-editor.types";
import VideoPreview from "./components/VideoPreview";
import SegmentsList from "./components/SegmentsList";
import FileSelector from "@/app/components/FileSelector";

const VideoEditor: React.FC = () => {
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [selectedSegmentId, setSelectedSegmentId] = useState<number | null>(
    null
  );
  const videoRef = useRef<HTMLVideoElement>(
    null
  ) as React.RefObject<HTMLVideoElement>;

  const [videoState, setVideoState] = useState<VideoState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    zoom: 1,
  });

  const { thumbnails, waveformData, processVideoFile } =
    useVideoProcessor(videoRef);

  const { segments, addSegment, updateSegment, deleteSegment } = useSegments();

  // Initialize video element
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    video.addEventListener("loadedmetadata", () => {
      setVideoState((prev) => ({
        ...prev,
        duration: video.duration,
      }));
    });

    return () => {
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [videoSrc]);

  const handleFileSelect = async (file: File) => {
    setError(null);
    try {
      if (!videoRef.current) {
        throw new Error("Video element not initialized");
      }

      // Clear previous video
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }

      const videoURL = await processVideoFile(file);
      setVideoSrc(videoURL);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error processing video file";
      setError(errorMessage);
      console.error("Error processing video file:", err);
    }
  };

  const handleTogglePlay = () => {
    if (!videoRef.current) return;

    if (videoState.isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setVideoState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setVideoState((prev) => ({
      ...prev,
      currentTime: videoRef.current!.currentTime,
    }));
  };

  const handleSegmentAdd = (start: number, end: number) => {
    addSegment({
      start,
      end,
      enabled: true,
    });
  };

  const handleZoomChange = (zoom: number) => {
    setVideoState((prev) => ({ ...prev, zoom }));
  };

  return (
    <VideoEditorProvider>
      <div className="w-full max-w-6xl mx-auto p-4 bg-gray-100 rounded-lg">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <VideoPreview
          ref={videoRef}
          src={videoSrc}
          onTimeUpdate={handleTimeUpdate}
          segments={segments}
        />

        {!videoSrc ? (
          <FileSelector onFileSelect={handleFileSelect} />
        ) : (
          <>
            <VideoControls
              isPlaying={videoState.isPlaying}
              onPlayPause={handleTogglePlay}
              onZoomIn={() =>
                handleZoomChange(Math.min(videoState.zoom + 0.1, 2))
              }
              onZoomOut={() =>
                handleZoomChange(Math.max(videoState.zoom - 0.1, 0.5))
              }
            />
            <Timeline
              videoState={videoState}
              thumbnails={thumbnails}
              waveformData={waveformData}
              segments={segments}
              onTimeUpdate={handleTimeUpdate}
              onSegmentAdd={handleSegmentAdd}
              onSegmentUpdate={updateSegment}
              onSegmentDelete={deleteSegment}
              selectedSegmentId={selectedSegmentId}
              onSegmentSelect={setSelectedSegmentId}
              onTogglePlay={handleTogglePlay}
              onZoomChange={handleZoomChange}
              videoRef={videoRef}
            />
            <SegmentsList
              segments={segments}
              selectedId={selectedSegmentId}
              onDelete={deleteSegment}
              onUpdate={updateSegment}
            />
          </>
        )}
      </div>
    </VideoEditorProvider>
  );
};

export default VideoEditor;
