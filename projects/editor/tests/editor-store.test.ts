import { useEditorStore } from '../lib/editor/store';
import { AddTrackCommand, AddContentCommand } from '../lib/editor/commands';
import { Track, TrackContent } from '../lib/editor/types/editor';
import { createTimecode } from '../lib/editor/timecode-helper';

describe('EditorStore', () => {
  beforeEach(() => {
    useEditorStore.setState({
      state: {
        tracks: [],
        selectedTrackId: null,
        selectedContentId: null,
      },
      isPlaying: false,
      currentTime: 0,
      zoom: 1,
      history: [],
      future: [],
    });
  });

  test('should execute command and update state', () => {
    const track: Track = {
      id: 'track-1',
      name: 'Track 1',
      contents: [],
    };

    useEditorStore.getState().execute(new AddTrackCommand(track));
    const state = useEditorStore.getState();
    expect(state.state.tracks).toHaveLength(1);
    expect(state.history).toHaveLength(1);
    expect(state.future).toHaveLength(0);
  });

  test('should undo command', () => {
    const track: Track = {
      id: 'track-1',
      name: 'Track 1',
      contents: [],
    };

    const store = useEditorStore.getState();
    store.execute(new AddTrackCommand(track));
    store.undo();

    const state = useEditorStore.getState();
    expect(state.state.tracks).toHaveLength(0);
    expect(state.history).toHaveLength(0);
    expect(state.future).toHaveLength(1);
  });

  test('should redo command', () => {
    const track: Track = {
      id: 'track-1',
      name: 'Track 1',
      contents: [],
    };

    const store = useEditorStore.getState();
    store.execute(new AddTrackCommand(track));
    store.undo();
    store.redo();

    const state = useEditorStore.getState();
    expect(state.state.tracks).toHaveLength(1);
    expect(state.history).toHaveLength(1);
    expect(state.future).toHaveLength(0);
  });

  test('should clear future stack on new command', () => {
    const track1: Track = {
      id: 'track-1',
      name: 'Track 1',
      contents: [],
    };
    const track2: Track = {
      id: 'track-2',
      name: 'Track 2',
      contents: [],
    };

    const store = useEditorStore.getState();
    store.execute(new AddTrackCommand(track1));
    store.undo();
    store.execute(new AddTrackCommand(track2));

    const state = useEditorStore.getState();
    expect(state.future).toHaveLength(0);
    expect(state.history).toHaveLength(1);
  });

  test('should handle complex operations with undo/redo', () => {
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

    const store = useEditorStore.getState();
    store.execute(new AddTrackCommand(track));
    store.execute(new AddContentCommand(track.id, content));

    let state = useEditorStore.getState();
    expect(state.state.tracks[0].contents).toHaveLength(1);

    store.undo();
    state = useEditorStore.getState();
    expect(state.state.tracks[0].contents).toHaveLength(0);

    store.redo();
    state = useEditorStore.getState();
    expect(state.state.tracks[0].contents).toHaveLength(1);
  });
});
