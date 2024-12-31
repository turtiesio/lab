"use client";

import { useState } from "react";
import Link from "next/link";
import Timeline from "../components/Timeline";

export default function Home() {
  const [currentTime, setCurrentTime] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
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
      <Link
        href="/editor"
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors mb-8"
      >
        Open Advanced Editor
      </Link>
    </main>
  );
}
