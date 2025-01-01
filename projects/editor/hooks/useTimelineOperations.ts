import { useCallback } from 'react';
import { useEditorStore } from '../lib/editor/store';
import { Timecode } from '../lib/editor/types/editor';
import {
  AddContentCommand,
  AddTrackCommand,
  SplitContentCommand,
} from '../lib/editor/commands';

export const useTimelineOperations = () => {
  const { execute, state } = useEditorStore();

  const addTrack = useCallback(() => {
    const newTrack = {
      id: `track-${Date.now()}`,
      name: `Track ${state.tracks.length + 1}`,
      contents: [],
    };
    execute(new AddTrackCommand(newTrack));
  }, [execute, state]);

  const addContent = useCallback(
    (trackId: string, content: TrackContent) => {
      execute(new AddContentCommand(trackId, content));
    },
    [execute]
  );

  const splitContent = useCallback(
    (trackId: string, contentId: string, splitPoint: Timecode) => {
      execute(new SplitContentCommand(trackId, contentId, splitPoint));
    },
    [execute]
  );

  return {
    addTrack,
    addContent,
    splitContent,
  };
};

export const usePlayback = () => {
  const { setPlaying, setCurrentTime, currentTime, isPlaying } =
    useEditorStore();

  const play = useCallback(() => {
    setPlaying(true);
    // Start playback loop
    const startPlayback = () => {
      if (isPlaying) {
        setCurrentTime(currentTime + 1 / 30); // Assuming 30fps
        requestAnimationFrame(startPlayback);
      }
    };
    requestAnimationFrame(startPlayback);
  }, [setPlaying, setCurrentTime, currentTime, isPlaying]);

  const pause = useCallback(() => {
    setPlaying(false);
  }, [setPlaying]);

  const seek = useCallback(
    (time: number) => {
      setCurrentTime(time);
    },
    [setCurrentTime]
  );

  return {
    play,
    pause,
    seek,
  };
};
