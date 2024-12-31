import React, { useEffect, useRef } from "react";
import { VIDEO_EDITOR_CONFIG } from "../config/videoEditor.config";
import { Segment } from "../types/video-editor.types";
import { useVideoEditorStore } from "../store/videoEditorStore";

interface VideoPreviewProps {
  onTimeUpdate?: () => void;
  segments: Segment[];
}

const VideoPreview = React.forwardRef<HTMLVideoElement, VideoPreviewProps>(
  ({ onTimeUpdate, segments }, ref) => {
    const videoUrl = useVideoEditorStore((state) => state.videoUrl);
    const currentTime = useVideoEditorStore(
      (state) => state.videoState.currentTime
    );
    const setCurrentTime = useVideoEditorStore((state) => state.setCurrentTime);
    const lastTimeRef = useRef<number>(currentTime);

    // Handle external time updates (e.g., from timeline clicks)
    useEffect(() => {
      const video = ref as React.RefObject<HTMLVideoElement>;
      if (!video.current) return;

      // Only update video time if it's significantly different
      if (
        Math.abs(video.current.currentTime - currentTime) >
        VIDEO_EDITOR_CONFIG.TIME_UPDATE_THRESHOLD
      ) {
        video.current.currentTime = currentTime;
        lastTimeRef.current = currentTime;
      }
    }, [currentTime, ref]);

    // tirgger timeupdate to be updated more frequently
    // requestAnimationFrame
    useEffect(() => {
      const interval = setInterval(() => {
        const video = ref as React.RefObject<HTMLVideoElement>;
        if (!video.current) return;

        video.current.currentTime;
      }, 10);
      return () => clearInterval(interval);
    }, []);

    useEffect(() => {
      const video = ref as React.RefObject<HTMLVideoElement>;
      if (!video.current) return;

      const handleTimeUpdate = () => {
        if (!video.current) return;

        const videoTime = video.current.currentTime;

        // Handle disabled segments
        const disabledSegment = segments.find(
          (segment) =>
            !segment.enabled &&
            videoTime >= segment.start &&
            videoTime < segment.end
        );

        if (disabledSegment) {
          // Skip to end of disabled segment
          const newTime = disabledSegment.end;
          video.current.currentTime = newTime;
          setCurrentTime(newTime);
          lastTimeRef.current = newTime;
        } else {
          // Only update store if time has changed significantly
          if (Math.abs(videoTime - lastTimeRef.current) > 0.1) {
            setCurrentTime(videoTime);
            lastTimeRef.current = videoTime;
          }
        }

        onTimeUpdate?.();
      };

      const handleSeeked = () => {
        if (!video.current) return;
        lastTimeRef.current = video.current.currentTime;
      };

      // video.current.addEventListener("timeupdate", handleTimeUpdate);
      video.current.addEventListener("seeked", handleSeeked);
      const interval = setInterval(handleTimeUpdate, 10);

      return () => {
        video.current?.removeEventListener("seeked", handleSeeked);
        clearInterval(interval);
      };
    }, [ref, segments, onTimeUpdate, setCurrentTime]);

    return (
      <video
        ref={ref}
        className="w-full mb-4 rounded-lg shadow-lg"
        src={videoUrl || undefined}
      />
    );
  }
);

VideoPreview.displayName = "VideoPreview";

export default VideoPreview;
