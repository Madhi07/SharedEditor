export default function importTimelineClipsFromMediaData(mediaData) {
  const data = mediaData;
  if (!data) return { clips: [], textBlocks: [] };

  const canva = data.canvas_data || {};
  console.log("Canva text", canva)
  const clips = [];
  const textBlocks = [];

  let cursor = 0;

  // ---------- Slides → visual + audio clips ----------
  data.slides?.forEach((slide) => {
    const duration = Number(slide.duration) || 3;

    const imageUrl = slide.image?.image_url;
    if (imageUrl) {
      clips.push({
        id: slide.id,
        type: "image",
        url: imageUrl,
        duration,
        startTime: cursor,
        endTime: cursor + duration,
        trimStart: 0,
        trimEnd: 0,
        hasAudio: !!slide.audio?.audio_url,
        thumbnail: imageUrl,
        track: 0,
        _rawSlide: slide,
      });
    }

    if (slide.audio?.audio_url) {
      clips.push({
        id: `${slide.id}-audio`,
        type: "audio",
        url: slide.audio.audio_url,
        duration,
        startTime: cursor,
        endTime: cursor + duration,
        trimStart: 0,
        trimEnd: 0,
        hasAudio: true,
        track: 1,
      });
    }

    cursor += duration;
  });

  // ---------- Canva text (optional) ----------
  if (canva.pages?.length) {
    canva.pages.forEach((page) => {
      page.blocks?.forEach((block) => {
        if (block.type !== "text") return;

        textBlocks.push({
          id: block.id,
          pageId: page.id,
          text: block.text,
          position: block.position,
          size: block.size,
          style: block.style || {},
          zIndex: block.zIndex ?? 0,
          startTime: block.startTime ?? 0,
          duration: block.duration ?? 3,
        });

        clips.push({
          id: `clip-${block.id}`,
          blockId: block.id,
          type: "text",
          startTime: block.startTime ?? 0,
          endTime:
            (block.startTime ?? 0) + (block.duration ?? 3),
          duration: block.duration ?? 3,
          trimStart: 0,
          trimEnd: 0,
          track: -1,
        });
      });
    });
  }

  console.log(" ADAPTER OUTPUT", { clips, textBlocks });
  return { clips, textBlocks };
}
