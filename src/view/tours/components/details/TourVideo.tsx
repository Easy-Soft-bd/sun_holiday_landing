"use client";

import { TourPackage } from "@/src/view/tours/data/mockTours";
import { ExternalLink, Play } from "lucide-react";

function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function getVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

export default function TourVideo({ tour }: { tour: TourPackage }) {
  if (!tour.videoUrl?.trim()) return null;

  const url = tour.videoUrl.trim();
  const youtubeId = getYouTubeId(url);
  const vimeoId = getVimeoId(url);

  return (
    <section className="mt-16 mb-8">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-base-200 bg-base-100 shadow-2xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />

        <div className="relative p-8 md:p-12">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-primary">Video</span>
              <h3 className="font-magmawave text-3xl text-base-content md:text-4xl">See the experience</h3>
              <p className="mt-2 max-w-xl text-base-content/60">
                Watch a preview of this tour, or open the link in a new tab.
              </p>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-primary shrink-0 gap-2 rounded-xl"
            >
              <ExternalLink size={18} />
              Open video link
            </a>
          </div>

          {youtubeId ? (
            <div className="relative aspect-video overflow-hidden rounded-3xl shadow-2xl ring-1 ring-base-content/5">
              <iframe
                className="absolute left-0 top-0 h-full w-full"
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0`}
                title={`${tour.title} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : vimeoId ? (
            <div className="relative aspect-video overflow-hidden rounded-3xl shadow-2xl ring-1 ring-base-content/5">
              <iframe
                className="absolute left-0 top-0 h-full w-full"
                src={`https://player.vimeo.com/video/${vimeoId}`}
                title={`${tour.title} video`}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-base-300 bg-base-200/30 px-8 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/5">
                <Play size={28} className="text-primary" />
              </div>
              <p className="max-w-md text-sm text-base-content/70">
                This link is not a supported embedded player (YouTube or Vimeo). Use the button above to watch in your browser.
              </p>
              <p className="break-all text-xs text-base-content/50">{url}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
