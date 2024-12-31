import { VideoState, Segment, Thumbnail } from "@/app/types/video-editor.types";

// Add history tracking interfaces
interface HistoryState {
  past: VideoEditorState[];
  present: VideoEditorState;
  future: VideoEditorState[];
}

export interface VideoEditorState {
  videoState: VideoState;
  segments: Segment[];
  selectedSegmentId: number | null;
  thumbnails: Thumbnail[];
  waveformData: number[];
  videoUrl: string | null; // Add video URL to state
}

export interface VideoEditorStore extends VideoEditorState {
  // State management
  setVideoState: (state: Partial<VideoState>) => void;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
  setZoom: (zoom: number) => void;
  setVideoUrl: (url: string | null) => void;

  // Segments management
  addSegment: (segment: Omit<Segment, "id">) => void;
  updateSegment: (id: number, updates: Partial<Segment>) => void;
  deleteSegment: (id: number) => void;
  selectSegment: (id: number | null) => void;

  // Video processing
  setThumbnails: (thumbnails: Thumbnail[]) => void;
  setWaveformData: (data: number[]) => void;

  // History management
  history: HistoryState;
  undo: () => void;
  redo: () => void;
  saveState: () => void;
}
