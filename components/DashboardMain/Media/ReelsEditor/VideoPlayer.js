import { useEffect, useRef, useState, useCallback } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { Play, Pause } from "lucide-react";
import BlockRenderer from "./BlockRenderer";
import { useCanvasStore } from "../context/CanvasStoreContext";
import SelectionOverlay from "../SharedComponent/SelectionOverlay";
import { forwardRef } from "react";
import { useImperativeHandle } from "react";
import {
  cornerHandles,
  textSideHandles,
  imageSideHandles,
} from "../utils/canvasUtils/canvasConfig";
import useCanvasInteraction from "../hooks/useCanvasInteraction";
import useCanvasSelection from "../hooks/useCanvasSelection";

const VideoPlayer = forwardRef(function VideoPlayer(
  {
    currentClip,
    currentTime,
    isPlaying,
    onPlayPause,
    onClipEnd,
    onTimeUpdate,
    clips,
    duration,
    onRequestSeek,
    zoom = 1,
    onCanvasClick,
    onToolbarCreateText = () => {},
    onToolbarClose = () => {},
    pageId = "video-page",
  },
  containerRef // 👈 NEW ref argument
) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [localTime, setLocalTime] = useState(0);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const stageRef = useRef(null);
  const stageContainerRef = useRef(null);
  const store = useCanvasStore();
  // overlay ref used to compute the player rect for toolbar anchoring
  const overlayRef = useRef(null);

  const { selectBlock, activeBlock, selectedIds } = useCanvasSelection({
    store,
  });

  // const safeZoom = Math.min(Math.max(zoom, 0.5), 3);

  // Refs to hold the latest callbacks/values
  const onTimeUpdateRef = useRef(onTimeUpdate);
  const onClipEndRef = useRef(onClipEnd);
  const currentClipRef = useRef(currentClip);
  const EPS_END = 0.05;

  useEffect(() => {
    onTimeUpdateRef.current = onTimeUpdate;
  }, [onTimeUpdate]);
  useEffect(() => {
    onClipEndRef.current = onClipEnd;
  }, [onClipEnd]);
  useEffect(() => {
    currentClipRef.current = currentClip;
  }, [currentClip]);

  // Initialize Video.js once
  useEffect(() => {
    if (!videoRef.current || playerRef.current) return;

    const player = videojs(videoRef.current, {
      controls: false,
      autoplay: false,
      preload: "auto",
      fluid: true,
      muted: false, // enforced below
      responsive: true,
    });

    playerRef.current = player;
    setIsPlayerReady(true);

    player.on("timeupdate", () => {
      const time = player.currentTime();
      setLocalTime(time);
      if (onTimeUpdateRef.current && currentClipRef.current) {
        onTimeUpdateRef.current(time, currentClipRef.current.id);
      }
    });

    player.on("ended", () => {
      if (onClipEndRef.current && currentClipRef.current) {
        onClipEndRef.current(currentClipRef.current.id);
      }
      // do NOT auto-seek to 0 here; we only restart on user action
    });

    player.on("error", () => {
      const err = player.error();
      if (err) console.warn("Video player error:", err);
    });

    player.on("play", () => {
      if (audioContext && audioContext.state === "suspended") {
        audioContext.resume().catch((err) => {
          console.warn("Failed to resume audio context:", err);
        });
      }
    });
  }, [audioContext]);

  // Helper: current source URL from player
  const getCurrentSourceUrl = () => {
    const p = playerRef.current;
    if (!p) return "";
    const cs = p.currentSource && p.currentSource();
    if (cs?.src) return cs.src;
    try {
      const s = p.src();
      if (typeof s === "string" && s) return s;
      if (Array.isArray(s) && s[0]?.src) return s[0].src;
      if (s?.src) return s.src;
    } catch {}
    return "";
  };

  // EFFECT A: prime next video while an image is active
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !isPlayerReady || !currentClip) return;
    if (currentClip.type !== "image") return;

    const nextVideo = (clips || [])
      .filter(
        (c) => c.type === "video" && c.startTime >= (currentClip.startTime ?? 0)
      )
      .sort((a, b) => a.startTime - b.startTime)[0];

    if (!nextVideo || !nextVideo.url) return;

    const currentSourceUrl = getCurrentSourceUrl();
    if (currentSourceUrl === nextVideo.url) return;

    playerRef.current.clipId = nextVideo.id;
    player.src({ src: nextVideo.url, type: nextVideo.mimeType || "video/mp4" });

    const onReady = () => {
      player.off("loadedmetadata", onReady);
      if (!player.paused()) player.pause();
    };

    if (player.readyState() >= 1) onReady();
    else player.one("loadedmetadata", onReady);
  }, [currentClip?.id, currentClip?.type, currentClip?.startTime, clips, isPlayerReady]);

  // EFFECT B: Load/Seek for the active clip (no reload when already primed)
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !currentClip || !isPlayerReady) return;

    if (currentClip.type === "image") {
      if (!player._imgPaused) {
        if (!player.paused()) player.pause();
        player._imgPaused = true;
      }
      return;
    }

    player._imgPaused = false;

    const currentSourceUrl = getCurrentSourceUrl();
    const urlChanged =
      !!currentClip.url && currentSourceUrl !== currentClip.url;
    const seekTo = Math.max(0, currentClip.relativeTime || 0);

    if (urlChanged) {
      playerRef.current.clipId = currentClip.id;
      player.src({
        src: currentClip.url,
        type: currentClip.mimeType || "video/mp4",
      });

      const onReady = () => {
        player.off("loadedmetadata", onReady);

        // enforce mute after tech swap
        const mediaEl =
          playerRef.current?.tech_?.el() ||
          playerRef.current?.el()?.querySelector("video");
        if (mediaEl) {
          mediaEl.muted = false;
          mediaEl.defaultMuted = false;
          mediaEl.volume = 1;
          try {
            if (mediaEl.audioTracks && mediaEl.audioTracks.length) {
              for (let i = 0; i < mediaEl.audioTracks.length; i++) {
                mediaEl.audioTracks[i].enabled = false;
              }
            }
          } catch {}
        }

        if (Math.abs((player.currentTime() ?? 0) - seekTo) > 0.02) {
          player.currentTime(seekTo);
        }
        if (isPlaying) {
          const p = player.play();
          if (p?.catch) p.catch(() => {});
        }
      };

      if (player.readyState() >= 1) onReady();
      else player.one("loadedmetadata", onReady);
    } else {
      const drift = Math.abs((player.currentTime() ?? 0) - seekTo);
      if (drift > 0.1) player.currentTime(seekTo);

      if (isPlaying) {
        if (player.paused()) {
          const p = player.play();
          if (p?.catch) p.catch(() => {});
        }
      } else {
        if (!player.paused()) player.pause();
      }

      if (playerRef.current.clipId !== currentClip.id) {
        playerRef.current.clipId = currentClip.id;
      }
    }
  }, [currentClip?.url, currentClip?.relativeTime, currentClip?.id, currentClip?.mimeType, isPlayerReady, isPlaying]);

  // EFFECT C: React to play/pause toggles (only when current clip’s src is set)
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !isPlayerReady || !currentClip) return;

    if (!player.currentSrc() || playerRef.current.clipId !== currentClip.id)
      return;

    if (isPlaying) {
      if (player.paused()) {
        const playPromise = player.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Play blocked:", err);
            if (err?.name === "NotAllowedError") onPlayPause();
          });
        }
      }
    } else {
      if (!player.paused()) player.pause();
    }
  }, [isPlaying, isPlayerReady, currentClip?.id, onPlayPause]);

  /** Enforce full mute on the real media element */
  useEffect(() => {
    if (!playerRef.current || !isPlayerReady) return;
    let mediaEl = null;
    try {
      mediaEl =
        playerRef.current.tech_?.el() ||
        playerRef.current.el()?.querySelector("video");
    } catch {}
    if (!mediaEl) return;
    mediaEl.muted = false;
    mediaEl.defaultMuted = false;
    mediaEl.volume = 1;
    try {
      if (mediaEl.audioTracks && mediaEl.audioTracks.length) {
        for (let i = 0; i < mediaEl.audioTracks.length; i++) {
          mediaEl.audioTracks[i].enabled = false;
        }
      }
    } catch {}
  }, [isPlayerReady]);

  /** Pause when not on a video */
  useEffect(() => {
    if (!playerRef.current || !isPlayerReady) return;
    const isVideo = currentClip?.type === "video";
    const player = playerRef.current;
    if (!isVideo) {
      try {
        if (!player.paused()) player.pause();
      } catch {}
    }
  }, [currentClip?.type, isPlayerReady]);

  // Manual play toggle
  const handleManualPlay = () => {
    if (!playerRef.current) {
      onPlayPause();
      return;
    }

    const atEnd =
      typeof duration === "number" &&
      typeof currentTime === "number" &&
      currentTime >= duration - EPS_END;

    if (atEnd) {
      // ask parent to move GLOBAL timeline to 0
      if (onRequestSeek) onRequestSeek(0);

      // also reset the HTML5 player if we're on a video
      try {
        if (currentClip?.type === "video") playerRef.current.currentTime(0);
      } catch {}
    }

    onPlayPause();
  };

  // Format mm:ss
  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.dispose();
        } catch {}
        playerRef.current = null;
      }
    };
  }, []);

  const displayTime =
    typeof duration === "number" &&
    typeof currentTime === "number" &&
    currentTime >= duration - 0.05
      ? duration // snap to full duration (0:11)
      : currentTime;

  // const [fit, setFit] = useState({
  //   sx: 1,
  //   sy: 1,
  //   logicalSize: { width: 1, height: 1 },
  //   canvasSize: { width: 1, height: 1 },
  // });

  const [, setTick] = useState(0);

  useEffect(() => {
    if (!store || typeof store.subscribe !== "function") return;
    const unsub = store.subscribe(() => setTick((t) => t + 1));
    return unsub;
  }, [store]);

  // useEffect(() => {
  //   if (!overlayRef.current || !store) return;

  //   function recomputeFit() {
  //     const rect = overlayRef.current.getBoundingClientRect();
  //     if (!rect) return;

  //     const logical = store.getPageLogicalSize?.(pageId) ??
  //       store.project?.pages?.find((p) => p.id === pageId)?.meta
  //         ?.logicalSize ?? { width: 1920, height: 1080 }; // final fallback

  //     const fitObj = computeMediaFit(
  //       { left: 0, top: 0, width: rect.width, height: rect.height },
  //       logical,
  //       "contain"
  //     );

  //     setFit({
  //       sx: fitObj.scaleX,
  //       sy: fitObj.scaleY,
  //       logicalSize: logical,
  //       canvasSize: { width: rect.width, height: rect.height },
  //     });
  //   }

  //   recomputeFit();
  //   window.addEventListener("resize", recomputeFit);
  //   return () => window.removeEventListener("resize", recomputeFit);
  // }, [store, pageId]);

  const logical = store.getPageLogicalSize?.(pageId) ?? {
    width: 1,
    height: 1,
  };

  const getFit = useCallback(() => {
    return {
      sx: 1,
      sy: 1,
      renderWidth: logical.width,
      renderHeight: logical.height,
      offsetX: 0,
      offsetY: 0,
      logicalSize: {
        width: logical.width,
        height: logical.height,
      },
    };
  }, [logical.width, logical.height]);

  useImperativeHandle(containerRef, () => ({
    getCanvasEl: () => overlayRef.current,
    getFit,
    getCanvasRect: () => {
      if (!overlayRef.current) return null;
      return overlayRef.current.getBoundingClientRect();
    },
  }));

  // Helper: read blocks for this page
  const getBlocks = () => {
    if (!store) return [];
    try {
      if (typeof store.getBlocksForPage === "function")
        return store.getBlocksForPage(pageId) || [];
      if (Array.isArray(store.blocks)) return store.blocks;
    } catch {}
    return [];
  };

  useEffect(() => {
    if (!overlayRef.current) return;

    console.log("Overlay parent:", overlayRef.current.offsetParent);
  }, []);

  // useEffect(() => {
  //   console.log("VIDEO FIT", fit);
  // }, [fit]);

  useEffect(() => {
    const fit = getFit();
    console.log("FIT CHECK", fit);
  }, [getFit]);

  const blocks = getBlocks();

  const { beginInteraction } = useCanvasInteraction({
    store,
    pageId,
    getFit,
  });

  // // Filter blocks to text blocks that should be visible at currentTime
  // const visibleTextBlocks = (blocks || []).filter((b) => {
  //   if (!b) return false;
  //   if (b.type !== "text") return false;
  //   // If block has time constraints, obey them. If duration is Infinity treat as always visible.
  //   const start = typeof b.startTime === "number" ? b.startTime : 0;
  //   const dur =
  //     typeof b.duration === "number"
  //       ? b.duration
  //       : typeof b.endTime === "number"
  //       ? b.endTime - start
  //       : Infinity;
  //   const inTime =
  //     typeof currentTime === "number"
  //       ? currentTime >= start && currentTime < start + dur
  //       : true;
  //   return inTime;
  // });

  const handleOverlayPointerDown = (e) => {
    // ✅ IMPORTANT: only handle true canvas clicks
    if (e.target !== e.currentTarget) return;

    e.stopPropagation();

    store.clearSelection?.();
    store.setSelectionMode("canvas");
    store.setActiveRect(null);

    const rect = overlayRef.current?.getBoundingClientRect?.();

    onCanvasClick?.({
      overlayRect: rect || null,
      x: rect ? Math.round(e.clientX - rect.left) : 0,
      y: rect ? Math.round(e.clientY - rect.top) : 0,
      clientX: e.clientX,
      clientY: e.clientY,
    });
  };

  // helper to click a block (select it in store)
  const handleClickBlock = (block, ev) => {
    ev.stopPropagation();
    if (!store) return;
    if (typeof store.select === "function") {
      store.select(block.id);
    }
    // also let parent know if needed
    if (typeof onToolbarCreateText === "function" && false) {
      // placeholder if you want VideoPlayer to open edit UI
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center bg-white rounded-lg p-2 w-[80%] h-[430px] mt-5"
    >
      {/* Video Display */}
      <div
        ref={stageContainerRef}
        style={{
          position: "relative",
          width: logical.width,
          height: logical.height,
          background: "black",
          overflow: "hidden",
        }}
        className=" rounded-lg mb-2 flex items-center justify-center"
      >
        <div className="w-full h-full flex items-center justify-center">
          {/* Keep video element mounted for Video.js stability */}
          <video
            ref={videoRef}
            className="video-js vjs-default-skin w-full h-full object-contain absolute inset-0"
            playsInline
            preload="auto"
            muted
          />
          {/* Image overlay shown when current clip is an image */}
          {currentClip?.type === "image" && (
            <img
              src={currentClip.url}
              alt={currentClip.fileName || "image"}
              className="absolute inset-0 w-full h-full object-contain z-10 transition-opacity duration-500"
              style={{ backgroundColor: "black" }}
            />
          )}
          {/* ------------------------------------------------------------- */}
          {/*                    CANVAS CLICK LAYER                        */}
          {/* ------------------------------------------------------------- */}
          <div
            ref={stageRef}
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "auto",
            }}
          >
            {/* THIS is the real canvas */}
            <div
              ref={overlayRef}
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 50,
              }}
              onPointerDown={handleOverlayPointerDown}
            >
              {(blocks || []).map((b) => {
                const start = b.startTime ?? 0;
                const dur = b.duration ?? Infinity;
                const visible =
                  typeof currentTime === "number"
                    ? currentTime >= start && currentTime < start + dur
                    : true;
                if (!visible) return null;

                return (
                  <BlockRenderer
                    key={b.id}
                    block={b}
                    pageId={pageId}
                    getFit={getFit}
                    onSelect={selectBlock}
                  />
                );
              })}

              {activeBlock && (
                <SelectionOverlay
                  block={activeBlock}
                  beginInteraction={beginInteraction}
                  onSelect={selectBlock}
                  getFit={getFit}
                  cornerHandles={cornerHandles}
                  sideHandles={
                    activeBlock.type === "text"
                      ? textSideHandles
                      : imageSideHandles
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 w-full max-w-4xl justify-center">
        <span className="text-black font-mono text-sm">
          {formatTime(displayTime || 0)}
        </span>

        <button
          onClick={handleManualPlay}
          className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-lg"
          disabled={!isPlayerReady}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white ml-1" />
          )}
        </button>

        <span className="text-black font-mono text-sm">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
});

export default VideoPlayer;
