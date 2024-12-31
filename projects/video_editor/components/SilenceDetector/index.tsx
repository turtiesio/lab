import { detectSilence } from "./algorithms";

export default function SilenceDetector() {
  const handleDetectSilence = () => {
    // Implementation will go here
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Silence Detection</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleDetectSilence}
      >
        Detect Silence
      </button>
    </div>
  );
}
