export interface Segment {
  start: number;
  end: number;
  type: "speech" | "silence";
  label?: string;
  metadata?: {
    confidence?: number;
    speaker?: string;
    transcription?: string;
  };
}
