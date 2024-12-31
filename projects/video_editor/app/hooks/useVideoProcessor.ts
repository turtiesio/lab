import { useVideoEditorStore } from "../store/videoEditorStore";
import { VIDEO_EDITOR_CONFIG } from "../config/videoEditor.config";
import { Thumbnail } from "../types/video-editor.types";

export const useVideoProcessor = (
  videoRef: React.RefObject<HTMLVideoElement>
) => {
  const {
    setThumbnails,
    setWaveformData,
    setVideoState,
    setVideoUrl,
    saveState,
  } = useVideoEditorStore();

  const generateWaveform = async (file: File) => {
    try {
      const audioContext = new AudioContext();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Calculate number of samples based on duration and resolution
      const resolution = VIDEO_EDITOR_CONFIG.WAVEFORM_RESOLUTION;
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
      analyzer.fftSize = VIDEO_EDITOR_CONFIG.WAVEFORM_FFT_SIZE;
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
      setWaveformData(
        Array(100).fill(VIDEO_EDITOR_CONFIG.WAVEFORM_DEFAULT_VALUE)
      );
    }
  };

  const processVideoFile = async (file: File) => {
    if (!file.type.startsWith("video/")) {
      throw new Error("Invalid file type. Please upload a video file.");
    }

    try {
      const videoURL = URL.createObjectURL(file);
      setVideoUrl(videoURL);

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

      // Update store state
      if (videoRef.current) {
        setVideoState({ duration: videoRef.current.duration });
      }
      saveState();

      return videoURL;
    } catch (error) {
      setVideoUrl(null);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unknown error processing video";
      throw new Error(errorMessage);
    }
  };

  const generateThumbnails = async () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const duration = video.duration;
    const numThumbnails = VIDEO_EDITOR_CONFIG.THUMBNAIL_COUNT;
    const interval = duration / numThumbnails;
    const newThumbnails: Thumbnail[] = [];

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not create canvas context");

    canvas.width = VIDEO_EDITOR_CONFIG.THUMBNAIL_WIDTH;
    canvas.height = VIDEO_EDITOR_CONFIG.THUMBNAIL_HEIGHT;

    for (let i = 0; i < numThumbnails; i++) {
      const time = i * interval;
      video.currentTime = time;

      try {
        await new Promise<void>((resolve) => {
          video.onseeked = () => {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            newThumbnails.push({
              time,
              url: canvas.toDataURL(
                "image/jpeg",
                VIDEO_EDITOR_CONFIG.THUMBNAIL_QUALITY
              ),
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
    processVideoFile,
  };
};
