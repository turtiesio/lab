import { useState } from "react";
import { VideoExporter } from "../../lib/export";
import { useEditorStore } from "../../store/editor";

export default function ExportControl() {
  const [isExporting, setIsExporting] = useState(false);
  const { videoFile, segments } = useEditorStore();
  const [progress, setProgress] = useState(0);

  const handleExport = async () => {
    if (!videoFile) return;

    setIsExporting(true);
    try {
      const exporter = new VideoExporter();
      await exporter.init();

      const blob = await exporter.exportVideo(videoFile, segments, {
        format: "mp4",
        quality: 23, // Lower is better quality (18-28 is common)
      });

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "edited_video.mp4";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleExport}
        disabled={isExporting || !videoFile}
      >
        {isExporting ? "Exporting..." : "Export Video"}
      </button>
      {isExporting && (
        <div className="w-32 h-2 bg-gray-200 rounded overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
