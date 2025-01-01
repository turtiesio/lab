import React from 'react';
import { useEditorStore } from '../lib/editor/store';
import { AddContentCommand, AddTrackCommand } from '../lib/editor/commands';
import { timecodeDiff } from '../lib/editor/timecode-helper';
import { Track, TrackContent, VideoContent } from '../lib/editor/types/editor';

export const Timeline: React.FC = () => {
  const { state, execute, currentTime, zoom } = useEditorStore();
  const tracks = state.tracks;

  const handleAddTrack = () => {
    const newTrack: Track = {
      id: `track-${Date.now()}`,
      name: `Track ${tracks.length + 1}`,
      contents: [],
    };
    execute(new AddTrackCommand(newTrack));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Timeline</h2>
        <button
          onClick={handleAddTrack}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Add Track
        </button>
      </div>
      <div className="flex flex-col gap-1">
        {tracks.map((track: Track) => (
          <TrackComponent key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
};

interface TrackComponentProps {
  track: Track;
}

const TrackComponent: React.FC<TrackComponentProps> = ({ track }) => {
  const { execute } = useEditorStore();

  const handleAddContent = () => {
    const newContent: VideoContent = {
      id: `content-${Date.now()}`,
      sourceId: 'video-source-1',
      type: 'video',
      inPoint: { hours: 0, minutes: 0, seconds: 0, frames: 0, fps: 30 },
      outPoint: { hours: 0, minutes: 0, seconds: 0, frames: 0, fps: 30 },
      opacity: 1,
    };
    execute(new AddContentCommand(track.id, newContent));
  };

  return (
    <div className="flex gap-2 items-center p-2 bg-gray-100 rounded">
      <div className="w-32">{track.name}</div>
      <div className="flex-1 relative min-h-[50px] bg-gray-200">
        {track.contents.map((content) => (
          <ContentComponent key={content.id} content={content} />
        ))}
      </div>
      <button
        onClick={handleAddContent}
        className="px-2 py-1 bg-green-500 text-white rounded text-sm"
      >
        Add Clip
      </button>
    </div>
  );
};

interface ContentComponentProps {
  content: TrackContent;
}

const ContentComponent: React.FC<ContentComponentProps> = ({ content }) => {
  const duration = timecodeDiff(content.inPoint, content.outPoint) * 100; // Scale for display

  return (
    <div
      className="absolute top-0 h-full bg-blue-300 rounded"
      style={{
        left: `${content.inPoint.seconds * 100}px`,
        width: `${duration}px`,
      }}
    >
      <div className="px-2 truncate text-sm">{content.id}</div>
    </div>
  );
};

export const Controls: React.FC = () => {
  const { undo, redo, isPlaying, setPlaying } = useEditorStore();

  return (
    <div className="flex gap-2 p-2 bg-gray-100">
      <button
        onClick={undo}
        className="px-3 py-1 bg-gray-500 text-white rounded"
      >
        Undo
      </button>
      <button
        onClick={redo}
        className="px-3 py-1 bg-gray-500 text-white rounded"
      >
        Redo
      </button>
      <button
        onClick={() => setPlaying(!isPlaying)}
        className="px-3 py-1 bg-blue-500 text-white rounded"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
};

export const Editor: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Controls />
      <Timeline />
    </div>
  );
};
