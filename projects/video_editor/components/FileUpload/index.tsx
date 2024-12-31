import { ChangeEvent, useCallback } from "react";
import { Upload } from "lucide-react";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
}

export default function FileUpload({ onFileSelected }: FileUploadProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      onFileSelected(file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith("video/")) {
        onFileSelected(file);
      }
    },
    [onFileSelected]
  );

  return (
    <div
      className="border-2 border-dashed rounded-lg p-12 text-center hover:border-blue-500 transition-colors"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <input
        type="file"
        accept="video/*"
        onChange={handleChange}
        className="hidden"
        id="video-upload"
      />
      <label
        htmlFor="video-upload"
        className="flex flex-col items-center cursor-pointer"
      >
        <Upload className="h-12 w-12 mb-4 text-gray-500" />
        <p className="text-gray-600">Drop your video here or click to browse</p>
      </label>
    </div>
  );
}
