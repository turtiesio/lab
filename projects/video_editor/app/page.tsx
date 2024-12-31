"use client";

import { useState } from "react";
import Timeline from "../components/Timeline";

export default function Home() {
  const [currentTime, setCurrentTime] = useState(0);
  const duration = 120; // 2 minutes
  const segments: { start: number; end: number; type: "speech" | "silence" }[] =
    [
      { start: 0, end: 10, type: "speech" },
      { start: 10, end: 15, type: "silence" },
      { start: 15, end: 30, type: "speech" },
    ];

  // Generate sample waveform data
  const waveformData = new Float32Array(44100 * duration);
  for (let i = 0; i < waveformData.length; i++) {
    waveformData[i] = Math.random() * 2 - 1;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8">Video Editor</h1>
      <div className="w-full max-w-4xl">
        <Timeline
          duration={duration}
          currentTime={currentTime}
          onTimeUpdate={setCurrentTime}
          waveformData={waveformData}
          segments={segments}
        />
      </div>
    </main>
  );
}
