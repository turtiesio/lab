import React, { useEffect, useRef } from "react";
import { Segment } from "../types/video-editor.types";

interface VideoPreviewProps {
  src?: string;
  onTimeUpdate?: () => void;
  segments: Segment[];
}

const VideoPreview = React.forwardRef<HTMLVideoElement, VideoPreviewProps>(
  ({ src, onTimeUpdate, segments }, ref) => {
    const lastTimeRef = useRef<number>(0);

    useEffect(() => {
      const video = ref as React.RefObject<HTMLVideoElement>;
      if (!video.current) return;

      const handleTimeUpdate = () => {
        if (!video.current) return;

        const currentTime = video.current.currentTime;
        // Skip forward if we're in a disabled segment
        const disabledSegment = segments.find(
          (segment) =>
            !segment.enabled &&
            currentTime >= segment.start &&
            currentTime < segment.end
        );

        if (disabledSegment) {
          // Skip to the end of the current disabled segment
          video.current.currentTime = disabledSegment.end;
          lastTimeRef.current = disabledSegment.end;
        } else {
          // Check if we need to skip the next disabled segment
          const nextDisabledSegment = segments.find(
            (segment) =>
              !segment.enabled &&
              segment.start > currentTime &&
              segment.start - currentTime < 0.1 // Close to the start of next disabled segment
          );

          if (nextDisabledSegment) {
            video.current.currentTime = nextDisabledSegment.end;
            lastTimeRef.current = nextDisabledSegment.end;
          }
        }

        // Call the original onTimeUpdate callback
        onTimeUpdate?.();
      };

      video.current.addEventListener("timeupdate", handleTimeUpdate);
      return () => {
        video.current?.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }, [ref, segments, onTimeUpdate]);

    return (
      <video
        ref={ref}
        className="w-full mb-4 rounded-lg shadow-lg"
        src={src}
        onTimeUpdate={onTimeUpdate}
      />
    );
  }
);

VideoPreview.displayName = "VideoPreview";

export default VideoPreview;
