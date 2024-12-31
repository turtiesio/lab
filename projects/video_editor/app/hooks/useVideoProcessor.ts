import { useState, useEffect } from "react";
import { Thumbnail } from "../types/video-editor.types";

export const useVideoProcessor = (
  videoRef: React.RefObject<HTMLVideoElement | null>
) => {
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateWaveform = async (file: File) => {
    try {
      const audioContext = new AudioContext();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Calculate number of samples based on duration and resolution
      const resolution = 0.005; // 0.1 second resolution
      const duration = audioBuffer.duration;
      const numSamples = Math.ceil(duration / resolution);

      // Create an offline context for processing
      const offlineCtx = new OfflineAudioContext(
        1,
        audioBuffer.sampleRate * duration,
        audioBuffer.sampleRate
      );

      const source = offlineCtx.createBufferSource();
      const analyzer = offlineCtx.createAnalyser();
      analyzer.fftSize = 2048;
      const bufferLength = analyzer.frequencyBinCount;
      const dataArray = new Float32Array(bufferLength);

      source.buffer = audioBuffer;
      source.connect(analyzer);
      analyzer.connect(offlineCtx.destination);
      source.start(0);

      // Process the audio
      await offlineCtx.startRendering();

      const waveform: number[] = [];
      const samplesPerSegment = Math.floor(audioBuffer.length / numSamples);

      // Generate waveform data for each time segment
      for (let i = 0; i < numSamples; i++) {
        const startSample = i * samplesPerSegment;
        const segment = audioBuffer
          .getChannelData(0)
          .slice(startSample, startSample + samplesPerSegment);

        // Calculate RMS value for this time segment
        const rms = Math.sqrt(
          segment.reduce((acc, val) => acc + val * val, 0) / segment.length
        );
        waveform.push(rms);
      }

      // Normalize the waveform data
      const maxValue = Math.max(...waveform, 0.01);
      const normalizedWaveform = waveform.map((v) => v / maxValue);

      setWaveformData(normalizedWaveform);
    } catch (error) {
      console.warn("Error generating waveform:", error);
      // Set a default waveform pattern on error
      setWaveformData(Array(100).fill(0.5));
    }
  };

  const processVideoFile = async (file: File) => {
    setError(null);
    setThumbnails([]);
    setWaveformData([]);

    if (!file.type.startsWith("video/")) {
      throw new Error("Invalid file type. Please upload a video file.");
    }

    const videoURL = URL.createObjectURL(file);

    try {
      if (!videoRef.current) {
        throw new Error("Video element not found");
      }

      // Load video metadata
      await new Promise<void>((resolve, reject) => {
        if (!videoRef.current) {
          reject(new Error("Video element not found"));
          return;
        }

        videoRef.current.src = videoURL;
        videoRef.current.onloadedmetadata = () => resolve();
        videoRef.current.onerror = () =>
          reject(new Error("Error loading video"));
      });

      // Generate waveform in the background
      generateWaveform(file).catch((error) => {
        console.warn("Waveform generation failed:", error);
        setWaveformData(Array(100).fill(0.5));
      });

      // Generate thumbnails
      await generateThumbnails();

      return videoURL;
    } catch (error) {
      URL.revokeObjectURL(videoURL);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unknown error processing video";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const generateThumbnails = async () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const duration = video.duration;
    const numThumbnails = 10;
    const interval = duration / numThumbnails;
    const newThumbnails: Thumbnail[] = [];

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not create canvas context");

    canvas.width = 160; // thumbnail width
    canvas.height = 90; // thumbnail height

    for (let i = 0; i < numThumbnails; i++) {
      const time = i * interval;
      video.currentTime = time;

      try {
        await new Promise<void>((resolve) => {
          video.onseeked = () => {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            newThumbnails.push({
              time,
              url: canvas.toDataURL("image/jpeg", 0.7),
            });
            resolve();
          };
        });
      } catch (error) {
        console.error(`Error generating thumbnail at ${time}s:`, error);
      }
    }

    setThumbnails(newThumbnails);
  };

  return {
    thumbnails,
    waveformData,
    processVideoFile,
    error,
  };
};
