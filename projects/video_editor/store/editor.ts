import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Segment } from "../lib/types";

interface EditorState {
  videoFile: File | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  segments: Segment[];
  history: {
    past: EditorStateSnapshot[];
    future: EditorStateSnapshot[];
  };
}

interface EditorStateSnapshot {
  segments: Segment[];
  // Add other state properties that need history
}

type EditorActions = {
  setVideoFile: (file: File) => void;
  setCurrentTime: (time: number) => void;
  togglePlay: () => void;
  addSegment: (segment: Segment) => void;
  removeSegment: (index: number) => void;
  undo: () => void;
  redo: () => void;
  saveSnapshot: () => void;
};

export const useEditorStore = create<EditorState & EditorActions>()(
  devtools((set, get) => ({
    videoFile: null,
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    segments: [],
    history: {
      past: [],
      future: [],
    },

    setVideoFile: (file) => set({ videoFile: file }),

    saveSnapshot: () => {
      const state = get();
      set({
        history: {
          past: [...state.history.past, { segments: [...state.segments] }],
          future: [],
        },
      });
    },

    undo: () => {
      const state = get();
      if (state.history.past.length === 0) return;

      const newPast = [...state.history.past];
      const lastState = newPast.pop()!;

      set({
        segments: lastState.segments,
        history: {
          past: newPast,
          future: [{ segments: state.segments }, ...state.history.future],
        },
      });
    },

    redo: () => {
      const state = get();
      if (state.history.future.length === 0) return;

      const newFuture = [...state.history.future];
      const nextState = newFuture.shift()!;

      set({
        segments: nextState.segments,
        history: {
          past: [...state.history.past, { segments: state.segments }],
          future: newFuture,
        },
      });
    },
  }))
);
