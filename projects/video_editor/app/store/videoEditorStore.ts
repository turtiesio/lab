import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { VideoEditorStore, VideoEditorState } from "../types/store.types";

const initialState: VideoEditorState = {
  videoState: {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    zoom: 1,
  },
  segments: [],
  selectedSegmentId: null,
  thumbnails: [],
  waveformData: [],
  videoUrl: null,
};

export const useVideoEditorStore = create<VideoEditorStore>()(
  immer((set, get) => ({
    ...initialState,
    history: {
      past: [] as VideoEditorState[],
      present: initialState,
      future: [] as VideoEditorState[],
    },

    // Save current state to history
    saveState: () => {
      const currentState = {
        videoState: get().videoState,
        segments: get().segments,
        selectedSegmentId: get().selectedSegmentId,
        thumbnails: get().thumbnails,
        waveformData: get().waveformData,
        videoUrl: get().videoUrl,
      };

      set((state) => {
        state.history.past.push(state.history.present);
        state.history.present = currentState;
        state.history.future = [];
      });
    },

    // Undo action
    undo: () => {
      set((state) => {
        if (state.history.past.length === 0) return state;

        const previous = state.history.past[state.history.past.length - 1];
        const newPast = state.history.past.slice(0, -1);

        return {
          ...previous,
          history: {
            past: newPast,
            present: previous,
            future: [state.history.present, ...state.history.future],
          },
        };
      });
    },

    // Redo action
    redo: () => {
      set((state) => {
        if (state.history.future.length === 0) return state;

        const next = state.history.future[0];
        const newFuture = state.history.future.slice(1);

        return {
          ...next,
          history: {
            past: [...state.history.past, state.history.present],
            present: next,
            future: newFuture,
          },
        };
      });
    },

    // State management
    setVideoState: (newState) =>
      set((state) => {
        state.videoState = { ...state.videoState, ...newState };
      }),

    setVideoUrl: (url) =>
      set((state) => {
        state.videoUrl = url;
      }),

    togglePlay: () =>
      set((state) => {
        state.videoState.isPlaying = !state.videoState.isPlaying;
        // Don't handle video element here - let components handle it
      }),

    setCurrentTime: (time) =>
      set((state) => {
        state.videoState.currentTime = time;
      }),

    setZoom: (zoom) =>
      set((state) => {
        state.videoState.zoom = zoom;
      }),

    // Segments management
    addSegment: (segment) =>
      set((state) => {
        const id =
          state.segments.length > 0
            ? Math.max(...state.segments.map((s) => s.id)) + 1
            : 1;
        state.segments.push({ ...segment, id });
      }),

    updateSegment: (id, updates) =>
      set((state) => {
        const segment = state.segments.find((s) => s.id === id);
        if (segment) {
          Object.assign(segment, updates);
        }
      }),

    deleteSegment: (id) =>
      set((state) => {
        state.segments = state.segments.filter((s) => s.id !== id);
      }),

    selectSegment: (id) =>
      set((state) => {
        state.selectedSegmentId = id;
      }),

    // Video processing
    setThumbnails: (thumbnails) =>
      set((state) => {
        state.thumbnails = thumbnails;
      }),

    setWaveformData: (data) =>
      set((state) => {
        state.waveformData = data;
      }),
  }))
);
