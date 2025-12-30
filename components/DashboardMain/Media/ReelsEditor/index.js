// pages/index.js
import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { observer } from "mobx-react-lite";
import VideoPlayer from "./VideoPlayer";
import { useVideoEditorCore } from "../utils/videoEditorCore";
import Timeline from "./Timeline";
import SelectionToolbar from "../SharedComponent/SelectionToolbar";
import importTimelineClipsFromMediaData from "../utils/adapters/importFromMediaData";
import exportToMediaData from "../utils/adapters/exportToMediaData";
import {
  useCanvasStore,
  useCanvasStoreReactive,
} from "../context/CanvasStoreContext";
import { fontFamilies } from "../utils/canvasUtils/canvasConfig";
import * as editorActions from "../utils/canvasUtils/editorActions";
// import MediaUploader from "./MediaUploader";
// import { Toolbar } from "./Toolbar";
import {
  extractThumbnailFromVideo,
  getImageThumbnail,
} from "@/utils/thumbnailExtractor";
import useCanvasSelection from "../hooks/useCanvasSelection";

import AudioPlayer from "./AudioPlayer";

async function fetchExternalClips() {
  try {
    const resp = await fetch("/api/clips");
    if (!resp.ok) return [];
    const data = await resp.json();
    return data?.clips || [];
  } catch (err) {
    console.debug("failed to load external clips:", err);
    return [];
  }
}

const RealEditor = forwardRef(function RealEditor({ ClipsData }, ref) {
  // const [clips, setClips] = useState([
  //   {
  //     id: "default-clip",
  //     type: "video",
  //     url: "/parameters_example.mp4",
  //     fileName: "parameters_example.mp4",
  //     mimeType: "video/mp4",
  //     duration: 10,
  //     startTime: 0,
  //     endTime: 10,
  //     trimStart: 0,
  //     trimEnd: 0,
  //     hasAudio: true,
  //     thumbnail: null,
  //     track: 0,
  //   },
  // ]);
  const isPlayingRef = useRef(false);

  const { initialTimelineClips, initialCanvasTextBlocks } = useMemo(() => {
    if (!ClipsData) {
      return { initialTimelineClips: [], initialCanvasTextBlocks: [] };
    }

    try {
      const result = importTimelineClipsFromMediaData(ClipsData);

      return {
        initialTimelineClips: result?.clips || [],
        initialCanvasTextBlocks: result?.textBlocks || [],
      };
    } catch {
      return { initialTimelineClips: [], initialCanvasTextBlocks: [] };
    }
  }, [ClipsData]);

  const handleClipEnd = useCallback((endedClipId) => {
    const visualClips = clipsRef.current
      .filter((c) => c.type === "video" || c.type === "image")
      .sort((a, b) => a.startTime - b.startTime);

    const idx = visualClips.findIndex((c) => c.id === endedClipId);

    if (idx !== -1 && idx < visualClips.length - 1) {
      const nextClip = visualClips[idx + 1];

      setSelectedClipId(nextClip.id);

      const startInside =
        nextClip.type === "image"
          ? nextClip.startTime + EPS
          : nextClip.startTime;

      setCurrentTime(startInside);

      // ✅ SAFE: read from ref, not closure
      if (isPlayingRef.current) {
        setTimeout(() => setIsPlaying(true), 50);
      }
    } else {
      setIsPlaying(false);
      stopAllAudio();
    }
  }, []);
   const canvasStore = useCanvasStoreReactive();

  const {
    clips,
    setClips,
    currentTime,
    setCurrentTime,
    isPlaying,
    setIsPlaying,
    totalDuration,
    setTotalDuration,
    getCurrentClip,
  } = useVideoEditorCore({
    initialClips: initialTimelineClips,
    initialTextBlocks: initialCanvasTextBlocks,
    onClipEnd: handleClipEnd,
    canvasStore,
  });

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);
  const pageId = "video-page";
  const [selectedClipId, setSelectedClipId] = useState("default-clip");
  // const [currentTime, setCurrentTime] = useState(0);
  // const [isPlaying, setIsPlaying] = useState(false);
  // const [totalDuration, setTotalDuration] = useState(10);
  const [importedTextBlocks, setImportedTextBlocks] = useState([]);
  const [videoZoom, setVideoZoom] = useState(1);
  const [seekAudio, setSeekAudio] = useState(0);
  const [externalClipsJson, setExternalClipsJson] = useState(() => {
    try {
      const base = Array.isArray(ClipsData) ? ClipsData : [ClipsData];
      if (typeof structuredClone === "function") return structuredClone(base);
      return JSON.parse(JSON.stringify(base));
    } catch {
      return Array.isArray(ClipsData) ? ClipsData : [ClipsData];
    }
  });

  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [toolbarAnchor, setToolbarAnchor] = useState({ left: 0, top: 0 });
  const [lastCanvasClick, setLastCanvasClick] = useState(null);
  const toolbarRef = useRef(null);
  const videoPlayerContainerRef = useRef(null);
  // const canvasRef = useRef(null);

  // const getFitRef = useRef(null);
  const EPS = 0.002;
  const MAX_DT = 0.05;
  const justSeekedIntoImageRef = useRef(false);
  const clipsRef = useRef(clips);
  useEffect(() => {
    clipsRef.current = clips;
  }, [clips]);
  const lastVisualIdRef = useRef(null);
  const enteredImageRef = useRef(false);
  const totalDurationRef = useRef(totalDuration);
  useEffect(() => {
    totalDurationRef.current = totalDuration;
  }, [totalDuration]);

  console.log(
    "ClipsData*******___________",
    ClipsData,
    Array.isArray(ClipsData)
  );

  // ----- create shared canvasStore for annotations (single page "video-page") -----
 

  // const canvas = useCanvasStoreReactive();

  const { activeBlock, selectBlock } = useCanvasSelection({
    store: canvasStore,
    isGroupId: canvasStore.isGroupId,
  });

  // const { beginInteraction } = useCanvasInteraction({
  //   store: canvasStore,
  //   pageId,
  //   getFit: () => getFitRef.current?.(),
  //   commit: (info) => {
  //     console.log("COMMIT", info);
  //   },
  // });

  // ---- new: track last manual selection so auto-select won't instantly override
  const lastManualSelectRef = useRef(0);

  const audioPlayerRef = useRef(null);

  const stopAllAudio = useCallback(() => {
    audioPlayerRef.current?.stopAll?.();
  }, []);

  useEffect(() => {
    console.log("clips data", clips);
  }, [clips]);

  // ---------- DEFAULT CLIP METADATA LOADER (uses memoized externalHasVisuals)
  // useEffect(() => {
  //   // If external visuals exist, keep original behaviour: skip default clip load
  //   if (externalHasVisuals) {
  //     return;
  //   }

  //   const defaultClip = clips.find((c) => c.id === "default-clip");
  //   if (!defaultClip) return;

  //   const loadDefaultMetadata = async () => {
  //     try {
  //       const video = document.createElement("video");
  //       video.src = defaultClip.url;
  //       video.crossOrigin = "anonymous";

  //       video.onloadedmetadata = async () => {
  //         const durationSec = video.duration;

  //         let thumbnail = null;
  //         try {
  //           const response = await fetch(defaultClip.url);
  //           const blob = await response.blob();
  //           thumbnail = await extractThumbnailFromVideo(blob, 1);
  //           if (thumbnail) new Image().src = thumbnail;
  //         } catch (err) {
  //           console.warn("⚠️ Failed to extract default video thumbnail:", err);
  //         }

  //         updateClips(
  //           (clipsRef.current || []).map((c) =>
  //             c.id === "default-clip"
  //               ? {
  //                   ...c,
  //                   duration: durationSec,
  //                   endTime: durationSec,
  //                   thumbnail,
  //                 }
  //               : c
  //           )
  //         );
  //         setTotalDuration(durationSec);
  //       };
  //     } catch (err) {
  //       console.error("Failed to load default video metadata:", err);
  //     }
  //   };

  //   // run loader
  //   loadDefaultMetadata();
  //   // intentionally only re-run if externalHasVisuals changes (it won't after mount in normal flow)
  // }, [externalHasVisuals]); // run once on mount / if externalHasVisuals changes

  useImperativeHandle(ref, () => ({
    async save() {
      if (!ClipsData?.id) {
        throw new Error("Cannot save: ClipsData.id is missing");
      }

      const exportJson = exportToMediaData({
        slidesSource: ClipsData,
        clips,
        canvasStore,
      });

      console.log(" EXPORT JSON", exportJson.data);
      console.log("clipsData Id", ClipsData);

      const res = await fetch(
        `https://media-v2.episyche.com/media/reels/${ClipsData.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(exportJson.data),
        }
      );

      const responseText = await res.text();
      console.log("❌ SAVE RESPONSE STATUS:", res.status);
      console.log("❌ SAVE RESPONSE BODY:", responseText);

      if (!res.ok) {
        throw new Error(responseText || "Failed to save media");
      }

      return exportJson.data;
    },
  }));

  // useEffect(() => {
  //   if (!clips.length) return;

  //   const visualClips = clips.filter(
  //     (c) => c.type === "video" || c.type === "image"
  //   );
  //   const maxVisualEnd =
  //     visualClips.length > 0
  //       ? Math.max(...visualClips.map((c) => c.endTime))
  //       : 0;

  //   setTotalDuration(maxVisualEnd);
  // }, [clips]);

  // reorder visuals, auto-reflow them sequentially, and update app-state and external JSON
  const commitMoveAndSync = useCallback(
    (clipId, finalStart) => {
      // Update the moved clip's start/end in the clips state
      setClips((prev) => {
        const prevCopy = prev.map((c) => ({ ...c }));
        const target = prevCopy.find((c) => c.id === clipId);
        if (!target) return prev;

        const duration = Math.max(
          0.001,
          (target.duration || target.endTime - target.startTime) -
            (target.trimStart || 0) -
            (target.trimEnd || 0)
        );
        target.startTime = finalStart;
        target.endTime = finalStart + duration;

        // 1) sort visuals by start time, 2) auto-reflow visuals sequentially (pack)
        const visuals = prevCopy
          .filter((c) => c.type === "video" || c.type === "image")
          .sort((a, b) => a.startTime - b.startTime || (a.id > b.id ? 1 : -1));

        let cur = 0;
        const reflowedVisuals = visuals.map((v) => {
          const len = Math.max(
            0.001,
            v.duration - (v.trimStart || 0) - (v.trimEnd || 0)
          );
          const newV = { ...v, startTime: cur, endTime: cur + len };
          cur += len;
          return newV;
        });

        // replace visuals in prevCopy with reflowed visuals (keep non-visuals unchanged)
        const nonVisuals = prevCopy.filter(
          (c) => !(c.type === "video" || c.type === "image")
        );
        const merged = [...reflowedVisuals, ...nonVisuals];

        // update tracks for audio layers (reuse your helper)
        return assignTracks(merged);
      });

      // After setClips (state update queued), schedule a sync to ClipsData JSON
      // Use timeout 0 to run after state update was applied
      setTimeout(() => {
        // read current clipsRef which is kept in sync via clipsRef.current
        syncClipsToClipsData(clipsRef.current);
      }, 0);
    },
    [
      /* no deps required (fixAudioTrackLayers is hoisted) */
    ]
  );

  // Build a new ClipsData structure from app clips (visual order -> slides order)
  const syncClipsToClipsData = useCallback(async (currentClips) => {
    if (!currentClips || !currentClips.length) return;

    const deepClone = (o) => {
      try {
        return typeof structuredClone === "function"
          ? structuredClone(o)
          : JSON.parse(JSON.stringify(o));
      } catch {
        return JSON.parse(JSON.stringify(o));
      }
    };

    // 1) visuals only, in timeline order
    const visuals = [...currentClips]
      .filter((c) => c.type === "video" || c.type === "image")
      .sort((a, b) => a.startTime - b.startTime || (a.id > b.id ? 1 : -1));

    // Build top-level audio lookup so we can copy durations when present
    const topLevelAudioByUrl = new Map();
    const topLevelAudioByFile = new Map();
    currentClips
      .filter((c) => c.type === "audio")
      .forEach((a) => {
        if (a.url) topLevelAudioByUrl.set(a.url, a);
        if (a.fileName) topLevelAudioByFile.set(a.fileName, a);
        if (a.url) {
          const parts = a.url.split("/");
          const last = parts[parts.length - 1];
          if (last) topLevelAudioByFile.set(last, a);
        }
      });

    // small helper to test images
    const isLikelyImage = (url) => {
      if (!url || typeof url !== "string") return false;
      if (url.startsWith("data:image/")) return true;
      return /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(url);
    };

    // 2) map visuals -> slides
    const newSlides = visuals.map((v, idx) => {
      const visibleLen = Math.max(
        0,
        Number(v.endTime - v.startTime || v.duration || 0)
      );
      const visibleLenRounded = Number(visibleLen.toFixed(2));

      if (v._rawSlide) {
        const clone = deepClone(v._rawSlide);

        // update durations
        if (v.type === "image") {
          if (!clone.image) clone.image = {};
          clone.image.image_duration = visibleLenRounded;
        } else if (v.type === "video") {
          if (!clone.video) clone.video = {};
          clone.video.video_duration = visibleLenRounded;

          // write back canonical video_thumbnail only if v.thumbnail looks like an image
          if (v.thumbnail && isLikelyImage(v.thumbnail)) {
            clone.video.video_thumbnail = v.thumbnail;
          } else {
            // if no valid thumbnail on clip, keep whatever existing clone.video.video_thumbnail is (do not delete)
          }
        }

        // copy top-level audio duration if a matching top-level audio clip exists
        if (clone.audio && clone.audio.audio_url) {
          const audioUrl = clone.audio.audio_url;
          const fileNameFromUrl = audioUrl ? audioUrl.split("/").pop() : null;

          const match =
            (audioUrl && topLevelAudioByUrl.get(audioUrl)) ||
            (fileNameFromUrl && topLevelAudioByFile.get(fileNameFromUrl)) ||
            null;

          if (
            match &&
            typeof match.duration === "number" &&
            isFinite(match.duration)
          ) {
            clone.audio.duration = Number(match.duration.toFixed(2));
          } else {
            // leave clone.audio.duration unchanged if it existed; do not overwrite with visual length
          }
        }

        if (typeof clone.slide_number !== "undefined")
          clone.slide_number = idx + 1;
        return clone;
      }

      // fallback slide
      return {
        uuid: v.id,
        slide_number: idx + 1,
        ...(v.type === "image"
          ? { image: { image_url: v.url, image_duration: visibleLenRounded } }
          : {}),
        ...(v.type === "video"
          ? {
              video: {
                video_url: v.url,
                video_duration: visibleLenRounded,
                video_thumbnail: isLikelyImage(v.thumbnail)
                  ? v.thumbnail
                  : null,
              },
            }
          : {}),
        audio: undefined,
      };
    });

    // 3) build final JSON shape and set to memory
    const original =
      Array.isArray(ClipsData) && ClipsData.length ? ClipsData[0] : null;
    let newJson;
    if (
      original &&
      typeof original === "object" &&
      Array.isArray(original.slides)
    ) {
      newJson = [{ ...deepClone(original), slides: newSlides }];
    } else {
      newJson = [{ slides: newSlides }];
    }

    setExternalClipsJson(newJson);

    // debug
    // console.log(
    //   "Synced ClipsData -> new slides (video thumbnails + durations):",
    //   newSlides.map((s) => ({
    //     id: s.uuid || s.image?.image_url || s.video?.video_url,
    //     image_duration: s.image?.image_duration,
    //     video_duration: s.video?.video_duration,
    //     audio_duration: s.audio?.duration,
    //     video_thumbnail: s.video?.video_thumbnail,
    //   }))
    // );
  }, []);

  // const handleClipEnd = useCallback(
  //   (endedClipId) => {
  //     const visualClips = clipsRef.current
  //       .filter((c) => c.type === "video" || c.type === "image")
  //       .sort((a, b) => a.startTime - b.startTime);

  //     const idx = visualClips.findIndex((c) => c.id === endedClipId);

  //     if (idx !== -1 && idx < visualClips.length - 1) {
  //       const nextClip = visualClips[idx + 1];

  //       setSelectedClipId(nextClip.id);
  //       const startInside =
  //         nextClip.type === "image"
  //           ? nextClip.startTime + EPS
  //           : nextClip.startTime;
  //       setCurrentTime(startInside);

  //       if (isPlaying) setTimeout(() => setIsPlaying(true), 50);
  //     } else {
  //       setIsPlaying(false);
  //       stopAllAudio();
  //     }
  //   },
  //   [isPlaying, stopAllAudio]
  // );

  const handleMediaUpload = async (file, type) => {
    const url = URL.createObjectURL(file);

    const getDuration = () =>
      new Promise((resolve) => {
        if (type === "image") return resolve(3);
        const media =
          type === "video"
            ? document.createElement("video")
            : document.createElement("audio");
        media.src = url;
        media.onloadedmetadata = () => resolve(media.duration || 0);
      });

    const duration = await getDuration();

    let startTime = 0;
    let track = 0;
    if (type === "video" || type === "image") {
      const visualClips = clipsRef.current.filter(
        (c) => c.type === "video" || c.type === "image"
      );
      startTime =
        visualClips.length > 0
          ? Math.max(...visualClips.map((c) => c.endTime))
          : 0;
      track = 0;
    } else if (type === "audio") {
      const audioClips = clipsRef.current.filter((c) => c.type === "audio");
      startTime =
        audioClips.length > 0
          ? Math.max(...audioClips.map((c) => c.endTime))
          : 0;

      const usedTracks = new Set(audioClips.map((c) => c.track));
      let nextTrack = 0;
      while (usedTracks.has(nextTrack)) nextTrack++;
      track = nextTrack;
    }

    let thumbnail = null;
    try {
      if (type === "video")
        thumbnail = await extractThumbnailFromVideo(file, 1);
      else if (type === "image") thumbnail = await getImageThumbnail(file);
      if (thumbnail) new Image().src = thumbnail;
    } catch (error) {
      console.error("Thumbnail extraction failed:", error);
    }

    const newClip = {
      id: `clip-${Date.now()}`,
      type,
      url,
      fileName: file.name,
      mimeType: file.type || (type === "audio" ? "audio/mpeg" : "video/mp4"),
      duration,
      startTime,
      endTime: startTime + duration,
      trimStart: 0,
      trimEnd: 0,
      hasAudio: type === "video" || type === "audio",
      thumbnail,
      track,
    };

    setClips((prev) => assignTracks([...prev, newClip]));

    if (!selectedClipId) setSelectedClipId(newClip.id);
  };

  const handleSplitAudio = (clipId, splitTime) => {
    setClips((prevClips) => {
      const updated = [...prevClips];
      const index = updated.findIndex((c) => c.id === clipId);
      if (index === -1) return updated;

      const clip = updated[index];

      if (
        splitTime <= clip.startTime + 0.05 ||
        splitTime >= clip.endTime - 0.05
      )
        return updated;

      const totalVisibleDuration =
        clip.duration - clip.trimStart - clip.trimEnd;
      const splitOffset = splitTime - clip.startTime;
      const splitRelative = clip.trimStart + splitOffset;

      const firstPart = {
        ...clip,
        id: `${clip.id}-part1-${Date.now()}`,
        endTime: splitTime,
        trimStart: clip.trimStart,
        trimEnd: clip.duration - splitRelative,
      };

      const secondPart = {
        ...clip,
        id: `${clip.id}-part2-${Date.now()}`,
        startTime: splitTime,
        trimStart: splitRelative,
        trimEnd: clip.trimEnd,
      };

      updated.splice(index, 1, firstPart, secondPart);
      return updated;
    });
  };

  // replace the const version with this hoisted function so it's available earlier
  // function fixAudioTrackLayers(clipsArr) {
  //   const audioClips = clipsArr.filter((c) => c.type === "audio");
  //   const sorted = [...audioClips].sort((a, b) => a.startTime - b.startTime);
  //   const layers = [];

  //   sorted.forEach((clip) => {
  //     let placed = false;
  //     for (const layer of layers) {
  //       const last = layer[layer.length - 1];
  //       if (clip.startTime >= last.endTime) {
  //         layer.push(clip);
  //         placed = true;
  //         break;
  //       }
  //     }
  //     if (!placed) layers.push([clip]);
  //   });

  //   const layered = layers.flatMap((layer, i) =>
  //     layer.map((clip) => ({ ...clip, track: i }))
  //   );

  //   return clipsArr.map((c) => {
  //     const match = layered.find((a) => a.id === c.id);
  //     return match ? { ...c, track: match.track } : c;
  //   });
  // }

  function assignTracks(clips) {
    const next = clips.map((c) => ({ ...c }));

    // ---------- TEXT (like audio, but negative tracks) ----------
    const textClips = next
      .filter((c) => c.type === "text")
      .sort((a, b) => a.startTime - b.startTime);

    const textLanes = []; // each lane is an array of non-overlapping clips

    textClips.forEach((clip) => {
      let placed = false;

      for (let i = 0; i < textLanes.length; i++) {
        const lane = textLanes[i];
        const overlaps = lane.some(
          (c) => !(clip.endTime <= c.startTime || clip.startTime >= c.endTime)
        );

        if (!overlaps) {
          clip.track = -1 - i;
          lane.push(clip);
          placed = true;
          break;
        }
      }

      if (!placed) {
        clip.track = -1 - textLanes.length;
        textLanes.push([clip]);
      }
    });

    // ---------- VIDEO / IMAGE ----------
    next.forEach((c) => {
      if (c.type === "video" || c.type === "image") {
        c.track = 0;
      }
    });

    // ---------- AUDIO (unchanged) ----------
    const audios = next
      .filter((c) => c.type === "audio")
      .sort((a, b) => a.startTime - b.startTime);

    const audioLanes = [];

    audios.forEach((clip) => {
      let placed = false;

      for (let i = 0; i < audioLanes.length; i++) {
        const lane = audioLanes[i];
        const overlaps = lane.some(
          (c) => !(clip.endTime <= c.startTime || clip.startTime >= c.endTime)
        );

        if (!overlaps) {
          clip.track = i + 1;
          lane.push(clip);
          placed = true;
          break;
        }
      }

      if (!placed) {
        clip.track = audioLanes.length + 1;
        audioLanes.push([clip]);
      }
    });

    return next;
  }

  // New handleAutoLayerFix: apply audio layering, set clips, and sync the new visual order
  const handleAutoLayerFix = useCallback(
    (updatedClips) => {
      const fixed = assignTracks(updatedClips);
      setClips(fixed);

      // Sync to ClipsData (use microtask so clipsRef.current is up-to-date)
      setTimeout(() => {
        // if you prefer to use the fixed value directly, pass fixed instead of clipsRef.current
        syncClipsToClipsData(clipsRef.current || fixed);
      }, 0);
    },
    [
      /* no deps necessary (fixAudioTrackLayers and syncClipsToClipsData are stable) */
    ]
  );

  // --------------------------
  // IMPORTANT: UPDATED handler to support trimming effects
  // --------------------------
  const handleClipUpdate = (clipId, updates) => {
    setClips((prev) => {
      const target = prev.find((c) => c.id === clipId);
      if (!target) return prev;

      // merge simple updates first
      let updated = prev.map((c) =>
        c.id === clipId ? { ...c, ...updates } : c
      );

      const affectsTimeline =
        updates.startTime !== undefined ||
        updates.trimStart !== undefined ||
        updates.trimEnd !== undefined;

      const isVisual =
        target && (target.type === "video" || target.type === "image");

      if (isVisual && affectsTimeline) {
        // read old trim values from the original target
        const oldTrimStart = Number(target.trimStart || 0);
        const oldTrimEnd = Number(target.trimEnd || 0);

        // pick new trim values (may not be provided in updates)
        const newClip = updated.find((c) => c.id === clipId);
        const newTrimStart =
          updates.trimStart !== undefined
            ? Number(updates.trimStart || 0)
            : oldTrimStart;
        const newTrimEnd =
          updates.trimEnd !== undefined
            ? Number(updates.trimEnd || 0)
            : oldTrimEnd;

        // compute visible length based on original media duration
        const mediaDuration = Number(
          newClip.duration || newClip.endTime - newClip.startTime || 0
        );
        const visibleLen = Math.max(
          0.001,
          mediaDuration - newTrimStart - newTrimEnd
        );

        // compute new startTime:
        // if user supplied an explicit startTime in updates, honor it
        // otherwise shift startTime forward by the left-trim delta (increase trimStart -> move right)
        const deltaTrimStart = newTrimStart - oldTrimStart;
        const newStartTime =
          updates.startTime !== undefined
            ? Number(updates.startTime)
            : Number(target.startTime) + deltaTrimStart;

        const newEndTime = newStartTime + visibleLen;

        // apply the computed times and trims to the updated array
        updated = updated.map((c) =>
          c.id === clipId
            ? {
                ...c,
                trimStart: newTrimStart,
                trimEnd: newTrimEnd,
                startTime: newStartTime,
                endTime: newEndTime,
              }
            : c
        );

        // Auto-reflow visual clips so downstream clips shift to accommodate new length
        updated = autoReflowClips(updated);
      }

      return updated;
    });

    // Immediately sync to ClipsData JSON (use microtask so clipsRef is updated)
    setTimeout(() => {
      syncClipsToClipsData(clipsRef.current);
    }, 0);
  };

  const handleClipSelect = (clip) => {
    setSelectedClipId(clip.id);
    setCurrentTime(clip.startTime);
    setIsPlaying(false);
    stopAllAudio();
    setSeekAudio((t) => t + 1);
    // record manual selection time so auto-select won't override immediately
    lastManualSelectRef.current = performance.now();
  };
  const activeVisualType = (() => {
    const visual = clips
      .filter((c) => c.type === "video" || c.type === "image")
      .find((c) => currentTime >= c.startTime && currentTime < c.endTime);
    return visual?.type;
  })();

  const handleSeek = (time, clipId = null) => {
    const wasPlaying = isPlaying;
    const clamped = Math.max(0, Math.min(time, totalDuration - EPS));

    const visuals = clipsRef.current
      .filter((c) => c.type === "video" || c.type === "image")
      .sort((a, b) => a.startTime - b.startTime);

    let targetClip = clipId
      ? clipsRef.current.find((c) => c.id === clipId)
      : visuals.find(
          (c) => clamped >= c.startTime - EPS && clamped < c.endTime - EPS
        );

    if (targetClip && targetClip.type === "image") {
      const inside = Math.min(
        targetClip.endTime - EPS,
        Math.max(targetClip.startTime + EPS, clamped)
      );
      justSeekedIntoImageRef.current = true;
      setCurrentTime(inside);
    } else {
      justSeekedIntoImageRef.current = false;
      setCurrentTime(clamped);
    }

    if (clipId) {
      setSelectedClipId(clipId);
      const clickedClip = clipsRef.current.find((c) => c.id === clipId);
      if (clickedClip)
        console.log(`Seeked inside clip: ${clickedClip.fileName}`);
    }

    audioPlayerRef.current?.stopAll?.();
    setSeekAudio((t) => t + 1);

    if (wasPlaying) setTimeout(() => setIsPlaying(true), 50);
  };

  // ---- FIX: when toggling Play, if currentTime is at/after the end -> seek to first visual start
  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => {
      const willPlay = !prev;
      if (willPlay) {
        const visuals = clipsRef.current
          .filter((c) => c.type === "video" || c.type === "image")
          .sort((a, b) => a.startTime - b.startTime);
        if (visuals.length) {
          const maxEnd = Math.max(...visuals.map((c) => c.endTime));
          // if we're at/after end, reset to first visual start so playback begins correctly
          if (
            currentTime >= maxEnd - EPS ||
            currentTime >= totalDuration - EPS
          ) {
            const firstStart = visuals[0].startTime || 0;
            // small epsilon to ensure image logic works
            setCurrentTime(Math.max(0, firstStart + EPS));
            // stop audio players too (we will restart them via effect)
            audioPlayerRef.current?.stopAll?.();
            setSeekAudio((t) => t + 1);
          }
        }
      }
      return willPlay;
    });
  }, [currentTime, totalDuration, EPS]);

  // --- IMPORTANT CHANGE: ignore video timeupdate updates when clip is not a video
  const handleTimeUpdate = (timeSec, clipId) => {
    const currentClip = clipsRef.current.find((c) => c.id === clipId);
    if (!currentClip || !isPlaying) return;

    // **NEW GUARD**: protect against stray timeupdate events from video frames
    // that can race and move the timeline while we're trying to show an image.
    if (currentClip.type !== "video") {
      // If the player reported a timeupdate for a non-video clip (rare),
      // ignore it — the timeline for images is driven by requestAnimationFrame.
      return;
    }

    const relativeTime = Math.max(0, timeSec - currentClip.trimStart);
    const globalTime = currentClip.startTime + relativeTime;

    const epsilon = 0.05;

    if (globalTime < currentClip.endTime - epsilon) {
      setCurrentTime(globalTime);
    } else if (globalTime >= currentClip.endTime - epsilon && isPlaying) {
      setCurrentTime(currentClip.endTime);
      handleClipEnd(currentClip.id);
    }
  };

  // const getCurrentClip = useCallback(() => {
  //   const visualClips = clips
  //     .filter((c) => c.type === "video" || c.type === "image")
  //     .sort((a, b) => a.startTime - b.startTime);

  //   let activeClip = visualClips.find(
  //     (c) => currentTime >= c.startTime - EPS && currentTime < c.endTime - EPS
  //   );

  //   if (
  //     !activeClip &&
  //     currentTime >= totalDuration - EPS &&
  //     visualClips.length
  //   ) {
  //     activeClip = visualClips[visualClips.length - 1];
  //   }
  //   if (!activeClip) return null;

  //   const relativeTime = Math.max(
  //     0,
  //     currentTime - activeClip.startTime + activeClip.trimStart
  //   );
  //   const maxRel =
  //     activeClip.duration - activeClip.trimStart - activeClip.trimEnd;
  //   const clampedRelativeTime = Math.min(
  //     relativeTime,
  //     Math.max(0, maxRel - EPS)
  //   );

  //   return {
  //     id: activeClip.id,
  //     url: activeClip.url,
  //     type: activeClip.type,
  //     startTime: activeClip.startTime,
  //     relativeTime: clampedRelativeTime,
  //     hasAudio: activeClip.hasAudio,
  //   };
  // }, [currentTime, clips, totalDuration, EPS]);

  useEffect(() => {
    if (clips.length && !selectedClipId) {
      setSelectedClipId(clips[0].id);
    }
  }, [clips, selectedClipId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = (e.target.tagName || "").toUpperCase();
      const isEditable =
        e.target.isContentEditable ||
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        tag === "BUTTON";

      if (isEditable) return;

      if (e.code === "Space") {
        e.preventDefault();
        handlePlayPause();
        return;
      }

      if (e.code === "ArrowLeft") {
        e.preventDefault();
        const newTime = Math.max(0, currentTime - 1);
        handleSeek(newTime);
        return;
      }

      if (e.code === "ArrowRight") {
        e.preventDefault();
        const newTime = Math.min(totalDuration, currentTime + 1);
        handleSeek(newTime);
        return;
      }

      if ((e.code === "Delete" || e.code === "Backspace") && selectedClipId) {
        e.preventDefault();
        setClips((prev) => prev.filter((clip) => clip.id !== selectedClipId));
        setSelectedClipId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () =>
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [currentTime, totalDuration, selectedClipId, handlePlayPause]);

  const autoReflowClips = (inputClips) => {
    const sorted = [...inputClips]
      .filter((c) => c.type === "video" || c.type === "image")
      .sort((a, b) => a.startTime - b.startTime);

    let curTime = 0;
    const adjusted = sorted.map((clip) => {
      const newStart = curTime;
      const clipLength = clip.duration - clip.trimStart - clip.trimEnd;
      const newEnd = newStart + clipLength;
      curTime = newEnd;

      return {
        ...clip,
        startTime: newStart,
        endTime: newEnd,
      };
    });

    const nonVisuals = inputClips.filter(
      (c) => c.type !== "video" && c.type !== "image"
    );
    return [...adjusted, ...nonVisuals];
  };

  // useEffect(() => {
  //   if (!isPlaying) return;

  //   let rafId;
  //   let lastNow = performance.now();
  //   let running = true;

  //   const visualsSorted = () =>
  //     clipsRef.current
  //       .filter((c) => c.type === "video" || c.type === "image")
  //       .sort((a, b) => a.startTime - b.startTime);

  //   const findActiveAt = (t, visuals) =>
  //     visuals.find((c) => t >= c.startTime - EPS && t < c.endTime - EPS);

  //   const tick = (now) => {
  //     if (!running) return;

  //     let dt = (now - lastNow) / 1000;
  //     if (dt > MAX_DT) dt = MAX_DT;
  //     lastNow = now;

  //     setCurrentTime((prev) => {
  //       const visuals = visualsSorted();
  //       if (!visuals.length) return prev;

  //       const active = findActiveAt(prev, visuals);

  //       if (!active) {
  //         // ---- FIX: if there is no active visual but currentTime is before the first visual,
  //         // advance into the first visual instead of jumping to the end.
  //         const firstVisual = visuals[0];
  //         const lastVisualEnd = Math.max(...visuals.map((c) => c.endTime));
  //         if (prev < firstVisual.startTime + EPS) {
  //           // move to first visual start (small EPS to avoid image-first-time edge)
  //           lastVisualIdRef.current = firstVisual.id;
  //           return Math.max(prev, firstVisual.startTime + EPS);
  //         }

  //         // otherwise assume we truly reached the end -> stop and set to end
  //         running = false;
  //         setIsPlaying(false);
  //         return lastVisualEnd;
  //       }

  //       if (active.type !== "image") {
  //         enteredImageRef.current = false;
  //         lastVisualIdRef.current = active.id;
  //         return prev;
  //       }

  //       const firstTimeOnThisImage =
  //         lastVisualIdRef.current !== active.id || !enteredImageRef.current;
  //       if (firstTimeOnThisImage) {
  //         enteredImageRef.current = true;
  //         lastVisualIdRef.current = active.id;
  //         return Math.max(prev, active.startTime + EPS);
  //       }

  //       const nextT = prev + dt;
  //       const imgEnd = active.endTime - EPS;

  //       if (nextT < imgEnd) return nextT;

  //       const idx = visuals.findIndex((c) => c.id === active.id);
  //       if (idx >= 0 && idx < visuals.length - 1) {
  //         const nxt = visuals[idx + 1];
  //         enteredImageRef.current = false;
  //         lastVisualIdRef.current = nxt.id;
  //         return nxt.type === "image" ? nxt.startTime + EPS : nxt.startTime;
  //       }

  //       running = false;
  //       setIsPlaying(false);
  //       return active.endTime;
  //     });

  //     rafId = requestAnimationFrame(tick);
  //   };

  //   rafId = requestAnimationFrame(tick);
  //   return () => {
  //     running = false;
  //     if (rafId) cancelAnimationFrame(rafId);
  //   };
  // }, [isPlaying]);

  // --- NEW: auto-select active visual clip but respect recent manual clicks
  useEffect(() => {
    const MANUAL_GRACE_MS = 400;

    const visualClips = clips
      .filter((c) => c.type === "video" || c.type === "image")
      .sort((a, b) => a.startTime - b.startTime);

    const active = visualClips.find(
      (c) => currentTime >= c.startTime - EPS && currentTime < c.endTime - EPS
    );

    if (!active) return;

    const sinceManual = performance.now() - (lastManualSelectRef.current || 0);
    if (sinceManual < MANUAL_GRACE_MS) return;

    if (active.id !== selectedClipId) {
      setSelectedClipId(active.id);
    }
  }, [currentTime, clips, selectedClipId, EPS]);

  const activeAudioClips = useMemo(() => {
    return clips
      .filter(
        (clip) =>
          clip.type === "audio" &&
          currentTime >= clip.startTime &&
          currentTime < Math.min(clip.endTime, totalDuration)
      )
      .sort((a, b) => (a.track ?? 0) - (b.track ?? 0));
  }, [clips, currentTime, totalDuration]);

  // -----------------------
  // ADAPTER: map ClipsData -> app clips and REPLACE existing clips
  // - converts slides to image + audio clips
  // - attempts to read remote audio durations (but will fall back to slide duration)
  // - REPLACES current clips so default-clip does not show when external data exists
  // -----------------------

  // Robust universal media duration probe that:
  //  - tries without crossOrigin first (most servers)
  //  - retries with crossOrigin only if needed
  //  - attaches listeners before assigning src (safer)
  const getRemoteMediaDuration = (
    url,
    type = "audio",
    fallback = null,
    opts = {}
  ) =>
    new Promise((resolve) => {
      if (!url) return resolve(fallback);

      const timeoutMs = opts.timeoutMs || 8000;
      const maxAttempts = opts.retry ? opts.retry + 1 : 2; // try no-cors then cors
      let attempt = 0;
      let finished = false;

      const tryOnce = (useCrossOrigin) => {
        attempt++;
        let timeoutId = null;
        const el = document.createElement(type === "video" ? "video" : "audio");
        el.preload = "metadata";

        // Attach listeners BEFORE assigning src
        const cleanup = () => {
          el.removeEventListener("loadedmetadata", onMeta);
          el.removeEventListener("error", onErr);
          try {
            el.src = "";
          } catch {}
          if (timeoutId) clearTimeout(timeoutId);
        };

        const finish = (dur) => {
          if (finished) return;
          finished = true;
          cleanup();
          resolve(dur);
        };

        const onMeta = () => {
          const d =
            isFinite(el.duration) && el.duration > 0 ? el.duration : null;
          finish(d ?? fallback);
        };

        const onErr = (ev) => {
          // if error, try next attempt (e.g., switch crossOrigin)
          cleanup();
          if (attempt < maxAttempts) {
            // small backoff
            setTimeout(() => tryOnce(!useCrossOrigin), 150);
            return;
          }
          finish(fallback);
        };

        el.addEventListener("loadedmetadata", onMeta);
        el.addEventListener("error", onErr);

        try {
          if (useCrossOrigin) {
            try {
              el.crossOrigin = "anonymous";
            } catch {}
          } else {
            // ensure nothing set
            try {
              el.removeAttribute("crossorigin");
            } catch {}
          }
          // set src after listeners attached
          el.src = url;
        } catch (err) {
          // failure -> try next if any
          cleanup();
          if (attempt < maxAttempts) {
            setTimeout(() => tryOnce(!useCrossOrigin), 150);
            return;
          }
          finish(fallback);
        }

        timeoutId = setTimeout(() => {
          cleanup();
          if (attempt < maxAttempts) {
            // retry with opposite crossOrigin setting
            setTimeout(() => tryOnce(!useCrossOrigin), 150);
            return;
          }
          finish(fallback);
        }, timeoutMs);
      };

      // start without crossOrigin first
      tryOnce(false);
    });

  useEffect(() => {
    if (!ClipsData || !Array.isArray(ClipsData.slides)) return;

    // TEMP FLAG (very important during transition)
    const USE_NEW_ADAPTER = true;
    if (!USE_NEW_ADAPTER) return;

    console.log(" Importing timeline from mediaData adapter");

    const { clips: importedClips, textBlocks: importedCanvasTextBlocks } =
      importTimelineClipsFromMediaData(ClipsData);

    console.log(
      "import",
      importedClips,
      "text Blocks",
      importedCanvasTextBlocks
    );

    setImportedTextBlocks(importedCanvasTextBlocks || []);

    if (!importedClips.length) {
      console.warn(" Adapter returned no clips");
      return;
    }

    setClips(() => {
      const marked = importedClips.map((c) => ({
        ...c,
        externalSource: true,
      }));
      return assignTracks(marked);
    });

    // timeline selection + duration safety
    setTimeout(() => {
      const visuals = clipsRef.current.filter(
        (c) => c.type === "image" || c.type === "video"
      );

      if (visuals.length) {
        setSelectedClipId(visuals[0].id);
        setTotalDuration(Math.max(...visuals.map((v) => v.endTime || 0)));
      }
    }, 0);
    console.log("IMPORTED", importedClips, importedCanvasTextBlocks);
  }, [ClipsData]);

  useEffect(() => {
    if (!importedTextBlocks.length) return;

    importedTextBlocks.forEach((tb) => {
      const exists = canvasStore.getBlockById?.(tb.id);
      if (exists) return;

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
  }, [importedTextBlocks, canvasStore]);

  // async function: builds clips array from ClipsData and replaces app clips state
  // const buildAndReplaceClipsFromClipsData = async () => {
  //   if (!ClipsData) return;

  //   // Find slides array (support both shapes)
  //   const dataEntry =
  //     Array.isArray(ClipsData) && ClipsData.length
  //       ? ClipsData.find((d) => Array.isArray(d.slides)) || ClipsData[0]
  //       : ClipsData;
  //   if (!dataEntry) return;

  //   const slides = Array.isArray(dataEntry.slides)
  //     ? dataEntry.slides
  //     : Array.isArray(ClipsData) &&
  //       ClipsData.every(
  //         (s) =>
  //           s && (s.image || s.image_url || s.url || s.video_url || s.video)
  //       )
  //     ? ClipsData
  //     : null;
  //   if (!slides || !slides.length) return;

  //   // Helper: deep clone
  //   const deepClone = (o) => {
  //     try {
  //       return typeof structuredClone === "function"
  //         ? structuredClone(o)
  //         : JSON.parse(JSON.stringify(o));
  //     } catch {
  //       return JSON.parse(JSON.stringify(o));
  //     }
  //   };

  //   // Pre-read audio durations in parallel (best-effort)
  //   const audioDurationPromises = slides.map((s, idx) => {
  //     const audioUrl = s?.audio?.audio_url || s?.audio_url || null;
  //     const slideAudioDuration = s?.audio?.duration ?? null;
  //     if (!audioUrl)
  //       return Promise.resolve(
  //         slideAudioDuration != null ? Number(slideAudioDuration) : null
  //       );

  //     // getRemoteMediaDuration should exist in your file (robust helper recommended)
  //     return getRemoteMediaDuration(
  //       audioUrl,
  //       "audio",
  //       slideAudioDuration || 3,
  //       {
  //         timeoutMs: 8000,
  //         tryCrossOrigin: true,
  //       }
  //     )
  //       .then((d) => {
  //         if (d == null)
  //           return slideAudioDuration != null ? Number(slideAudioDuration) : 3;
  //         return d;
  //       })
  //       .catch(() =>
  //         slideAudioDuration != null ? Number(slideAudioDuration) : 3
  //       );
  //   });

  //   // Pre-read video durations in parallel (if needed)
  //   const videoDurationPromises = slides.map((s) => {
  //     const videoUrl =
  //       (s.video && (s.video.video_url || s.video.url)) ||
  //       s.video_url ||
  //       s.videoUrl ||
  //       null;
  //     const providedDuration =
  //       Number(
  //         s.duration ||
  //           (s.video && (s.video.duration || s.video.video_duration)) ||
  //           0
  //       ) || 0;
  //     if (!videoUrl) return Promise.resolve(null);
  //     if (providedDuration > 0) return Promise.resolve(providedDuration);
  //     return getRemoteMediaDuration(videoUrl, "video", null, {
  //       timeoutMs: 10000,
  //       tryCrossOrigin: true,
  //     });
  //   });

  //   const [audioDurations, videoDurations] = await Promise.all([
  //     Promise.all(audioDurationPromises),
  //     Promise.all(videoDurationPromises),
  //   ]);

  //   // tiny helper to test whether a URL looks like an image
  //   const isLikelyImage = (url) => {
  //     if (!url || typeof url !== "string") return false;
  //     if (url.startsWith("data:image/")) return true;
  //     return /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(url);
  //   };

  //   // Build clips sequentially
  //   const newClips = [];
  //   let visualCursor = 0;

  //   for (let i = 0; i < slides.length; i++) {
  //     const slide = slides[i];
  //     const imageObj = slide.image || {};
  //     const audioObj = slide.audio || {};
  //     const videoObj = slide.video || {};

  //     const videoUrl =
  //       videoObj.video_url ||
  //       videoObj.url ||
  //       slide.video_url ||
  //       slide.videoUrl ||
  //       null;

  //     const imageUrl =
  //       imageObj.image_url ||
  //       slide.image_url ||
  //       slide.imageUrl ||
  //       slide.url ||
  //       null;

  //     const isVideo = !!videoUrl;

  //     // Pick visual duration
  //     let visualDuration = 0;
  //     if (isVideo) {
  //       visualDuration =
  //         Number(videoObj.duration || videoObj.video_duration) ||
  //         Number(videoDurations[i]) ||
  //         3;
  //     } else {
  //       visualDuration =
  //         Number(
  //           imageObj.duration || imageObj.image_duration || slide.duration
  //         ) || 3;
  //     }

  //     const visualId =
  //       slide.uuid ||
  //       `visual-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  //     const visualStart = visualCursor;
  //     const visualEnd = visualStart + visualDuration;

  //     // Choose thumbnail:
  //     // - For videos: prefer slide.video_thumbnail (your canonical field)
  //     // - For images: use the image url (you said you don't send separate thumbnails for images)
  //     let chosenThumbnail = null;
  //     if (isVideo) {
  //       chosenThumbnail =
  //         (slide.video &&
  //           (slide.video.video_thumbnail || slide.video.Video_thumbnail)) ||
  //         slide.video_thumbnail ||
  //         // optional older fallback if present:
  //         slide.thumbnail ||
  //         videoObj.thumbnail ||
  //         null;

  //       // Validate: if the chosen value is obviously not an image (e.g. an mp3 link),
  //       // we don't set a thumbnail (UI will show Loading... fallback).
  //       if (!isLikelyImage(chosenThumbnail)) {
  //         chosenThumbnail = null;
  //       }
  //     } else {
  //       chosenThumbnail = imageUrl || null; // image itself is the thumbnail
  //     }

  //     // Build clip
  //     const visualClip = {
  //       id: visualId,
  //       type: isVideo ? "video" : "image",
  //       url: isVideo ? videoUrl || "" : imageUrl || "",
  //       fileName: isVideo
  //         ? (videoUrl || "").split("/").pop()
  //         : imageUrl
  //         ? imageUrl.split("/").pop()
  //         : `image-${visualId}`,
  //       mimeType: isVideo
  //         ? videoObj.mimeType || "video/mp4"
  //         : imageUrl?.endsWith(".png")
  //         ? "image/png"
  //         : "image/jpeg",
  //       duration: visualDuration,
  //       startTime: visualStart,
  //       endTime: visualEnd,
  //       trimStart: 0,
  //       trimEnd: 0,
  //       hasAudio: !!(audioObj && audioObj.audio_url) || !!isVideo,
  //       thumbnail: chosenThumbnail,
  //       track: 0,
  //       _rawSlide: deepClone(slide),
  //     };

  //     newClips.push(visualClip);

  //     // Attach independent audio clip if slide provides audio_url
  //     if (audioObj && audioObj.audio_url) {
  //       const audioDur =
  //         audioDurations &&
  //         typeof audioDurations[i] !== "undefined" &&
  //         audioDurations[i] != null
  //           ? audioDurations[i]
  //           : Number(audioObj.duration) || 3;

  //       const audioClip = {
  //         id: `${audioObj.uuid || visualId}-audio`,
  //         type: "audio",
  //         url: audioObj.audio_url,
  //         fileName: audioObj.audio_url.split("/").pop(),
  //         mimeType: "audio/mpeg",
  //         duration: audioDur,
  //         startTime: visualStart,
  //         endTime: visualStart + audioDur,
  //         trimStart: 0,
  //         trimEnd: 0,
  //         hasAudio: true,
  //         thumbnail: null,
  //         track: 0,
  //       };

  //       newClips.push(audioClip);
  //     }

  //     visualCursor = visualEnd;
  //   } // end for

  //   if (!newClips.length) return;

  //   // replace app clips state (assumes setClips + fixAudioTrackLayers exist in your file)
  //   setClips(() => {
  //     const marked = newClips.map((c) => ({ ...c, externalSource: true }));
  //     return assignTracks(marked);
  //   });

  //   // ensure selection and totalDuration update after setClips
  //   setTimeout(() => {
  //     const allClipsNow = clipsRef.current;
  //     const firstVisual = allClipsNow.find(
  //       (c) => c.type === "image" || c.type === "video"
  //     );
  //     if (firstVisual) {
  //       setSelectedClipId((prev) => prev || firstVisual.id);
  //       const maxVisualEnd = Math.max(
  //         ...allClipsNow
  //           .filter((c) => c.type === "video" || c.type === "image")
  //           .map((c) => c.endTime)
  //       );
  //       setTotalDuration((prev) => Math.max(prev, maxVisualEnd || 0));
  //     }
  //   }, 50);
  // };

  // useEffect(() => {
  //   let cancelled = false;
  //   // Run the builder once on mount
  //   buildAndReplaceClipsFromClipsData();

  //   return () => {
  //     cancelled = true;
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []); // run once

  // -----------------------
  // end adapter
  // -----------------------

  const handleCanvasClick = (payload) => {
    // payload: { overlayRect, x, y, clientX, clientY, originalEvent }
    if (!payload?.overlayRect) return;

    // compute center-above-player position
    const rect = payload.overlayRect;
    const centerX = Math.round(rect.left + rect.width / 2);
    const top = Math.round(Math.max(8, rect.top - 35)); // 8px gap above player

    setToolbarAnchor({ left: centerX, top });
    setLastCanvasClick(payload);
    setToolbarVisible(true);
  };

  const handleToolbarCreateText = useCallback(
    (opts = {}) => {
      if (opts?.originalEvent) {
        opts.originalEvent.stopPropagation();
      }

      const rect = lastCanvasClick?.overlayRect;

      const centerX = rect
        ? Math.round(rect.width / 2)
        : typeof opts.x === "number"
        ? opts.x
        : typeof lastCanvasClick?.x === "number"
        ? lastCanvasClick.x
        : 40;

      const centerY = rect
        ? Math.round(rect.height / 2)
        : typeof opts.y === "number"
        ? opts.y
        : typeof lastCanvasClick?.y === "number"
        ? lastCanvasClick.y
        : 40;

      const startTime = opts.startTime ?? currentTime;
      const duration = opts.duration ?? 5;
      const endTime = startTime + duration;

      /** 1️ Create canvas block (visual only) */
      const block = canvasStore.addTextBlock(pageId, {
        x: centerX,
        y: centerY,
        text: opts.text ?? "Neww Text",
        style: opts.style ?? {},
      });

      if (!block?.id) return;

      /** 2 Create timeline clip (NORMALIZED) */
      setClips((prev) => [
        ...prev,
        {
          id: `clip-${block.id}`, // stable link
          blockId: block.id,
          type: "text",

          // timeline fields
          startTime,
          endTime,
          duration,

          // REQUIRED for timeline math
          trimStart: 0,
          trimEnd: 0,

          //  text lives ABOVE video track
          track: -1,
        },
      ]);

      /** 3️⃣ Select + edit */
      canvasStore.select(block.id);
      canvasStore.setSelectionMode("text");

      requestAnimationFrame(() => {
        const el = canvasStore.getBlockRef(pageId, block.id);
        el?.querySelector("[contenteditable]")?.focus();
      });
    },
    [canvasStore, currentTime, pageId, lastCanvasClick, setClips]
  );

  // Hide toolbar ONLY when clicking outside AND nothing is selected
  useEffect(() => {
    const onDocPointerDown = (ev) => {
      if (ev.button !== 0) return;
      if (!toolbarVisible) return;

      const toolbarNode = toolbarRef.current;

      // 🔁 IMPORTANT CHANGE
      const playerApi = videoPlayerContainerRef.current;
      const canvasEl = playerApi?.getCanvasEl?.();

      // 1️⃣ Click inside toolbar → keep open
      if (toolbarNode && toolbarNode.contains(ev.target)) return;

      // 2️⃣ Click inside canvas / video player → keep open
      if (canvasEl && canvasEl.contains(ev.target)) return;

      // 3️⃣ If text is actively being edited → keep open
      if (canvasStore.selectionMode === "text") {
        const active = document.activeElement;
        if (active && active.isContentEditable) return;
      }

      // ✅ Otherwise → close toolbar + clear canvas selection
      setToolbarVisible(false);
      canvasStore.clearSelection?.();
      canvasStore.setSelectionMode(null);
    };

    document.addEventListener("pointerdown", onDocPointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", onDocPointerDown, true);
  }, [toolbarVisible, canvasStore]);

  const selectedBlock = canvasStore.selectedIds.length
    ? canvasStore.getBlockById(canvasStore.selectedIds[0])
    : null;
  const selectedStyle = selectedBlock?.style || {};
  // console.log("selectedBlock id:", selectedBlock?.id);
  // console.log("selectedBlock type:", selectedBlock?.type);
  // console.log("selectedBlock style:", selectedBlock?.style?.fontSize);
  // console.log("selectedBlock style:", selectedBlock?.fontSize);
  // console.log("selectedBlock full:", JSON.parse(JSON.stringify(selectedBlock)));

  // useEffect(() => {
  //   const api = videoPlayerContainerRef.current;
  //   if (!api) return;

  //   const el = api.getCanvasEl?.();
  //   if (!el) return;

  //   // canvasRef.current = el;
  //   getFitRef.current = api.getFit;
  // }, []);

  useEffect(() => {
    setToolbarVisible(!!canvasStore.selectionMode);
  }, [canvasStore.selectionMode]);

  useEffect(() => {
    if (!activeBlock) return;

    const api = videoPlayerContainerRef.current;
    const rect = api?.getCanvasRect?.();
    if (!rect) return;

    setToolbarAnchor({
      left: Math.round(rect.left + rect.width / 2),
      top: Math.round(rect.top - 48),
    });
  }, [activeBlock]);

  // useEffect(() => {
  //   canvasRef.current = canvasEl;
  // }, [canvasEl]);
  // const [canvasEl, setCanvasEl] = useState(null);

  useEffect(() => {
    if (!activeBlock) return;
    console.log("activeBlock", activeBlock);
    {
      console.log(
        "BLOCK AFTER BOLD",
        JSON.parse(
          JSON.stringify(canvasStore.getBlockById(canvasStore.selectedIds[0]))
        )
      );
    }
  }, [activeBlock]);

  const textBlockMap = new Map();

  for (const page of canvasStore.project.pages) {
    for (const block of page.blocks ?? []) {
      if (block.type === "text") {
        textBlockMap.set(block.id, block);
      }
    }
  }

  return (
    <div className=" bg-white text-gray-900 font-sans w-full flex flex-col items-center justify-center">
      <div className="container  max-w-[1000px] xxl:max-w-[1200px] px-6 py-0  !w-full">
        <div className="px-4 py-0 w-full flex items-center justify-center">
          <VideoPlayer
            currentClip={getCurrentClip()}
            ref={videoPlayerContainerRef}
            currentTime={currentTime}
            isPlaying={isPlaying}
            clips={clips}
            onPlayPause={handlePlayPause}
            onClipEnd={handleClipEnd}
            onTimeUpdate={handleTimeUpdate}
            duration={totalDuration}
            zoom={videoZoom}
            onRequestSeek={handleSeek}
            onCanvasClick={handleCanvasClick}
            pageId={pageId}
            onToolbarCreateText={handleToolbarCreateText}
            onToolbarClose={() => setToolbarVisible(false)}
          />
        </div>

        {toolbarVisible && (
          <div
            ref={toolbarRef}
            style={{
              position: "fixed",
              left: toolbarAnchor.left,
              top: toolbarAnchor.top,
              transform: "translateX(-50%)",
              zIndex: 99999,
            }}
          >
            <SelectionToolbar
              /* visibility + positioning */
              visible
              mode={canvasStore.selectionMode}
              x={toolbarAnchor.x}
              y={toolbarAnchor.y}
              /* block context */
              blockType={
                canvasStore.selectionMode === "canvas"
                  ? "canvas"
                  : selectedBlock?.type || null
              }
              /* ---------------- TEXT STATE ---------------- */
              fontList={fontFamilies}
              currentFontFamily={selectedStyle.fontFamily || ""}
              currentFontSize={selectedStyle.fontSize ?? null}
              currentBold={!!selectedStyle.bold}
              currentItalic={!!selectedStyle.italic}
              currentUnderline={!!selectedStyle.underline}
              currentStrike={!!selectedStyle.strike}
              currentTextColor={selectedStyle.color || "#000000"}
              textAlign={selectedBlock?.textAlign || "center"}
              listType={selectedBlock?.listType || "normal"}
              /* ---------------- IMAGE / COMMON STATE ---------------- */
              opacity={
                canvasStore.selectedIds.length === 1
                  ? canvasStore.getBlockById(canvasStore.selectedIds[0])
                      ?.opacity ?? 1
                  : 1
              }
              borderRadius={selectedBlock?.borderRadius ?? 0}
              /* ---------------- ACTIONS ---------------- */
              onCreateText={() =>
                handleToolbarCreateText({
                  text: "New Text",
                  startTime: currentTime,
                })
              }
              onChangeFontFamily={(value) =>
                editorActions.changeFontFamily(
                  canvasStore,
                  { selectedIds: canvasStore.selectedIds },
                  value
                )
              }
              onChangeFontSize={(size) =>
                editorActions.changeFontSize(
                  canvasStore,
                  { selectedIds: canvasStore.selectedIds },
                  size
                )
              }
              onToggleStrike={() =>
                editorActions.toggleTextStyle(
                  canvasStore,
                  { selectedIds: canvasStore.selectedIds },
                  "strike"
                )
              }
              onChangeTextColor={(color) =>
                editorActions.changeTextColor(
                  canvasStore,
                  { selectedIds: canvasStore.selectedIds },
                  color
                )
              }
              onToggleBold={() =>
                editorActions.toggleTextStyle(
                  canvasStore,
                  { selectedIds: canvasStore.selectedIds },
                  "bold"
                )
              }
              onToggleItalic={() =>
                editorActions.toggleTextStyle(
                  canvasStore,
                  { selectedIds: canvasStore.selectedIds },
                  "italic"
                )
              }
              onToggleUnderline={() =>
                editorActions.toggleTextStyle(
                  canvasStore,
                  { selectedIds: canvasStore.selectedIds },
                  "underline"
                )
              }
              onCycleListType={() => {
                const id = canvasStore.selectedIds?.[0];
                if (!id) return;

                const block = canvasStore.getBlockById(id);
                if (!block || block.type !== "text") return;

                const ORDER = ["normal", "bullet", "number"];
                const current = block.listType || "normal";
                const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];

                editorActions.setListType(
                  canvasStore,
                  { selectedIds: [id] },
                  next
                );
              }}
              onCycleTextAlign={() => {
                const id = canvasStore.selectedIds?.[0];
                if (!id) return;

                const block = canvasStore.getBlockById(id);
                if (!block || block.type !== "text") return;

                const ORDER = ["left", "center", "right", "justify"];
                const current = block.textAlign || "center";
                const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];

                editorActions.setTextAlign(
                  canvasStore,
                  { selectedIds: [id] },
                  next
                );
              }}
              onChangeOpacity={(v) =>
                editorActions.setOpacity(
                  canvasStore,
                  { selectedIds: canvasStore.selectedIds },
                  v
                )
              }
              onFlipHorizontal={() =>
                editorActions.flipBlock(
                  canvasStore,
                  { selectedIds: canvasStore.selectedIds },
                  "horizontal"
                )
              }
              onFlipVertical={() =>
                editorActions.flipBlock(
                  canvasStore,
                  { selectedIds: canvasStore.selectedIds },
                  "vertical"
                )
              }
              /* ---------------- HISTORY ---------------- */
              onUndo={() => canvasStore.undo?.()}
              onRedo={() => canvasStore.redo?.()}
              canUndo={canvasStore.undoStack?.length > 0}
              canRedo={canvasStore.redoStack?.length > 0}
            />
          </div>
        )}

        <div className="px-4 py-0 w-full overflow-scroll">
          <Timeline
            clips={clips}
            textBlockMap={textBlockMap}
            onSplitAudio={handleSplitAudio}
            currentTime={currentTime}
            totalDuration={totalDuration}
            onClipUpdate={handleClipUpdate}
            onClipSelect={handleClipSelect}
            onSeek={handleSeek}
            selectedClipId={selectedClipId}
            onAutoLayerFix={handleAutoLayerFix}
            onCommitMove={commitMoveAndSync}
          />
        </div>
        <AudioPlayer
          activeAudioClips={activeAudioClips}
          isPlaying={isPlaying}
          currentTime={currentTime}
          seekAudio={seekAudio}
          clips={clips}
          activeVisualType={activeVisualType}
        />
        {/* <div className="rounded-xl bg-white p-4 shadow-md border border-gray-200 flex justify-between items-center">
                    <Toolbar
                        currentTime={currentTime}
                        totalDuration={totalDuration}
                        videoZoom={videoZoom}
                        setVideoZoom={setVideoZoom}
                    />
                </div> */}
      </div>
    </div>
  );
});

export default observer(RealEditor);
