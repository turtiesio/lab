import { useEffect } from "react";
import { useEditorStore } from "../store/editor";

export function useKeyboardShortcuts() {
  const { undo, redo } = useEditorStore();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [undo, redo]);
}
