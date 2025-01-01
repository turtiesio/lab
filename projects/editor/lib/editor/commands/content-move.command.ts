import { Command, EditorState, Timecode } from '@/lib/editor/types/editor';

export class MoveContentCommand implements Command {
  constructor(
    private trackId: string,
    private contentId: string,
    private newStartTime: Timecode
  ) {}

  execute(state: EditorState): EditorState {
    return state;
  }
}
