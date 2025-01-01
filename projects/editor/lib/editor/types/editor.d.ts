export interface Timecode {
  hours: number;
  minutes: number;
  seconds: number;
  frames: number;
  fps: number;
}

export interface EditorState {
  tracks: Track[];
  selectedTrackId: string | null;
  selectedContentId: string | null;
}

export interface Track {
  id: string;
  name: string;
  contents: TrackContent[];
}

export interface BaseContent {
  id: string;
  type: 'video' | 'audio' | 'subtitle';
  sourceId: string;
  inPoint: Timecode;
  outPoint: Timecode;
}

export interface VideoContent extends BaseContent {
  type: 'video';
  opacity: number;
  resolution?: {
    width: number;
    height: number;
  };
}

export interface AudioContent extends BaseContent {
  type: 'audio';
  volume: number;
  waveform?: Float32Array;
  peak?: number;
  isMuted?: boolean;
}

export interface SubtitleContent extends BaseContent {
  type: 'subtitle';
  text: string;
  words: WordTiming[];
  style?: {
    font?: string;
    size?: number;
    color?: string;
    position?: { x: number; y: number };
  };
}

export interface WordTiming {
  word: string;
  startTime: Timecode;
  endTime: Timecode;
}

export type TrackContent = VideoContent | AudioContent | SubtitleContent;

//

export interface Command {
  execute(state: EditorState): EditorState;
}
