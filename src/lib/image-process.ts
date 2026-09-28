import sharp from "sharp";

const MAX_WIDTH = 1920;
const WEBP_QUALITY = 80;

export type ProcessedImage = {
  buffer: Buffer;
  extension: string;
  contentType: string;
};

export function buildProcessedFilename(originalName: string, extension: string): string {
  const base = originalName
    .replace(/\.[^.]+$/i, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "");

  return `${base || "image"}.${extension}`;
}

/** Resize and compress uploaded images before saving to disk. */
export async function processUploadedImage(
  input: Buffer,
  mimeType: string,
): Promise<ProcessedImage> {
  if (mimeType === "image/gif") {
    return {
      buffer: input,
      extension: "gif",
      contentType: "image/gif",
    };
  }

  if (mimeType === "image/svg+xml") {
    return {
      buffer: input,
      extension: "svg",
      contentType: "image/svg+xml",
    };
  }

  const image = sharp(input).rotate();
  const metadata = await image.metadata();

  let pipeline = image;
  if (metadata.width && metadata.width > MAX_WIDTH) {
    pipeline = pipeline.resize(MAX_WIDTH, undefined, {
      withoutEnlargement: true,
    });
  }

  const keepPng = mimeType === "image/png" && metadata.hasAlpha;

  if (keepPng) {
    const buffer = await pipeline
      .png({ compressionLevel: 9, quality: 80 })
      .toBuffer();
    return { buffer, extension: "png", contentType: "image/png" };
  }

  const buffer = await pipeline.webp({ quality: WEBP_QUALITY }).toBuffer();
  return { buffer, extension: "webp", contentType: "image/webp" };
}

/** Square PNG (or original SVG/ICO) sized for browser tab icons. */
export async function processFaviconImage(
  input: Buffer,
  mimeType: string,
): Promise<ProcessedImage> {
  if (mimeType === "image/svg+xml") {
    return {
      buffer: input,
      extension: "svg",
      contentType: "image/svg+xml",
    };
  }

  if (mimeType === "image/x-icon" || mimeType === "image/vnd.microsoft.icon") {
    return {
      buffer: input,
      extension: "ico",
      contentType: "image/x-icon",
    };
  }

  const buffer = await sharp(input)
    .rotate()
    .resize(192, 192, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toBuffer();

  return { buffer, extension: "png", contentType: "image/png" };
}
