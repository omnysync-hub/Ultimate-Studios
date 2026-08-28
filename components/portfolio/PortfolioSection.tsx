"use client";

import { useEffect, useRef, useState } from "react";
import { loadGsap } from "@/lib/gsap";
import { useInViewOnce } from "@/lib/useInViewOnce";
import type { Swiper as SwiperType } from "swiper";
import { EffectCoverflow } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { YouTubeVideo } from "@/lib/youtube";
import { YouTubeThumbnail } from "@/components/youtube/YouTubeThumbnail";
import styles from "./PortfolioSection.module.css";

type Props = {
  videos: YouTubeVideo[];
};

export function PortfolioSection({ videos }: Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const inView = useInViewOnce(rootRef);
  const swiperRef = useRef<SwiperType | null>(null);
  const [swiperStylesReady, setSwiperStylesReady] = useState(false);
  const slides = videos.length > 0 ? videos : [];
  const lastSlide = Math.max(slides.length - 1, 1);

  useEffect(() => {
    if (!inView) return;

    void Promise.all([
      import("swiper/css"),
      import("swiper/css/effect-coverflow")
    ]).then(() => setSwiperStylesReady(true));
  }, [inView]);

  useEffect(() => {
    if (!inView) return;

    const root = rootRef.current;
    if (!root) return;

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    void loadGsap().then(({ gsap }) => {
      if (cancelled || !root) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pin = root.querySelector<HTMLElement>("[data-portfolio-pin]");
    const heading = root.querySelector<HTMLElement>("[data-portfolio-heading]");
    const lines = root.querySelectorAll<SVGPathElement>("[data-draw-line]");
    const work = root.querySelector<HTMLElement>("[data-work-panel]");
    const stage = root.querySelector<HTMLElement>("[data-portfolio-stage]");

    if (reduce) {
      lines.forEach((line) => {
        line.style.strokeDasharray = "none";
        line.style.strokeDashoffset = "0";
      });
      if (work) gsap.set(work, { xPercent: 0 });
      gsap.set(
        root.querySelectorAll(
          "[data-work-eyebrow], [data-work-line], [data-work-copy], [data-work-cta]"
        ),
        { clearProps: "all", opacity: 1, y: 0, yPercent: 0 }
      );
      return;
    }

    lines.forEach((line) => {
      const len = line.getTotalLength();
      gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
    });

    gsap.set(heading, { y: 28, opacity: 0 });
    gsap.set(work, { xPercent: 100 });

    const workEyebrow = root.querySelector<HTMLElement>("[data-work-eyebrow]");
    const workLines = root.querySelectorAll<HTMLElement>("[data-work-line]");
    const workCopy = root.querySelector<HTMLElement>("[data-work-copy]");
    const workCta = root.querySelector<HTMLElement>("[data-work-cta]");
    const workSweep = root.querySelector<HTMLElement>("[data-work-sweep]");

    gsap.set(workEyebrow, { y: 16, opacity: 0 });
    gsap.set(workLines, { yPercent: 110 });
    gsap.set(workCopy, { y: 22, opacity: 0 });
    gsap.set(workCta, { y: 18, opacity: 0 });
    gsap.set(workSweep, { xPercent: -120, opacity: 0 });

    ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * (2.4 + lastSlide * 0.22))}`,
          pin: pin ?? true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const swiper = swiperRef.current;
            if (!swiper) return;

            const p = self.progress;
            const carouselP = gsap.utils.clamp(
              0,
              1,
              gsap.utils.mapRange(0.12, 0.68, 0, 1, p)
            );
            swiper.setProgress(carouselP, 0);
          }
        }
      });

      tl.to(heading, { y: 0, opacity: 1, duration: 0.12, ease: "none" }, 0);

      lines.forEach((line, i) => {
        tl.to(
          line,
          { strokeDashoffset: 0, duration: 0.14, ease: "none" },
          0.04 + i * 0.05
        );
      });

      tl.to({}, { duration: 0.5 }, 0.18);
      tl.to(work, { xPercent: 0, duration: 0.28, ease: "none" }, 0.68);

      if (stage) {
        tl.to(
          stage,
          { scale: 0.96, opacity: 0.55, duration: 0.28, ease: "none" },
          0.68
        );
      }

      // Work panel content choreography
      tl.to(workEyebrow, { y: 0, opacity: 1, duration: 0.1, ease: "none" }, 0.78);
      workLines.forEach((line, i) => {
        tl.to(line, { yPercent: 0, duration: 0.14, ease: "none" }, 0.8 + i * 0.05);
      });
      tl.to(workCopy, { y: 0, opacity: 1, duration: 0.12, ease: "none" }, 0.9);
      tl.to(workCta, { y: 0, opacity: 1, duration: 0.1, ease: "none" }, 0.94);
      tl.to(workSweep, { opacity: 0.7, duration: 0.02, ease: "none" }, 0.86);
      tl.to(workSweep, { xPercent: 120, duration: 0.14, ease: "none" }, 0.86);
      tl.to(workSweep, { opacity: 0, duration: 0.04, ease: "none" }, 0.98);
    }, root);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [inView, lastSlide]);

  return (
    <section
      ref={rootRef}
      id="work"
      className={styles.section}
      aria-labelledby="portfolio-heading"
    >
      <div className={styles.pin} data-portfolio-pin>
        <div className={styles.frame}>
          <div className={styles.stage} data-portfolio-stage>
            <header className={styles.header} data-portfolio-heading>
              <p className={styles.eyebrow}>Latest uploads</p>
              <h2 id="portfolio-heading" className={styles.title}>
                OUR WORK
              </h2>
              <svg
                className={styles.underline}
                viewBox="0 0 420 28"
                fill="none"
                aria-hidden="true"
              >
                <path
                  data-draw-line
                  d="M8 8 H412"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="square"
                />
                <path
                  data-draw-line
                  d="M48 20 H372"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                  opacity="0.55"
                />
              </svg>
            </header>

            <div className={styles.carouselWrap}>
              {slides.length > 0 && swiperStylesReady ? (
                <Swiper
                  onSwiper={(instance) => {
                    swiperRef.current = instance;
                  }}
                  effect="coverflow"
                  grabCursor
                  centeredSlides
                  slidesPerView="auto"
                  loop={false}
                  speed={0}
                  allowTouchMove
                  coverflowEffect={{
                    rotate: 38,
                    stretch: 0,
                    depth: 120,
                    modifier: 1,
                    slideShadows: true
                  }}
                  modules={[EffectCoverflow]}
                  className={styles.swiper}
                >
                  {slides.map((video) => (
                    <SwiperSlide key={video.videoId} className={styles.slide}>
                      <a
                        className={styles.card}
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className={styles.thumb}>
                          <YouTubeThumbnail
                            src={video.thumbnailUrl}
                            fallbackSrc={video.thumbnailFallbackUrl}
                            alt={video.title}
                            className={styles.thumbImg}
                          />
                          <span className={styles.play} aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </span>
                        </div>
                        <div className={styles.cardBody}>
                          <div className={styles.cardMeta}>
                            <span>YouTube</span>
                            <span>{video.publishedLabel}</span>
                          </div>
                          <h3 className={styles.cardTitle}>{video.title}</h3>
                        </div>
                      </a>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <p className={styles.empty}>
                  Latest uploads will appear here once the feed is available.
                </p>
              )}
            </div>

            <p className={styles.hint} aria-hidden="true">
              Scroll to move through the work
            </p>
          </div>

          <aside
            className={styles.workPanel}
            data-work-panel
            aria-labelledby="work-with-us-heading"
          >
            <div className={styles.workSweep} data-work-sweep aria-hidden="true" />
            <div className={styles.workInner}>
              <p className={styles.workEyebrow} data-work-eyebrow>
                Next chapter
              </p>
              <h2 id="work-with-us-heading" className={styles.workTitle}>
                <span className={styles.workLineClip}>
                  <span className={styles.workLine} data-work-line>
                    WORK
                  </span>
                </span>
                <span className={styles.workLineClip}>
                  <span className={styles.workLine} data-work-line>
                    WITH US
                  </span>
                </span>
              </h2>
              <p className={styles.workCopy} data-work-copy>
                From brand films to series worlds — if the idea needs weight,
                pace, and a team that ships — we&apos;re ready.
              </p>
              <a className={styles.workCta} href="/contact" data-work-cta>
                Start a project <span className={styles.workCtaArrow}>→</span>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
