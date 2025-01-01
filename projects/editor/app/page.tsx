import { Controls, Timeline } from "@/components/Editor";
import {
  usePlayback,
  useTimelineOperations,
} from "@/hooks/useTimelineOperations";
import { useEditorStore } from "@/lib/editor/store";

export default function Home() {
  const { addTrack, addContent } = useTimelineOperations();
  const { play, pause, seek } = usePlayback();
  const tracks = useEditorStore((state) => state.editor.getState().tracks);

  return (
    <div>
      <Controls onPlay={play} onPause={pause} onSeek={seek} />
      <Timeline
        tracks={tracks}
        onAddTrack={addTrack}
        onAddContent={addContent}
      />
    </div>
  );
}
