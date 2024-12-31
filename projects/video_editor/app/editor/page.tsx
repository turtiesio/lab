"use client";

import { useEditorStore } from "../../store/editor";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import FileUpload from "../../components/FileUpload";
import Timeline from "../../components/Timeline";
import ExportControl from "../../components/ExportControl";
import { Undo2, Redo2 } from "lucide-react";

export default function EditorPage() {
  useKeyboardShortcuts();
  const {
    videoFile,
    setVideoFile,
    undo,
    redo,
    history,
    duration,
    currentTime,
    setCurrentTime,
    segments,
    addSegment,
    removeSegment,
  } = useEditorStore();

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">Video Editor</h1>
        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
            onClick={undo}
            disabled={history.past.length === 0}
          >
            <Undo2 className="w-5 h-5" />
          </button>
          <button
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
            onClick={redo}
            disabled={history.future.length === 0}
          >
            <Redo2 className="w-5 h-5" />
          </button>
          <ExportControl />
        </div>
      </div>
      <div className="flex-1 p-4">
        {!videoFile ? (
          <FileUpload onFileSelected={setVideoFile} />
        ) : (
          <Timeline
            duration={duration}
            currentTime={currentTime}
            onTimeUpdate={setCurrentTime}
            segments={segments}
            onAddSegment={addSegment}
            onRemoveSegment={removeSegment}
            videoUrl={videoFile ? URL.createObjectURL(videoFile) : ""}
            isPlaying={false}
          />
        )}
      </div>
    </div>
  );
}
