"use client";

import { useRef } from "react";
import { useLoopingVideo } from "@/hooks/useLoopingVideo";
import type { VideoSegments } from "@/types/brand";

interface StoryVideoPlayerProps {
  src: string;
  segments?: VideoSegments;
  label: string;
}

export function StoryVideoPlayer({ src, segments, label }: StoryVideoPlayerProps) {
  const ref = useRef<HTMLVideoElement>(null);
  useLoopingVideo(ref, segments);

  const fragment = segments ? `${src}#t=${segments.startAt}` : src;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-card border border-border">
      <video
        ref={ref}
        className="h-full w-full object-cover"
        src={fragment}
        muted
        autoPlay
        playsInline
        loop={!segments}
        preload="metadata"
        aria-label={label}
      />
    </div>
  );
}
