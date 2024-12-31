import { useEffect } from "react";

export const useHotkeys = (shortcuts: Record<string, () => void>) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();

      // Handle mod+z
      if (isMod && !e.shiftKey && key === "z") {
        shortcuts["mod+z"]?.();
      }
      // Handle mod+shift+z
      else if (isMod && e.shiftKey && key === "z") {
        shortcuts["mod+shift+z"]?.();
      }
      // Handle space
      else if (key === " ") {
        shortcuts["space"]?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
};
