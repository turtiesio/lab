import React, { useCallback } from "react";
import { Upload } from "lucide-react";

interface FileSelectorProps {
  onFileSelect: (file: File) => void;
  accept?: string;
}

const FileSelector: React.FC<FileSelectorProps> = ({
  onFileSelect,
  accept = "video/*",
}) => {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer hover:border-gray-400 transition-colors"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-input"
        className="hidden"
        accept={accept}
        onChange={handleFileInput}
      />
      <label
        htmlFor="file-input"
        className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
      >
        <Upload size={48} className="text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-600 mb-2">
          Drag and drop your video here
        </p>
        <p className="text-sm text-gray-500">or click to select a file</p>
      </label>
    </div>
  );
};

export default FileSelector;
