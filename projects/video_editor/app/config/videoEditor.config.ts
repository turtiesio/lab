// app/config/videoEditor.config.ts

export const VIDEO_EDITOR_CONFIG = {
  // Time thresholds
  TIME_UPDATE_THRESHOLD: 0.1, // Minimum time difference to trigger an update (seconds)
  MIN_SEGMENT_DURATION: 0.5, // Minimum duration for a segment (seconds)
  SKIP_BUFFER: 0.1, // Buffer time for skipping to next segment (seconds)

  // Drag controls
  MIN_DRAG_THRESHOLD: 10, // Minimum pixels to drag before showing drag box

  // Zoom controls
  ZOOM_INCREMENT: 0.1, // Amount to change zoom by
  MIN_ZOOM: 0.5, // Minimum zoom level
  MAX_ZOOM: 2, // Maximum zoom level

  // Waveform generation
  WAVEFORM_RESOLUTION: 0.005, // Time resolution for waveform sampling (seconds)
  WAVEFORM_DEFAULT_VALUE: 0.5, // Default value for waveform when generation fails
  WAVEFORM_FFT_SIZE: 2048, // FFT size for waveform analysis

  // Thumbnail generation
  THUMBNAIL_COUNT: 10, // Number of thumbnails to generate
  THUMBNAIL_WIDTH: 160, // Width of generated thumbnails
  THUMBNAIL_HEIGHT: 90, // Height of generated thumbnails
  THUMBNAIL_QUALITY: 0.7, // JPEG quality for thumbnails (0-1)
} as const;

// Type for the config
export type VideoEditorConfig = typeof VIDEO_EDITOR_CONFIG;
