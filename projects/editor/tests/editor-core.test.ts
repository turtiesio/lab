import { EditorCore } from '@/lib/editor/core';
import {
  AddTrackCommand,
  AddContentCommand,
  SplitContentCommand,
} from '@/lib/editor/commands';
import {
  EditorState,
  Track,
  TrackContent,
  Timecode,
} from '@/lib/editor/types/editor';
import { createTimecode, timecodeDiff } from '@/lib/editor/timecode-helper';

describe('EditorCore', () => {
  let initialState: EditorState;
  let editor: EditorCore;

  beforeEach(() => {
    initialState = {
      tracks: [],
      selectedTrackId: null,
      selectedContentId: null,
    };
    editor = new EditorCore(initialState);
  });

  test('should add track', () => {
    const track: Track = {
      id: 'track-1',
      name: 'Track 1',
      contents: [],
    };

    editor.execute(new AddTrackCommand(track));
    expect(editor.getState().tracks).toHaveLength(1);
    expect(editor.getState().tracks[0]).toEqual(track);
  });

  test('should add content to track', () => {
    const track: Track = {
      id: 'track-1',
      name: 'Track 1',
      contents: [],
    };
    const content: TrackContent = {
      id: 'content-1',
      sourceId: 'video-source-1',
      type: 'video',
      inPoint: { hours: 0, minutes: 0, seconds: 0, frames: 0, fps: 24 },
      outPoint: { hours: 0, minutes: 0, seconds: 0, frames: 0, fps: 24 },
      opacity: 1,
    };

    editor.execute(new AddTrackCommand(track));
    editor.execute(new AddContentCommand(track.id, content));

    const updatedTrack = editor.getState().tracks[0];
    expect(updatedTrack.contents).toHaveLength(1);
    expect(updatedTrack.contents[0]).toEqual(content);
  });

  test('should split content correctly', () => {
    const track: Track = {
      id: 'track-1',
      name: 'Track 1',
      contents: [],
    };
    const content: TrackContent = {
      id: 'content-1',
      sourceId: 'video-source-1',
      type: 'video',
      inPoint: createTimecode(0, 0, 0, 0, 30),
      outPoint: createTimecode(0, 0, 10, 0, 30),
      opacity: 1,
    };

    editor.execute(new AddTrackCommand(track));
    editor.execute(new AddContentCommand(track.id, content));

    const splitPoint = createTimecode(0, 0, 5, 0, 30);
    editor.execute(new SplitContentCommand(track.id, content.id, splitPoint));

    const updatedTrack = editor.getState().tracks[0];
    expect(updatedTrack.contents).toHaveLength(2);

    const firstPart = updatedTrack.contents[0];
    const secondPart = updatedTrack.contents[1];

    expect(timecodeDiff(firstPart.outPoint, splitPoint)).toBe(0);
    expect(timecodeDiff(secondPart.inPoint, splitPoint)).toBe(0);
  });

  test('should not split content if split point is outside content bounds', () => {
    const track: Track = {
      id: 'track-1',
      name: 'Track 1',
      contents: [],
    };
    const content: TrackContent = {
      id: 'content-1',
      sourceId: 'video-source-1',
      type: 'video',
      inPoint: createTimecode(0, 0, 0, 0, 30),
      outPoint: createTimecode(0, 0, 10, 0, 30),
      opacity: 1,
    };

    editor.execute(new AddTrackCommand(track));
    editor.execute(new AddContentCommand(track.id, content));

    const splitPoint = createTimecode(0, 0, 15, 0, 30);
    editor.execute(new SplitContentCommand(track.id, content.id, splitPoint));

    const updatedTrack = editor.getState().tracks[0];
    expect(updatedTrack.contents).toHaveLength(1);
  });
});
