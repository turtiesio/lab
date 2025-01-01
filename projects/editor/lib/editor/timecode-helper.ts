import { Timecode } from '@/lib/editor/types/editor';

function validateFPS(t1: Timecode, t2: Timecode): void {
  if (t1.fps !== t2.fps) {
    throw new Error('Timecodes must have the same FPS values');
  }
}

export function calculateTimecode(t1: Timecode, t2: Timecode): Timecode {
  validateFPS(t1, t2);

  const totalFrames =
    t1.frames +
    t2.frames +
    (t1.seconds + t2.seconds) * t1.fps +
    (t1.minutes + t2.minutes) * 60 * t1.fps +
    (t1.hours + t2.hours) * 3600 * t1.fps;

  return normalizeTimecode({
    hours: 0,
    minutes: 0,
    seconds: 0,
    frames: totalFrames,
    fps: t1.fps,
  });
}

export function timecodeDiff(t1: Timecode, t2: Timecode): number {
  validateFPS(t1, t2);
  return timecodesToFrames(t1) - timecodesToFrames(t2);
}

export function splitTimecode(start: Timecode, end: Timecode): Timecode {
  validateFPS(start, end);
  const durationFrames = timecodeDiff(end, start);
  return framesToTimecode(durationFrames, start.fps);
}

export function timecodesToFrames(timecode: Timecode): number {
  return (
    timecode.frames +
    timecode.seconds * timecode.fps +
    timecode.minutes * 60 * timecode.fps +
    timecode.hours * 3600 * timecode.fps
  );
}

export function framesToTimecode(frames: number, fps: number): Timecode {
  const hours = Math.floor(frames / (3600 * fps));
  frames %= 3600 * fps;

  const minutes = Math.floor(frames / (60 * fps));
  frames %= 60 * fps;

  const seconds = Math.floor(frames / fps);
  frames = frames % fps;

  return {
    hours,
    minutes,
    seconds,
    frames,
    fps,
  };
}

export function normalizeTimecode(timecode: Timecode): Timecode {
  let totalFrames = timecodesToFrames(timecode);

  const hours = Math.floor(totalFrames / (3600 * timecode.fps));
  totalFrames %= 3600 * timecode.fps;

  const minutes = Math.floor(totalFrames / (60 * timecode.fps));
  totalFrames %= 60 * timecode.fps;

  const seconds = Math.floor(totalFrames / timecode.fps);
  const frames = totalFrames % timecode.fps;

  return {
    hours,
    minutes,
    seconds,
    frames,
    fps: timecode.fps,
  };
}

export function timecodeToString(timecode: Timecode): string {
  return `${padNumber(timecode.hours)}:${padNumber(
    timecode.minutes
  )}:${padNumber(timecode.seconds)}:${padNumber(timecode.frames)}`;
}

// Helper to create a new timecode
export function createTimecode(
  hours: number = 0,
  minutes: number = 0,
  seconds: number = 0,
  frames: number = 0,
  fps: number = 30
): Timecode {
  return {
    hours,
    minutes,
    seconds,
    frames,
    fps,
  };
}

function padNumber(num: number): string {
  return num.toString().padStart(2, '0');
}
