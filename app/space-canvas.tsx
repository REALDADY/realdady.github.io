"use client";

import { useEffect, useRef } from "react";
import type { SceneAnchor, SpaceScene } from "./space-scene";

/** Depth (world z) the camera reaches as each section scrolls into view. */
const homeStops: Array<[string, number, string]> = [
  ["top", 0, "Launch"],
  ["about", -128, "Orbit"],
  ["work", -205, "Missions"],
  ["stack", -330, "Systems"],
  ["process", -438, "Trajectory"],
  ["lab", -516, "Lab"],
  ["contact", -566, "Transmission"],
];
const workStops: Array<[string, number, string]> = [
  ["top", 0, "Index"],
  ["project-index", -150, "Mission log"],
  ["lab-index", -470, "Lab"],
  ["contact", -566, "Transmission"],
];

/**
 * The fixed WebGL backdrop. SSR renders an empty, aria-hidden canvas plus a
 * CSS starfield; three.js loads only after the page is interactive, and never
 * blocks content. Scroll position flies the camera through the scene.
 */
export function SpaceCanvas({ view }: { view: "home" | "work" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SpaceScene | null>(null);
  const stopsRef = useRef(homeStops);

  const viewRef = useRef(view);

  useEffect(() => {
    viewRef.current = view;
    stopsRef.current = view === "work" ? workStops : homeStops;
    sceneRef.current?.setMode(view);
    window.dispatchEvent(new Event("space:layout"));
  }, [view]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const cores = navigator.hardwareConcurrency ?? 8;
    const lowPower = coarse || window.innerWidth < 900 || cores <= 4;
    const hud = {
      depth: document.querySelector<HTMLElement>("[data-hud='depth']"),
      velocity: document.querySelector<HTMLElement>("[data-hud='velocity']"),
      sector: document.querySelector<HTMLElement>("[data-hud='sector']"),
      bar: document.querySelector<HTMLElement>("[data-hud='bar']"),
      root: document.querySelector<HTMLElement>(".flight-hud"),
    };
    let disposed = false;
    let hudTick = 0;
    let lastSector = "";
    let movingUntil = 0;

    const computeAnchors = (): SceneAnchor[] => {
      const offset = window.innerHeight * 0.35;
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const anchors: SceneAnchor[] = [];
      stopsRef.current.forEach(([id, z]) => {
        const element = id === "top" ? null : document.getElementById(id);
        if (id !== "top" && !element) return;
        const scroll = element ? Math.min(element.getBoundingClientRect().top + window.scrollY - offset, maxScroll) : 0;
        if (!anchors.length || scroll > anchors[anchors.length - 1].scroll) anchors.push({ scroll: Math.max(scroll, 0), z });
      });
      const last = anchors[anchors.length - 1];
      if (last.scroll < maxScroll) anchors.push({ scroll: maxScroll, z: last.z - 4 });
      return anchors;
    };

    const sectorFor = (z: number) => {
      const stops = stopsRef.current;
      let label = stops[0][2];
      let index = 0;
      stops.forEach(([, stopZ, name], stopIndex) => {
        if (z <= stopZ + 30) { label = name; index = stopIndex; }
      });
      return `${String(index).padStart(2, "0")} · ${label}`;
    };

    const onFrame = ({ z, velocity }: { z: number; velocity: number }) => {
      hudTick = (hudTick + 1) % 4;
      if (hudTick) return;
      if (hud.depth) hud.depth.textContent = `${Math.abs(z).toFixed(1).padStart(5, "0")} ly`;
      if (hud.velocity) hud.velocity.textContent = `${(Math.min(Math.abs(velocity), 999) / 100).toFixed(2)} c`;
      // The HUD reports the flight: visible while moving, gone once you stop to read.
      const now = performance.now();
      if (Math.abs(velocity) > 8 && Math.abs(z) > 16) movingUntil = now + 1200;
      hud.root?.classList.toggle("is-active", now < movingUntil);
      if (hud.bar) hud.bar.style.transform = `scaleX(${Math.min(Math.abs(z) / 566, 1)})`;
      const sector = sectorFor(z);
      if (hud.sector && sector !== lastSector) { hud.sector.textContent = sector; lastSector = sector; }
    };

    let scene: SpaceScene | null = null;
    const onScroll = () => scene?.setScroll(window.scrollY);
    const onResize = () => {
      if (!scene) return;
      scene.resize(window.innerWidth, window.innerHeight);
      scene.setAnchors(computeAnchors());
    };
    const onPointer = (event: PointerEvent) => scene?.setPointer(event.clientX / window.innerWidth * 2 - 1, event.clientY / window.innerHeight * 2 - 1);
    const onVisibility = () => (document.hidden ? scene?.stop() : scene?.start());
    const resizeObserver = new ResizeObserver(() => scene?.setAnchors(computeAnchors()));

    const boot = async () => {
      try {
        const { createSpaceScene } = await import("./space-scene");
        if (disposed) return;
        scene = createSpaceScene(canvas, { lowPower, reducedMotion, onFrame });
        sceneRef.current = scene;
        scene.setMode(viewRef.current);
        scene.resize(window.innerWidth, window.innerHeight);
        scene.setAnchors(computeAnchors());
        scene.setScroll(window.scrollY);
        scene.start();
        canvas.classList.add("is-ready");
        document.documentElement.classList.add("has-space");
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize);
        window.addEventListener("space:layout", onResize);
        if (!coarse && !reducedMotion) window.addEventListener("pointermove", onPointer, { passive: true });
        document.addEventListener("visibilitychange", onVisibility);
        resizeObserver.observe(document.body);
      } catch {
        // No WebGL: the CSS starfield stays as the backdrop.
        canvas.remove();
      }
    };

    // Let the content paint and hydrate first; the universe can wait a beat.
    const canIdle = "requestIdleCallback" in window;
    const handle = canIdle ? window.requestIdleCallback(() => void boot(), { timeout: 900 }) : window.setTimeout(() => void boot(), 120);

    return () => {
      disposed = true;
      if (canIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("space:layout", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      resizeObserver.disconnect();
      scene?.dispose();
      sceneRef.current = null;
      document.documentElement.classList.remove("has-space");
    };
  }, []);

  return (
    <div className="space" aria-hidden="true">
      <div className="space-fallback" />
      <canvas ref={canvasRef} className="space-canvas" />
      <div className="space-vignette" />
    </div>
  );
}

/** Mission-control readout pinned to the viewport; written to directly by the scene loop. */
export function FlightHud() {
  return (
    <div className="flight-hud" aria-hidden="true">
      <div className="hud-row"><span>Sector</span><b data-hud="sector">00 · Launch</b></div>
      <div className="hud-row"><span>Depth</span><b data-hud="depth">000.0 ly</b></div>
      <div className="hud-row"><span>Velocity</span><b data-hud="velocity">0.00 c</b></div>
      <div className="hud-track"><i data-hud="bar" /></div>
    </div>
  );
}
