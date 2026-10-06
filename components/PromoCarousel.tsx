"use client";

/* eslint-disable @next/next/no-img-element -- images are static and unoptimized (next.config) */
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { PromoBanner } from "@/lib/catalog";

const AUTOPLAY_MS = 10_000;

/**
 * The top-of-page promo billboard: full-bleed slides that advance every 10
 * seconds. Swipe (touch, trackpad, or mouse drag), the arrows, and the dots all
 * move it by hand. Autoplay rests while the pointer or focus is inside, while
 * the tab is hidden, when the visitor pauses it, and under reduced motion.
 */
export function PromoCarousel({ banners }: { banners: PromoBanner[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [reduced, setReduced] = useState(false);
  // Restarts the 10 s timer after any manual move.
  const [tick, setTick] = useState(0);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  const goTo = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el) return;
      const next = (i + banners.length) % banners.length;
      el.scrollTo({ left: next * el.clientWidth, behavior: reduced ? "auto" : "smooth" });
      setIndex(next);
      setTick((t) => t + 1);
    },
    [banners.length, reduced]
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (paused || hovering || reduced) return;
    const id = setTimeout(() => {
      if (document.visibilityState === "visible") goTo(index + 1);
      else setTick((t) => t + 1);
    }, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, paused, hovering, reduced, tick, goTo]);

  const onScroll = () => {
    const el = track.current;
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  // Mouse drag: native scroll-snap only swipes on touch and trackpads.
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || !track.current) return;
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const el = track.current;
    if (!d || !el) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 5) {
      d.moved = true;
      el.style.scrollSnapType = "none";
      el.scrollLeft = d.left - dx;
    }
  };
  const endDrag = (e: React.PointerEvent) => {
    const d = drag.current;
    const el = track.current;
    drag.current = null;
    if (!d || !el || !d.moved) return;
    const dx = e.clientX - d.x;
    const from = Math.round(d.left / el.clientWidth);
    el.style.scrollSnapType = "";
    goTo(Math.abs(dx) > el.clientWidth * 0.12 ? from + (dx < 0 ? 1 : -1) : from);
  };
  // A drag must not also follow the slide's link.
  const onClickCapture = (e: React.MouseEvent) => {
    if (track.current?.dataset.dragged === "1") {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Promo & info"
      className="group/car relative isolate bg-night"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={() => setHovering(true)}
      onBlurCapture={() => setHovering(false)}
    >
      <h1 className="sr-only">Karyalo PPOB: top up game, pulsa, dan tagihan</h1>
      <div
        ref={track}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={(e) => {
          onPointerMove(e);
          if (drag.current?.moved && track.current) track.current.dataset.dragged = "1";
        }}
        onPointerUp={(e) => {
          endDrag(e);
          // Clear after the click that follows pointerup has been swallowed.
          setTimeout(() => track.current && delete track.current.dataset.dragged, 0);
        }}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        onDragStart={(e) => e.preventDefault()}
        className="row-scroller flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain select-none"
        aria-live={paused || hovering || reduced ? "polite" : "off"}
      >
        {banners.map((b, i) => (
          <Slide key={b.id} banner={b} position={i + 1} total={banners.length} active={i === index} />
        ))}
      </div>

      {/* Arrows (pointer devices) */}
      <button
        type="button"
        onClick={() => goTo(index - 1)}
        aria-label="Promo sebelumnya"
        className="absolute left-3 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-night/50 text-white opacity-0 backdrop-blur transition-opacity hover:bg-night/80 focus-visible:opacity-100 group-hover/car:opacity-100 sm:flex"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        aria-label="Promo berikutnya"
        className="absolute right-3 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-night/50 text-white opacity-0 backdrop-blur transition-opacity hover:bg-night/80 focus-visible:opacity-100 group-hover/car:opacity-100 sm:flex"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots + pause, above the fade into the rows */}
      <div className="absolute inset-x-0 bottom-14 z-10 flex items-center gap-3 px-4 sm:bottom-20 sm:px-8">
        <div className="flex items-center gap-1.5">
          {banners.map((b, i) => (
            <button
              key={b.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Promo ${i + 1}: ${b.eyebrow}`}
              aria-current={i === index}
              className="relative h-1.5 overflow-hidden rounded-full bg-white/35 transition-all duration-300"
              style={{ width: i === index ? 36 : 14 }}
            >
              {i === index && (
                <span
                  key={`${index}-${tick}-${paused || hovering || reduced}`}
                  className="absolute inset-y-0 left-0 rounded-full bg-white"
                  style={
                    paused || hovering || reduced
                      ? { width: "100%" }
                      : { width: "100%", animation: `promo-progress ${AUTOPLAY_MS}ms linear` }
                  }
                />
              )}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Putar otomatis" : "Jeda putar otomatis"}
          className="flex size-7 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30"
        >
          {paused ? <Play size={13} /> : <Pause size={13} />}
        </button>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-warm-white" />
    </section>
  );
}

function Slide({ banner, position, total, active }: { banner: PromoBanner; position: number; total: number; active: boolean }) {
  const isHash = banner.href.startsWith("/#");
  const first = position === 1;
  const ctaClass =
    "inline-flex h-12 items-center gap-2 rounded-lg bg-white pl-5 pr-2 text-base font-bold text-night transition-[background-color,transform] hover:bg-white/85 active:scale-[0.98]";
  const cta = (
    <>
      {banner.cta}
      <span className="flex size-8 items-center justify-center rounded-md bg-karyalo-green text-white"><ArrowRight size={16} /></span>
    </>
  );

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${position} dari ${total}`}
      aria-hidden={!active}
      inert={!active}
      className="relative isolate flex min-h-[36rem] w-full shrink-0 snap-start items-end overflow-hidden bg-night md:min-h-[36rem] lg:min-h-[38rem]"
    >
      {/* Artwork: wide 21:9 from 640px up, a square crop of the main visual on phones */}
      <picture>
        <source media="(max-width: 639px)" srcSet={`/banners/${banner.id}-mobile.webp`} />
        <img
          src={`/banners/${banner.id}.webp`}
          alt=""
          draggable={false}
          loading={first ? "eager" : "lazy"}
          fetchPriority={first ? "high" : "auto"}
          className="absolute inset-x-0 top-0 -z-10 aspect-square w-full object-cover max-sm:max-h-[70%] sm:inset-0 sm:aspect-auto sm:h-full sm:object-[70%_center]"
        />
      </picture>
      {/* Legibility: fade to navy under the copy (bottom on phones, left on desktop) */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-night from-40% via-night/70 via-55% to-transparent to-75% sm:bg-gradient-to-r sm:from-night/85 sm:from-0% sm:via-night/40 sm:via-45% sm:to-transparent sm:to-65%" />

      <div className="relative w-full px-4 pb-24 pt-28 sm:max-w-[62%] sm:px-8 sm:pb-32 md:max-w-[54%] md:pt-24">
        <p className="mb-2 text-sm font-semibold" style={{ color: banner.accent ?? "var(--color-accent-cyan)" }}>{banner.eyebrow}</p>
        <h2 className="max-w-2xl text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-5xl xl:text-6xl">
          {banner.title} <span style={{ color: banner.accent ?? "var(--color-accent-cyan)" }}>{banner.highlight}</span>
        </h2>
        <p className="mt-3 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">{banner.body}</p>
        <div className="mt-6">
          {isHash ? (
            <a href={banner.href} className={ctaClass} draggable={false}>{cta}</a>
          ) : (
            <Link href={banner.href} className={ctaClass} draggable={false}>{cta}</Link>
          )}
        </div>
      </div>
    </div>
  );
}
