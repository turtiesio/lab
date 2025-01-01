import { produce } from 'immer';
import { Command, EditorState } from './types/editor';

export class EditorCore {
  constructor(private state: EditorState) {}

  execute(command: Command) {
    this.state = produce(this.state, (draft) => {
      return command.execute(draft);
    });
  }

  getState(): EditorState {
    return this.state;
  }
}
