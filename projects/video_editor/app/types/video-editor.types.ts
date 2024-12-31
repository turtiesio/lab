export interface Segment {
  id: number;
  start: number;
  end: number;
  enabled: boolean;
  isSelected?: boolean;
}

export interface Thumbnail {
  time: number;
  url: string;
}

export interface VideoState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  zoom: number;
}
