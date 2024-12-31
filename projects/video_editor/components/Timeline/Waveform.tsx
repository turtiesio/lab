import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

interface WaveformProps {
  data?: Float32Array;
}

export default function Waveform({ data }: WaveformProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!waveformRef.current) return;

    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#4f46e5",
      progressColor: "#6366f1",
      cursorColor: "#4338ca",
      height: 80,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      normalize: true,
    });

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (data && wavesurferRef.current) {
      const audioBuffer = new AudioBuffer({
        length: data.length,
        sampleRate: 44100,
        numberOfChannels: 1,
      });
      audioBuffer.copyToChannel(data, 0);

      // Convert AudioBuffer to Blob
      const audioContext = new AudioContext();
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      source.connect(processor);
      processor.connect(audioContext.destination);

      const chunks: Float32Array[] = [];
      processor.onaudioprocess = (e) => {
        chunks.push(new Float32Array(e.inputBuffer.getChannelData(0)));
      };

      source.start();
      source.onended = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        wavesurferRef.current?.load(URL.createObjectURL(blob));
      };
    }
  }, [data]);

  return <div ref={waveformRef} className="w-full h-full" />;
}
