import { Command, EditorState, Timecode } from '@/lib/editor/types/editor';
import {
  calculateTimecode,
  splitTimecode,
  timecodeDiff,
  createTimecode,
  framesToTimecode,
} from '../timecode-helper';

export class SplitContentCommand implements Command {
  constructor(
    private trackId: string,
    private contentId: string,
    private splitPoint: Timecode
  ) {}

  execute(state: EditorState): EditorState {
    const track = state.tracks.find((t) => t.id === this.trackId);
    if (!track) return state;

    const contentIndex = track.contents.findIndex(
      (c) => c.id === this.contentId
    );
    if (contentIndex === -1) return state;

    const content = track.contents[contentIndex];
    const contentEndTime = content.outPoint;

    // Check if split point is within content bounds
    if (
      timecodeDiff(this.splitPoint, content.inPoint) <= 0 ||
      timecodeDiff(this.splitPoint, contentEndTime) >= 0
    ) {
      return state;
    }

    // Calculate new durations
    const firstPartDuration = timecodeDiff(this.splitPoint, content.inPoint);
    const secondPartDuration = timecodeDiff(content.outPoint, this.splitPoint);

    // Create split points using proper Timecode objects
    const firstPartEndpoint = this.splitPoint;
    const secondPartStartpoint = createTimecode(
      this.splitPoint.hours,
      this.splitPoint.minutes,
      this.splitPoint.seconds,
      this.splitPoint.frames,
      this.splitPoint.fps
    );

    // Create two new content pieces
    const firstPart: TrackContent = {
      ...content,
      id: `${content.id}_1`,
      outPoint: firstPartEndpoint,
    };

    const secondPart: TrackContent = {
      ...content,
      id: `${content.id}_2`,
      inPoint: secondPartStartpoint,
    };

    // Handle specific content type adjustments
    if (content.type === 'video' || content.type === 'audio') {
      if (content.type === 'video') {
        (secondPart as VideoContent).inPoint = calculateTimecode(
          content.inPoint,
          framesToTimecode(firstPartDuration, content.inPoint.fps)
        );
      } else if (content.type === 'audio') {
        (secondPart as AudioContent).inPoint = calculateTimecode(
          content.inPoint,
          framesToTimecode(firstPartDuration, content.inPoint.fps)
        );
      }
    } else if (content.type === 'subtitle') {
      // Split subtitle words between the two parts
      const firstWords = content.words.filter(
        (w) => timecodeDiff(w.endTime, this.splitPoint) <= 0
      );
      const secondWords = content.words.filter(
        (w) => timecodeDiff(w.startTime, this.splitPoint) > 0
      );

      (firstPart as SubtitleContent).words = firstWords;
      (secondPart as SubtitleContent).words = secondWords;
    }

    // Create new tracks array with split content
    const newTracks = state.tracks.map((t) => {
      if (t.id === this.trackId) {
        const newContents = [...t.contents];
        newContents.splice(contentIndex, 1, firstPart, secondPart);
        return { ...t, contents: newContents };
      }
      return t;
    });

    return {
      ...state,
      tracks: newTracks,
    };
  }
}
