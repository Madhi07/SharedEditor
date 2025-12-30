export default function exportToMediaData({
  clips,
  canvasStore,
  slidesSource,
}) {
  if (!slidesSource || typeof slidesSource !== "object") {
    throw new Error("exportToMediaData: slidesSource is required");
  }

  // ---------- TEXT CLIPS ----------
  const textClips = clips.filter((c) => c.type === "text");

  // ---------- INDEX CANVAS TEXT BLOCKS ----------
  const canvasTextBlocks = new Map();

  canvasStore.project.pages.forEach((page) => {
    page.blocks?.forEach((block) => {
      if (block.type === "text") {
        canvasTextBlocks.set(block.id, block);
      }
    });
  });

  // ---------- MERGE TEXT ----------
  const mergedTextBlocks = textClips
    .map((clip) => {
      const block = canvasTextBlocks.get(clip.blockId);
      if (!block) return null;

      return {
        id: block.id,
        type: "text",
        text: block.text,

        position: {
          x: Number.isFinite(block.position?.x) ? block.position.x : 0,
          y: Number.isFinite(block.position?.y) ? block.position.y : 0,
        },

        size: {
          width: Number.isFinite(block.size?.width) ? block.size.width : null,
          height: Number.isFinite(block.size?.height)
            ? block.size.height
            : null,
        },

        style: JSON.parse(JSON.stringify(block.style || {})),
        opacity: block.opacity ?? 1,
        rotation: block.rotation ?? 0,
        zIndex: block.zIndex ?? 0,

        startTime: clip.startTime,
        duration: clip.duration,
        endTime: clip.endTime ?? clip.startTime + clip.duration,
      };
    })
    .filter(Boolean);

  // ---------- SLIDES (UNCHANGED) ----------
  const slides = Array.isArray(slidesSource.slides) ? slidesSource.slides : [];

  // ---------- CANVA DATA (SAFE DEFAULTS) ----------
  const sourceCanva = slidesSource.canvas_data || {};

  const activePageId =
    sourceCanva.activePageId ||
    canvasStore.project.activePageId ||
    "video-page";

  const pagesFromSource =
    Array.isArray(sourceCanva.pages) && sourceCanva.pages.length
      ? sourceCanva.pages
      : canvasStore.project.pages;

  const pages = pagesFromSource.map((page) => {
    if (page.id !== activePageId) return page;

    return {
      ...page,
      blocks: mergedTextBlocks,
    };
  });

  // ---------- FINAL EXPORT ----------
  return {
    data: {
      ...slidesSource,
      slides,
      canvas_data: {
        editor: sourceCanva.editor || canvasStore.project.editor || "video",
        pages,
        activePageId,
      },
    },
  };
}
