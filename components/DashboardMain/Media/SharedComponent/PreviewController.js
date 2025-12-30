import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import VideoPlayer from "../ReelsEditor/VideoPlayer";
import importTimelineClipsFromMediaData from "../utils/adapters/importFromMediaData";

/**
 * PreviewController
 *
 * - Read-only playback engine
 * - Reuses SAME timeline adapter as editor
 * - No selection, no interaction, no toolbar
 */
export default function PreviewController({ projectData, pageId }) {
  /* -----------------------------------------
     1. Build timeline clips from saved JSON
  ------------------------------------------ */
  const { clips = [] } = useMemo(() => {
    if (!projectData) return { clips: [] };
    try {
      return importTimelineClipsFromMediaData(projectData);
    } catch (err) {
      console.error("Preview import failed:", err);
      return { clips: [] };
    }
  }, [projectData]);

  /* -----------------------------------------
     2. Playback state
  ------------------------------------------ */
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const clipsRef = useRef(clips);
  useEffect(() => {
    clipsRef.current = clips;
  }, [clips]);

  /* -----------------------------------------
     3. Compute total duration
  ------------------------------------------ */
  const duration = useMemo(() => {
    const visuals = clips.filter(
      (c) => c.type === "video" || c.type === "image"
    );
    if (!visuals.length) return 0;
    return Math.max(...visuals.map((c) => c.endTime || 0));
  }, [clips]);

  /* -----------------------------------------
     4. Find current visual clip (SAME logic)
  ------------------------------------------ */
  const EPS = 0.002;

  const getCurrentClip = useCallback(() => {
    const visuals = clipsRef.current
      .filter((c) => c.type === "video" || c.type === "image")
      .sort((a, b) => a.startTime - b.startTime);

    if (!visuals.length) return null;

    let active = visuals.find(
      (c) => currentTime >= c.startTime - EPS && currentTime < c.endTime - EPS
    );

    if (!active && currentTime >= duration - EPS) {
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
      mimeType: active.mimeType,
    };
  }, [currentTime, duration]);

  /* -----------------------------------------
     5. Image-safe playback loop
  ------------------------------------------ */
  useEffect(() => {
    if (!isPlaying) return;
    if (!clipsRef.current.length) return;

    let rafId;
    let last = performance.now();
    let running = true;

    const tick = (now) => {
      if (!running) return;

      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      setCurrentTime((prev) => {
        const visuals = clipsRef.current
          .filter((c) => c.type === "video" || c.type === "image")
          .sort((a, b) => a.startTime - b.startTime);

        if (!visuals.length) return prev;

        const active = visuals.find(
          (c) => prev >= c.startTime - EPS && prev < c.endTime - EPS
        );

        if (!active) {
          running = false;
          return duration;
        }

        const next = prev + dt;

        if (next < active.endTime - EPS) return next;

        const idx = visuals.findIndex((c) => c.id === active.id);
        if (idx < visuals.length - 1) {
          return visuals[idx + 1].startTime + EPS;
        }

        running = false;
        return active.endTime;
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isPlaying, duration]);

  /* -----------------------------------------
     6. Render VideoPlayer (PREVIEW MODE)
  ------------------------------------------ */
  return (
    <VideoPlayer
      mode="preview"
      pageId={pageId}
      clips={clips}
      currentClip={getCurrentClip()}
      currentTime={currentTime}
      isPlaying={isPlaying}
      duration={duration}
      onPlayPause={() => setIsPlaying((p) => !p)}
      onRequestSeek={(t) => setCurrentTime(Math.max(0, t))}
    />
  );
}
