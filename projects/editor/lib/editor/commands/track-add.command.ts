import { produce } from 'immer';
import { EditorState, Track } from '../types/editor';

export class AddTrackCommand {
  constructor(private track: Track) {}

  execute(state: EditorState): EditorState {
    return produce(state, (draft) => {
      draft.tracks.push(this.track);
    });
  }
}
