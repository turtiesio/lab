interface BaseContent {
  id: string;
  type: "video" | "audio" | "subtitle";
  sourceId: string;
  inPoint: Timecode;
  outPoint: Timecode;
}

interface VideoContent extends BaseContent {
  type: "video";
  opacity: number;
  resolution?: {
    width: number;
    height: number;
  };
}

interface AudioContent extends BaseContent {
  type: "audio";
  volume: number;
  waveform?: Float32Array;
  peak?: number;
  isMuted?: boolean;
}

interface SubtitleContent extends BaseContent {
  type: "subtitle";
  text: string;
  words: WordTiming[];
  style?: {
    font?: string;
    size?: number;
    color?: string;
    position?: { x: number; y: number };
  };
}

interface WordTiming {
  word: string;
  startTime: Timecode;
  endTime: Timecode;
}

//

type TrackContent = VideoContent | AudioContent | SubtitleContent;

//
//

interface ContentMetadata {
  sourceFile: string;
  duration: Timecode;
  type: "video" | "audio";
  codec?: string;
  bitrate?: number;
  sampleRate?: number;
  channels?: number;
}
