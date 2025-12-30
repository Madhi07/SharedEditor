// utils/videoEditorCore.js
import { useState, useRef, useEffect, useCallback } from "react";

export function useVideoEditorCore({
  initialClips,
  initialTextBlocks,
  EPS = 0.002,
  MAX_DT = 0.05,
  onClipEnd,
  canvasStore,
}) {
  const [clips, setClips] = useState(
    Array.isArray(initialClips) ? initialClips : []
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const clipsRef = useRef(clips);
  const isPreview = canvasStore?.editor === "preview";
  useEffect(() => {
    clipsRef.current = clips;
  }, [clips]);

  console.log("initialTextblocks", initialTextBlocks);
  console.log("initialClips", initialClips);

  /* ---------- duration ---------- */
  useEffect(() => {
    const visuals = clips.filter(
      (c) => c.type === "video" || c.type === "image"
    );
    if (!visuals.length) return;
    setTotalDuration(Math.max(...visuals.map((c) => c.endTime)));
  }, [clips]);

  useEffect(() => {
    if (!canvasStore) return;
    if (!initialTextBlocks?.length) return;

    initialTextBlocks.forEach((tb) => {
      if (canvasStore.getBlockById?.(tb.id)) return;

      canvasStore.addTextBlock(tb.pageId, {
        id: tb.id,
        x: tb.position?.x ?? 50,
        y: tb.position?.y ?? 50,
        text: tb.text,
        style: tb.style,
        width: tb.size?.width,
        height: tb.size?.height,
        zIndex: tb.zIndex,
      });
    });
  }, [initialTextBlocks, canvasStore]);

  /* ---------- current clip ---------- */
  const getCurrentClip = useCallback(() => {
    const visuals = clipsRef.current
      .filter((c) => c.type === "video" || c.type === "image")
      .sort((a, b) => a.startTime - b.startTime);

    let active = visuals.find(
      (c) => currentTime >= c.startTime - EPS && currentTime < c.endTime - EPS
    );

    if (!active && currentTime >= totalDuration - EPS) {
      active = visuals[visuals.length - 1];
    }
    if (!active) return null;

    const relativeTime = Math.max(
      0,
      currentTime - active.startTime + (active.trimStart || 0)
    );

    return {
      id: active.id,
      url: active.url,
      type: active.type,
      startTime: active.startTime,
      relativeTime,
      hasAudio: active.hasAudio,
    };
  }, [currentTime, totalDuration, EPS]);

  /* ---------- image playback loop ---------- */
  useEffect(() => {
    if (!isPlaying) return;

    let raf;
    let last = performance.now();
    let running = true;

    const tick = (now) => {
      if (!running) return;

      const dt = Math.min(MAX_DT, (now - last) / 1000);
      last = now;

      setCurrentTime((prev) => {
        const visuals = clipsRef.current
          .filter((c) => c.type === "video" || c.type === "image")
          .sort((a, b) => a.startTime - b.startTime);

        const active = visuals.find(
          (c) => prev >= c.startTime - EPS && prev < c.endTime - EPS
        );

        if (!active) {
          const visualsSorted = visuals;

          if (!visualsSorted.length) {
            running = false;
            return prev;
          }

          const first = visualsSorted[0];

          // If before first visual → snap INTO it
          if (prev < first.startTime - EPS) {
            return first.startTime + EPS;
          }

          // If after last visual → stop at end (no jump during play)
          const last = visualsSorted[visualsSorted.length - 1];
          if (prev >= last.endTime - EPS) {
            running = false;
            return last.endTime;
          }

          // Otherwise: stay put (no teleport)
          return prev;
        }

        if (active.type === "video") return prev;

        const next = prev + dt;
        if (next < active.endTime - EPS) return next;

        const idx = visuals.findIndex((c) => c.id === active.id);
        if (idx < visuals.length - 1) {
          return visuals[idx + 1].startTime + EPS;
        }

        running = false;
        onClipEnd?.(active.id);
        return active.endTime;
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isPlaying, onClipEnd, EPS, MAX_DT, totalDuration]);

  return {
    clips,
    setClips,
    currentTime,
    initialTextBlocks,
    setCurrentTime,
    isPlaying,
    setIsPlaying,
    totalDuration,
    setTotalDuration,
    getCurrentClip,
  };
}
