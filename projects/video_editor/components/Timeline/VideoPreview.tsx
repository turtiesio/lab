import { useEffect, useRef } from "react";

interface VideoPreviewProps {
  videoUrl: string;
  currentTime: number;
  isPlaying: boolean;
  onTimeUpdate: (time: number) => void;
}

export default function VideoPreview({
  videoUrl,
  currentTime,
  isPlaying,
  onTimeUpdate,
}: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = currentTime;
  }, [currentTime]);

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full"
        onTimeUpdate={(e) => onTimeUpdate(e.currentTarget.currentTime)}
      />
    </div>
  );
}
