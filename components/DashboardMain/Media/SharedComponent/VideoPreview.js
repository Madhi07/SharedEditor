import { useEffect, useMemo, useCallback } from "react";
import { useCanvasStoreReactive } from "../context/CanvasStoreContext";
import VideoPlayer from "../ReelsEditor/VideoPlayer";
import importTimelineClipsFromMediaData from "../utils/adapters/importFromMediaData";
import { useVideoEditorCore } from "../utils/videoEditorCore";
import AudioPlayer from "../ReelsEditor/AudioPlayer";

export default function VideoPreview({ initialProject, pageId }) {
  const canvasStore = useCanvasStoreReactive();
  const mode = "preview";

  /* ----------------------------------------
     1. Build timeline + text blocks ONCE
  ---------------------------------------- */
  const { timelineClips, canvasTextBlocks } = useMemo(() => {
    if (!initialProject) {
      return { timelineClips: [], canvasTextBlocks: [] };
    }

    try {
      const result = importTimelineClipsFromMediaData(initialProject);
      return {
        timelineClips: result?.clips || [],
        canvasTextBlocks: result?.textBlocks || [],
      };
    } catch (e) {
      console.error("Preview adapter failed", e);
      return { timelineClips: [], canvasTextBlocks: [] };
    }
  }, [initialProject]);

  console.log("timelineClips", timelineClips);
  console.log("canvasTextBlocks", canvasTextBlocks);

  const logical = canvasStore.getPageLogicalSize?.(pageId) ??
    store.project?.pages?.find((p) => p.id === pageId)?.meta?.logicalSize ?? {
      width: 1920,
      height: 1080,
    };

  const handlePreviewClipEnd = useCallback(() => {
    setIsPlaying(false);
  }, []);
  /* ----------------------------------------
     2. Shared playback core
  ---------------------------------------- */
  const {
    clips,
    setClips,
    currentTime,
    setCurrentTime,
    isPlaying,
    setIsPlaying,
    totalDuration,
    getCurrentClip,
  } = useVideoEditorCore({
    initialClips: timelineClips,
    initialTextBlocks: canvasTextBlocks,
    canvasStore,
    onClipEnd: handlePreviewClipEnd,
  });

  /* ----------------------------------------
     3. Sync clips if project changes
  ---------------------------------------- */
  useEffect(() => {
    if (timelineClips.length) {
      setClips(timelineClips);
    }
  }, [timelineClips, setClips]);

  /* ----------------------------------------
     4. Auto-play preview
  ---------------------------------------- */
  //   useEffect(() => {
  //     if (clips.length && !isPlaying) {
  //       setIsPlaying(true);
  //     }
  //   }, [clips, isPlaying, setIsPlaying]);

  const textClipMap = useMemo(() => {
    const map = new Map();
    (timelineClips || []).forEach((c) => {
      if (c.type === "text" && c.blockId) {
        map.set(c.blockId, c);
      }
    });
    return map;
  }, [timelineClips]);

  const activeAudioClips = useMemo(() => {
    return timelineClips
      .filter(
        (clip) =>
          clip.type === "audio" &&
          currentTime >= clip.startTime &&
          currentTime < Math.min(clip.endTime, totalDuration)
      )
      .sort((a, b) => (a.track ?? 0) - (b.track ?? 0));
  }, [clips, currentTime, totalDuration]);

  /* ----------------------------------------
     5. Render
  ---------------------------------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div
        style={{
          width: "100%",
          maxWidth: "960px",
          height: "90vh",
          aspectRatio: `${logical.width} / ${logical.height}`,
          margin: "0 auto",
        }}
      >
        <VideoPlayer
          mode="preview"
          clips={clips}
          timelineClips={timelineClips}
          currentClip={getCurrentClip()}
          currentTime={currentTime}
          isPlaying={isPlaying}
          duration={totalDuration}
          onPlayPause={() => setIsPlaying((p) => !p)}
          onRequestSeek={(t) => setCurrentTime(Math.max(0, t))}
        />
        {mode === "preview" && (
          <AudioPlayer
            clips={timelineClips}
            currentTime={currentTime}
            isPlaying={isPlaying}
            activeAudioClips={activeAudioClips}
          />
        )}
      </div>
    </div>
  );
}
