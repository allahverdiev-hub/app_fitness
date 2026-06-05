const KINESCOPE_HOST = "kinescope.io";

/** Прямая ссылка Kinescope → URL для iframe embed */
export function toKinescopeEmbedUrl(videoUrl: string): string | null {
  try {
    const url = new URL(videoUrl.trim());
    if (!url.hostname.endsWith(KINESCOPE_HOST)) {
      return null;
    }

    const segments = url.pathname.split("/").filter(Boolean);
    const videoId =
      segments[0] === "embed" ? segments[1] : segments[0];

    if (!videoId) {
      return null;
    }

    return `https://${KINESCOPE_HOST}/embed/${videoId}`;
  } catch {
    return null;
  }
}
