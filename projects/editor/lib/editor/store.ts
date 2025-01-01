import { create } from 'zustand';
import { produce } from 'immer';
import { EditorState, Command } from './types/editor';

interface EditorStore {
  state: EditorState;
  isPlaying: boolean;
  currentTime: number;
  zoom: number;
  history: EditorState[];
  future: EditorState[];
  execute: (command: Command) => void;
  undo: () => void;
  redo: () => void;
  setPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setZoom: (zoom: number) => void;
}

const initialEditorState: EditorState = {
  tracks: [],
  selectedTrackId: null,
  selectedContentId: null,
};

export const useEditorStore = create<EditorStore>((set, get) => ({
  state: initialEditorState,
  isPlaying: false,
  currentTime: 0,
  zoom: 1,
  history: [],
  future: [],

  execute: (command: Command) => {
    set(
      produce((draft: EditorStore) => {
        const currentState = draft.state;
        draft.history.push(currentState);
        draft.state = command.execute(currentState);
        draft.future = [];
      })
    );
  },

  undo: () => {
    set(
      produce((draft: EditorStore) => {
        if (draft.history.length > 0) {
          const previousState = draft.history.pop();
          if (previousState) {
            draft.future.push(draft.state);
            draft.state = previousState;
          }
        }
      })
    );
  },

  redo: () => {
    set(
      produce((draft: EditorStore) => {
        if (draft.future.length > 0) {
          const nextState = draft.future.pop();
          if (nextState) {
            draft.history.push(draft.state);
            draft.state = nextState;
          }
        }
      })
    );
  },

  setPlaying: (isPlaying: boolean) => set({ isPlaying }),
  setCurrentTime: (time: number) => set({ currentTime: time }),
  setZoom: (zoom: number) => set({ zoom }),
}));
