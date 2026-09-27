"use client";

import { useEffect, useLayoutEffect } from "react";
import type Lenis from "lenis";

type MotionSystemOptions = {
  motionKey: string;
  onScrolledChange: (scrolled: boolean) => void;
};

const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value));

// The live Lenis instance (desktop, motion allowed) so dialogs and navigation can drive it.
let activeLenis: Lenis | null = null;
let scrollLocks = 0;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Scroll to a section id (or the top), through Lenis when it is running. */
export function scrollToTarget(target: string, { immediate = false, offset = -76 } = {}) {
  const element = target === "top" ? null : document.getElementById(target);
  if (target !== "top" && !element) return;
  const instant = immediate || prefersReducedMotion();
  if (activeLenis) {
    activeLenis.scrollTo(element ?? 0, { offset: element ? offset : 0, duration: 1.1, immediate: instant, force: true });
    return;
  }
  const top = element ? element.getBoundingClientRect().top + window.scrollY + offset : 0;
  window.scrollTo({ top, behavior: instant ? "auto" : "smooth" });
}

/** Reference-counted page scroll lock for modal surfaces. */
export function setScrollLock(locked: boolean) {
  scrollLocks = Math.max(0, scrollLocks + (locked ? 1 : -1));
  const isLocked = scrollLocks > 0;
  document.body.classList.toggle("has-dialog", isLocked);
  if (isLocked) activeLenis?.stop();
  else activeLenis?.start();
}

/**
 * Shared motion controller: smooth scroll, one-time reveals, parallax, the
 * velocity marquee, the scroll-drawn connector, a progress bar, magnetic CTAs
 * and the fine-pointer cursor. Touch and reduced-motion users keep native
 * scrolling and a static, fully readable page. Lenis is loaded lazily so it
 * never blocks first paint or hydration.
 */
export function useMotionSystem({ motionKey, onScrolledChange }: MotionSystemOptions) {
  // Smooth scrolling lives for the whole page session, independent of view changes.
  useEffect(() => {
    const lightweightMode = window.matchMedia("(hover: none), (pointer: coarse), (max-width: 900px)").matches;
    if (prefersReducedMotion() || lightweightMode) return;
    let disposed = false;
    let lenis: Lenis | null = null;
    import("lenis").then(({ default: LenisClass }) => {
      if (disposed) return;
      lenis = new LenisClass({ autoRaf: true, anchors: false, lerp: 0.095, smoothWheel: true, wheelMultiplier: 0.9 });
      activeLenis = lenis;
      if (scrollLocks > 0) lenis.stop();
    }).catch(() => undefined);
    return () => {
      disposed = true;
      lenis?.destroy();
      if (activeLenis === lenis) activeLenis = null;
    };
  }, []);

  // Layout effect: freshly mounted views are classified before their first paint.
  useLayoutEffect(() => {
    const root = document.documentElement;
    const reducedMotion = prefersReducedMotion();
    const coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const compactViewport = window.matchMedia("(max-width: 900px)").matches;
    const lightweightMode = coarsePointer || compactViewport;
    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal], [data-card-reveal]"));
    const parallaxLayers = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    const lineSections = Array.from(document.querySelectorAll<HTMLElement>("[data-line-draw]"));
    const magneticTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
    const marqueeTrack = document.querySelector<HTMLElement>("[data-velocity-marquee] .discipline-track");
    const progressBar = document.querySelector<HTMLElement>(".scroll-progress");
    const cursor = document.querySelector<HTMLElement>(".custom-cursor");
    const scrollFx = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-fx]"));
    const reels = Array.from(document.querySelectorAll<HTMLElement>("[data-hscroll]"));
    const reelsEnabled = !reducedMotion && !lightweightMode && reels.length > 0;

    // Pinned horizontal reels: the section is as tall as its track is wide.
    const reelDistance = new Map<HTMLElement, number>();
    const measureReels = () => {
      reels.forEach((reel) => {
        const track = reel.querySelector<HTMLElement>("[data-hscroll-track]");
        if (!track) return;
        if (!reelsEnabled) {
          reel.style.height = "";
          track.style.transform = "";
          return;
        }
        const distance = Math.max(track.scrollWidth - window.innerWidth, 0);
        reelDistance.set(reel, distance);
        reel.style.height = `${distance + window.innerHeight}px`;
      });
    };
    root.classList.toggle("has-hscroll", reelsEnabled);
    measureReels();

    // One-time entrances. Content is visible in the server HTML; hiding only
    // starts once JS runs, and anything already on screen is marked first so
    // nothing above the fold ever flashes out.
    let revealObserver: IntersectionObserver | null = null;
    if (reducedMotion) {
      revealTargets.forEach((element) => element.classList.add("is-visible"));
      lineSections.forEach((element) => element.style.setProperty("--line-progress", "1"));
    } else {
      revealTargets.forEach((element) => {
        if (element.getBoundingClientRect().top < window.innerHeight * 0.95) element.classList.add("is-visible");
      });
      revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible", "reveal-in");
          observer.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -8%", threshold: 0.12 });
      revealTargets.forEach((element) => {
        if (!element.classList.contains("is-visible")) revealObserver?.observe(element);
      });
    }
    root.classList.toggle("motion-enabled", !reducedMotion);

    let lastScrolled = window.scrollY > 40;
    onScrolledChange(lastScrolled);
    let scrollFrame = 0;
    let marqueeFrame = 0;
    let marqueeRate = 1;
    let marqueeTargetRate = 1;
    let marqueeOffset = 0;
    let marqueeTime = window.performance.now();

    // Transform-only marquee loop; scroll velocity briefly raises its rate.
    const paintMarquee = (time: number) => {
      if (!marqueeTrack) return;
      const delta = Math.min(time - marqueeTime, 34);
      marqueeTime = time;
      marqueeRate += (marqueeTargetRate - marqueeRate) * 0.16;
      marqueeTargetRate += (1 - marqueeTargetRate) * 0.075;
      const loopWidth = marqueeTrack.scrollWidth / 2;
      marqueeOffset = loopWidth > 0 ? (marqueeOffset + delta * 0.035 * marqueeRate) % loopWidth : 0;
      marqueeTrack.style.transform = `translate3d(${-marqueeOffset}px, 0, 0)`;
      marqueeFrame = window.requestAnimationFrame(paintMarquee);
    };

    const renderScrollEffects = (scroll: number, velocity: number) => {
      const nextScrolled = scroll > 40;
      if (nextScrolled !== lastScrolled) {
        lastScrolled = nextScrolled;
        onScrolledChange(nextScrolled);
      }

      if (progressBar) {
        const range = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.transform = `scaleX(${range > 0 ? clamp(scroll / range, 0, 1) : 0})`;
      }

      // --p: 0→1 progress for scroll-linked CSS. "exit" measures an element
      // leaving the top of the viewport; "through" measures a full pass.
      // All geometry is read first, then all styles are written, so the
      // browser never has to recalculate layout in the middle of a frame.
      const viewport = window.innerHeight;
      const fxReads = reducedMotion ? [] : scrollFx.map((element) => {
        const bounds = element.getBoundingClientRect();
        return element.dataset.scrollFx === "exit"
          ? -bounds.top / Math.max(bounds.height, 1)
          : (viewport - bounds.top) / (viewport + bounds.height);
      });
      const reelReads = reelsEnabled ? reels.map((reel) => -reel.getBoundingClientRect().top) : [];
      const lineReads = reducedMotion ? [] : lineSections.map((section) => section.getBoundingClientRect());
      const parallaxReads = !reducedMotion && !lightweightMode ? parallaxLayers.map((layer) => layer.parentElement?.getBoundingClientRect() ?? null) : [];

      fxReads.forEach((progress, index) => scrollFx[index].style.setProperty("--p", clamp(progress, 0, 1).toFixed(4)));
      reelReads.forEach((top, index) => {
        const reel = reels[index];
        const track = reel.querySelector<HTMLElement>("[data-hscroll-track]");
        const distance = reelDistance.get(reel) ?? 0;
        if (!track || !distance) return;
        const progress = clamp(top / distance, 0, 1);
        track.style.transform = `translate3d(${(-progress * distance).toFixed(1)}px, 0, 0)`;
        reel.style.setProperty("--reel-p", progress.toFixed(4));
      });
      lineReads.forEach((bounds, index) => {
        const progress = clamp((viewport * 0.78 - bounds.top) / (bounds.height * 0.62), 0, 1);
        lineSections[index].style.setProperty("--line-progress", String(progress));
      });
      parallaxReads.forEach((bounds, index) => {
        if (!bounds) return;
        const progress = clamp((viewport - bounds.top) / (viewport + bounds.height), 0, 1) - 0.5;
        const distance = Number(parallaxLayers[index].dataset.parallax ?? 20);
        parallaxLayers[index].style.transform = `translate3d(0, ${progress * distance * 2}px, 0)`;
      });

      if (!reducedMotion && !lightweightMode) {
        marqueeTargetRate = 1 + Math.min(Math.abs(velocity) * 0.32, 3.2);
      }
    };

    const scheduleScrollEffects = (scroll: number, velocity: number) => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        renderScrollEffects(scroll, velocity);
        scrollFrame = 0;
      });
    };

    // Lenis drives the native scroll position, so one listener serves both modes.
    const onNativeScroll = () => scheduleScrollEffects(window.scrollY, activeLenis?.velocity ?? 0);
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    if (!reducedMotion && !lightweightMode && marqueeTrack) marqueeFrame = window.requestAnimationFrame(paintMarquee);

    // Transform-only cursor and magnetic CTAs, absent on touch/reduced motion.
    let cursorFrame = 0;
    let cursorX = -40;
    let cursorY = -40;
    let magnet: HTMLElement | null = null;
    let magnetX = 0;
    let magnetY = 0;
    const paintPointer = () => {
      if (cursor) cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      if (magnet) magnet.style.transform = `translate3d(${magnetX}px, ${magnetY}px, 0)`;
      cursorFrame = 0;
    };
    const releaseMagnet = () => {
      if (!magnet) return;
      magnet.style.transform = "";
      magnet = null;
    };
    const onPointerMove = (event: PointerEvent) => {
      cursorX = event.clientX;
      cursorY = event.clientY;
      const target = event.target instanceof Element ? event.target : null;

      const nextMagnet = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (nextMagnet !== magnet) releaseMagnet();
      if (nextMagnet) {
        const bounds = nextMagnet.getBoundingClientRect();
        magnet = nextMagnet;
        magnetX = clamp((event.clientX - (bounds.left + bounds.width / 2)) * 0.22, -10, 10);
        magnetY = clamp((event.clientY - (bounds.top + bounds.height / 2)) * 0.3, -8, 8);
      }

      if (cursor) {
        const overCard = Boolean(target?.closest(".mission, .work-row, .work-card"));
        const overAction = Boolean(target?.closest("a, button, input, [role='option']"));
        cursor.classList.toggle("is-card", overCard && !overAction);
        cursor.classList.toggle("is-action", overAction);
        cursor.classList.add("is-visible");
      }
      if (!cursorFrame) cursorFrame = window.requestAnimationFrame(paintPointer);
    };
    const onPointerLeave = () => {
      cursor?.classList.remove("is-visible", "is-card", "is-action");
      releaseMagnet();
    };
    if (!reducedMotion && !lightweightMode && (cursor || magneticTargets.length)) {
      if (cursor) root.classList.add("has-custom-cursor");
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
    }

    const onResize = () => {
      measureReels();
      scheduleScrollEffects(window.scrollY, 0);
    };
    window.addEventListener("resize", onResize);

    scheduleScrollEffects(window.scrollY, 0);

    return () => {
      window.removeEventListener("resize", onResize);
      reels.forEach((reel) => {
        reel.style.height = "";
        reel.querySelector<HTMLElement>("[data-hscroll-track]")?.style.removeProperty("transform");
      });
      root.classList.remove("has-hscroll");
      revealObserver?.disconnect();
      releaseMagnet();
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      window.cancelAnimationFrame(scrollFrame);
      window.cancelAnimationFrame(marqueeFrame);
      window.cancelAnimationFrame(cursorFrame);
      root.classList.remove("motion-enabled", "has-custom-cursor");
    };
  }, [motionKey, onScrolledChange]);
}
