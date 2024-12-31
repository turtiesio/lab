import { useCallback } from "react";

interface CursorProps {
  position: number;
  onDrag: (time: number) => void;
  duration: number;
}

export default function Cursor({ position, onDrag, duration }: CursorProps) {
  const handleDrag = useCallback(
    (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      if (!target) return;

      const bounds = target.getBoundingClientRect();
      const x = (e.clientX - bounds.left) / bounds.width;
      onDrag(x * duration);
    },
    [onDrag, duration]
  );

  const handleDragStart = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const onMouseMove = (moveEvent: MouseEvent) => handleDrag(moveEvent);
      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [handleDrag]
  );

  return (
    <div
      className="absolute w-0.5 bg-blue-500 h-full cursor-grab"
      style={{ left: `${position * 100}%` }}
      onMouseDown={handleDragStart}
    />
  );
}
