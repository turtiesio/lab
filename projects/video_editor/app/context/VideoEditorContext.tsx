import React, { createContext, useContext, useReducer } from "react";
import { VideoState, Segment } from "../types/video-editor.types";

interface VideoEditorState {
  videoState: VideoState;
  segments: Segment[];
  selectedSegmentId: number | null;
}

type VideoEditorAction =
  | { type: "SET_VIDEO_STATE"; payload: VideoState }
  | { type: "ADD_SEGMENT"; payload: Segment }
  | {
      type: "UPDATE_SEGMENT";
      payload: { id: number; updates: Partial<Segment> };
    }
  | { type: "DELETE_SEGMENT"; payload: number }
  | { type: "SELECT_SEGMENT"; payload: number | null };

const VideoEditorContext = createContext<{
  state: VideoEditorState;
  dispatch: React.Dispatch<VideoEditorAction>;
} | null>(null);

const videoEditorReducer = (
  state: VideoEditorState,
  action: VideoEditorAction
): VideoEditorState => {
  switch (action.type) {
    case "SET_VIDEO_STATE":
      return { ...state, videoState: action.payload };
    case "ADD_SEGMENT":
      return { ...state, segments: [...state.segments, action.payload] };
    case "UPDATE_SEGMENT":
      return {
        ...state,
        segments: state.segments.map((seg) =>
          seg.id === action.payload.id
            ? { ...seg, ...action.payload.updates }
            : seg
        ),
      };
    case "DELETE_SEGMENT":
      return {
        ...state,
        segments: state.segments.filter((seg) => seg.id !== action.payload),
        selectedSegmentId:
          state.selectedSegmentId === action.payload
            ? null
            : state.selectedSegmentId,
      };
    case "SELECT_SEGMENT":
      return { ...state, selectedSegmentId: action.payload };
    default:
      return state;
  }
};

export const VideoEditorProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(videoEditorReducer, {
    videoState: {
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      zoom: 1,
    },
    segments: [],
    selectedSegmentId: null,
  });

  return (
    <VideoEditorContext.Provider value={{ state, dispatch }}>
      {children}
    </VideoEditorContext.Provider>
  );
};

export const useVideoEditor = () => {
  const context = useContext(VideoEditorContext);
  if (!context) {
    throw new Error("useVideoEditor must be used within VideoEditorProvider");
  }
  return context;
};
