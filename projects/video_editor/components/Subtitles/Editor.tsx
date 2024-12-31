export default function Editor() {
  return (
    <div className="space-y-2">
      <div
        contentEditable
        className="p-2 bg-white rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Edit subtitle text here...
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => alert("Subtitle saved")}
      >
        Save
      </button>
    </div>
  );
}
