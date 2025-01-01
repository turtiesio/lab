import { produce } from 'immer';
import { Command, EditorState, TrackContent } from '../types/editor';

export class AddContentCommand implements Command {
  constructor(private trackId: string, private content: TrackContent) {}

  execute(state: EditorState): EditorState {
    return produce(state, (draft) => {
      const track = draft.tracks.find((t) => t.id === this.trackId);
      if (track) {
        track.contents.push(this.content);
      }
    });
  }
}
