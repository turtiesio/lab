import { createFFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Segment } from "../types";

export class VideoExporter {
  private ffmpeg: FFmpeg;

  constructor() {
    this.ffmpeg = new FFmpeg();
  }

  async init() {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd";
    await this.ffmpeg.load({
      coreURL: `${baseURL}/ffmpeg-core.js`,
      wasmURL: `${baseURL}/ffmpeg-core.wasm`,
      workerURL: `${baseURL}/ffmpeg-core.worker.js`,
    });
  }

  async exportVideo(
    videoFile: File,
    segments: Segment[],
    options: {
      format: "mp4" | "webm";
      quality: number;
    }
  ): Promise<Blob> {
    const inputPath =
      "input" + videoFile.name.substring(videoFile.name.lastIndexOf("."));
    const outputPath = `output.${options.format}`;

    // Write input file
    await this.ffmpeg.writeFile(inputPath, await fetchFile(videoFile));

    // Create filter complex for removing silent segments
    const filters = segments
      .filter((s) => s.type === "speech")
      .map(
        (s, i) =>
          `[0:v]trim=${s.start}:${s.end},setpts=PTS-STARTPTS[v${i}];[0:a]atrim=${s.start}:${s.end},asetpts=PTS-STARTPTS[a${i}]`
      )
      .join(";");

    const command = [
      "-i",
      inputPath,
      "-filter_complex",
      filters,
      // Add concat filter
      "-map",
      "[v]",
      "-map",
      "[a]",
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      options.quality.toString(),
      outputPath,
    ];

    await this.ffmpeg.exec(command);

    const data = await this.ffmpeg.readFile(outputPath);
    return new Blob([data], { type: `video/${options.format}` });
  }
}
