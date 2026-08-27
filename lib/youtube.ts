import { XMLParser } from "fast-xml-parser";

export const YOUTUBE_CHANNEL_ID = "UCc3qOMA8TN5b3PPRlGAFA0Q";

export type YouTubeVideo = {
  videoId: string;
  title: string;
  publishedAt: string;
  publishedLabel: string;
  thumbnailUrl: string;
  thumbnailFallbackUrl: string;
  videoUrl: string;
};

type FeedEntry = {
  videoId?: string;
  title?: string | { "#text"?: string };
  published?: string;
  group?: {
    thumbnail?: { "@_url"?: string } | Array<{ "@_url"?: string }>;
  };
};

function asTitle(value: FeedEntry["title"]): string {
  if (!value) return "Untitled";
  if (typeof value === "string") return value;
  return value["#text"] ?? "Untitled";
}

function formatPublished(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function normalizeEntries(parsed: unknown): FeedEntry[] {
  const feed = parsed as { feed?: { entry?: FeedEntry | FeedEntry[] } };
  const entry = feed?.feed?.entry;
  if (!entry) return [];
  return Array.isArray(entry) ? entry : [entry];
}

export async function getChannelVideos(
  limit = 12,
  channelId = YOUTUBE_CHANNEL_ID
): Promise<YouTubeVideo[]> {
  const res = await fetch(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
    {
      next: { revalidate: 1800 },
      headers: {
        Accept: "application/atom+xml, application/xml, text/xml"
      }
    }
  );

  if (!res.ok) {
    throw new Error(`YouTube RSS fetch failed (${res.status})`);
  }

  const xml = await res.text();
  const parser = new XMLParser({
    ignoreAttributes: false,
    removeNSPrefix: true,
    trimValues: true
  });
  const parsed = parser.parse(xml);
  const entries = normalizeEntries(parsed);

  return entries
    .map((entry) => {
      const videoId = entry.videoId?.trim();
      if (!videoId) return null;

      const publishedAt = entry.published ?? "";
      return {
        videoId,
        title: asTitle(entry.title),
        publishedAt,
        publishedLabel: formatPublished(publishedAt),
        thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
        thumbnailFallbackUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        videoUrl: `https://www.youtube.com/watch?v=${videoId}`
      } satisfies YouTubeVideo;
    })
    .filter((v): v is YouTubeVideo => v !== null)
    .slice(0, limit);
}
