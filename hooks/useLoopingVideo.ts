"use client";

import { useEffect, type RefObject } from "react";
import type { VideoSegments } from "@/types/brand";

export function useLoopingVideo(
  ref: RefObject<HTMLVideoElement>,
  segments?: VideoSegments,
): void {
  useEffect(() => {
    const video = ref.current;
    if (\!video || \!segments) return;

    const { startAt, loopEnd } = segments;

    const seekToStart = () => {
      if (video.currentTime < startAt || video.currentTime >= loopEnd) {
        try {
          video.currentTime = startAt;
        } catch {
          /* metadata may not be ready yet */
        }
      }
    };

    const onLoadedMetadata = () => {
      video.currentTime = startAt;
      void video.play();
    };

    const onTimeUpdate = () => {
      if (video.currentTime >= loopEnd) {
        video.currentTime = startAt;
        void video.play();
      }
    };

    if (video.readyState >= 1) {
      seekToStart();
    }

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("timeupdate", onTimeUpdate);
    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [ref, segments]);
}
