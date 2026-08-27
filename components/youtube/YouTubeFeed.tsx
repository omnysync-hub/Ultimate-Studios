import { getChannelVideos, type YouTubeVideo } from "@/lib/youtube";
import { YouTubeFeedSkeleton } from "./YouTubeFeedSkeleton";
import { YouTubeThumbnail } from "./YouTubeThumbnail";

type Props = {
  limit?: number;
  className?: string;
};

export async function YouTubeFeed({ limit = 9, className = "" }: Props) {
  let videos: YouTubeVideo[] = [];
  let failed = false;

  try {
    videos = await getChannelVideos(limit);
  } catch {
    failed = true;
  }

  if (failed) {
    return (
      <section
        className={`rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 text-zinc-300 ${className}`}
        aria-label="YouTube uploads"
      >
        <h2 className="text-xl font-semibold text-zinc-100">Latest uploads</h2>
        <p className="mt-3 text-sm text-zinc-400">
          Couldn&apos;t load the YouTube feed right now. Please try again later.
        </p>
      </section>
    );
  }

  if (!videos.length) {
    return <YouTubeFeedSkeleton className={className} />;
  }

  return (
    <section className={className} aria-label="YouTube uploads">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">YouTube</p>
          <h2 className="mt-1 text-2xl font-semibold text-zinc-100 sm:text-3xl">
            Latest uploads
          </h2>
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <li key={video.videoId}>
            <YouTubeCard video={video} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function YouTubeCard({ video }: { video: YouTubeVideo }) {
  return (
    <a
      href={video.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-md transition hover:border-zinc-600 hover:bg-zinc-900/80"
    >
      <div className="relative aspect-video overflow-hidden bg-zinc-950">
        <YouTubeThumbnail
          src={video.thumbnailUrl}
          fallbackSrc={video.thumbnailFallbackUrl}
          alt={video.title}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-zinc-950 shadow-lg">
            <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-current" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
        {video.publishedLabel ? (
          <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/55 px-2.5 py-1 text-[11px] font-medium tracking-wide text-zinc-100 backdrop-blur">
            {video.publishedLabel}
          </span>
        ) : null}
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-zinc-100 sm:text-[0.95rem]">
          {video.title}
        </h3>
      </div>
    </a>
  );
}
