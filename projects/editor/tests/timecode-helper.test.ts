import {
  calculateTimecode,
  timecodeDiff,
  splitTimecode,
  timecodesToFrames,
  framesToTimecode,
  normalizeTimecode,
  timecodeToString,
  createTimecode,
} from '@/lib/editor/timecode-helper';

describe('timecode-helper', () => {
  describe('calculateTimecode', () => {
    test('should add two timecodes correctly', () => {
      const t1 = createTimecode(0, 0, 10, 0, 30);
      const t2 = createTimecode(0, 0, 5, 0, 30);
      const result = calculateTimecode(t1, t2);
      expect(result).toEqual(createTimecode(0, 0, 15, 0, 30));
    });

    test('should throw error when FPS values differ', () => {
      const t1 = createTimecode(0, 0, 10, 0, 30);
      const t2 = createTimecode(0, 0, 5, 0, 25);
      expect(() => calculateTimecode(t1, t2)).toThrow(
        'Cannot calculate timecode with different FPS values'
      );
    });
  });

  describe('timecodeDiff', () => {
    test('should calculate the difference between two timecodes', () => {
      const t1 = createTimecode(0, 0, 10, 0, 30);
      const t2 = createTimecode(0, 0, 5, 0, 30);
      const result = timecodeDiff(t1, t2);
      expect(result).toBe(150); // 5 seconds * 30 fps
    });

    test('should throw error when FPS values differ', () => {
      const t1 = createTimecode(0, 0, 10, 0, 30);
      const t2 = createTimecode(0, 0, 5, 0, 25);
      expect(() => timecodeDiff(t1, t2)).toThrow(
        'Cannot calculate difference between timecodes with different FPS values'
      );
    });
  });

  describe('splitTimecode', () => {
    test('should calculate the duration between two timecodes', () => {
      const start = createTimecode(0, 0, 5, 0, 30);
      const end = createTimecode(0, 0, 10, 0, 30);
      const result = splitTimecode(start, end);
      expect(result).toEqual(createTimecode(0, 0, 5, 0, 30));
    });

    test('should throw error when FPS values differ', () => {
      const start = createTimecode(0, 0, 5, 0, 30);
      const end = createTimecode(0, 0, 10, 0, 25);
      expect(() => splitTimecode(start, end)).toThrow(
        'Cannot split timecode with different FPS values'
      );
    });
  });

  describe('timecodesToFrames', () => {
    test('should convert a timecode to frames', () => {
      const timecode = createTimecode(0, 0, 10, 0, 30);
      const result = timecodesToFrames(timecode);
      expect(result).toBe(300); // 10 seconds * 30 fps
    });
  });

  describe('framesToTimecode', () => {
    test('should convert frames to a timecode', () => {
      const frames = 300;
      const result = framesToTimecode(frames, 30);
      expect(result).toEqual(createTimecode(0, 0, 10, 0, 30));
    });
  });

  describe('normalizeTimecode', () => {
    test('should normalize a timecode', () => {
      const timecode = createTimecode(0, 0, 70, 35, 30);
      const result = normalizeTimecode(timecode);
      expect(result).toEqual(createTimecode(0, 1, 11, 5, 30));
    });
  });

  describe('timecodeToString', () => {
    test('should convert a timecode to a string', () => {
      const timecode = createTimecode(1, 2, 3, 4, 30);
      const result = timecodeToString(timecode);
      expect(result).toBe('01:02:03:04');
    });
  });

  describe('padNumber', () => {
    test('should pad single-digit numbers with leading zero', () => {
      const timecode = createTimecode(1, 2, 3, 4, 30);
      const result = timecodeToString(timecode);
      expect(result).toBe('01:02:03:04');
    });
  });
});
