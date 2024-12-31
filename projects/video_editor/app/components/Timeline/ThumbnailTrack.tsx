import React from "react";
import { Thumbnail } from "../../types/video-editor.types";

interface ThumbnailTrackProps {
  thumbnails: Thumbnail[];
}

export const ThumbnailTrack: React.FC<ThumbnailTrackProps> = ({
  thumbnails,
}) => {
  return (
    <div className="h-20 overflow-hidden">
      <div className="flex">
        {thumbnails.map((thumbnail) => (
          <img
            key={thumbnail.time}
            src={thumbnail.url}
            alt={`Thumbnail at ${thumbnail.time}`}
            className="h-20 object-cover"
          />
        ))}
      </div>
    </div>
  );
};
