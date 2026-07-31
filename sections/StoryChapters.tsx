import { BRAND } from "@/config/brand";
import { Reveal } from "@/components/Reveal";
import { StoryVideoPlayer } from "@/components/StoryVideo";

export function StoryChapters() {
  return (
    <section className="flex flex-col gap-24 py-12 md:gap-32 md:py-16">
      {BRAND.storyVideos.map((chapter, index) => (
        <article key={index} className="container-lux">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-16">
            <div className="min-w-0 md:col-span-5">
              <Reveal>
                <blockquote className="font-display text-display-m font-bold text-gold break-words">
                  {chapter.quote}
                </blockquote>
                <p className="mt-6 max-w-md break-words font-sans text-body-lg text-muted">
                  {chapter.description}
                </p>
              </Reveal>
            </div>
            <div className="min-w-0 md:col-span-7">
              <Reveal delay={0.1}>
                <StoryVideoPlayer
                  src={chapter.video}
                  segments={chapter.segments}
                  label={chapter.quote}
                />
              </Reveal>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
