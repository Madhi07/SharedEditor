import { useRef, useCallback, useEffect } from "react";

export default function useCanvasInteraction({ store, pageId }) {
  const interactionRef = useRef(null);
  const rafRef = useRef(null);

  const onPointerMove = useCallback((e) => {
    const i = interactionRef.current;
    if (!i || i.type !== "move") return;

    const dx = e.clientX - i.startPointer.x;
    const dy = e.clientY - i.startPointer.y;

    i.lastDx = dx;
    i.lastDy = dy;

    // ❗ cancel previous frame
    cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const el = store.blockRefs?.[pageId]?.[i.blockId];
      if (!el) return;

      el.style.setProperty("--drag-x", `${dx}px`);
      el.style.setProperty("--drag-y", `${dy}px`);
    });
  }, [store, pageId]);

  const endInteraction = useCallback((e) => {
    const i = interactionRef.current;
    if (!i) return;

    // 🔥 STOP RAF COMPLETELY
    cancelAnimationFrame(rafRef.current);
    rafRef.current = null;

    // 🔥 compute FINAL delta from pointerup
    const dx = e.clientX - i.startPointer.x;
    const dy = e.clientY - i.startPointer.y;

    const el = store.blockRefs?.[pageId]?.[i.blockId];
    if (el) {
      el.style.removeProperty("--drag-x");
      el.style.removeProperty("--drag-y");
    }

    // 🔥 commit ONCE, after RAF is dead
    store.updateBlock(i.blockId, {
      position: {
        x: i.startCenter.x + dx,
        y: i.startCenter.y + dy,
      },
    });

    store.isDragging = false;

    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", endInteraction);
    interactionRef.current = null;
  }, [store, pageId, onPointerMove]);

  const beginInteraction = useCallback((e, { type, blockId }) => {
    e.preventDefault();
    e.stopPropagation();

    const block = store.getBlockById(blockId);
    if (!block) return;

    store.isDragging = true;

    interactionRef.current = {
      type,
      blockId,
      startPointer: { x: e.clientX, y: e.clientY },
      startCenter: { ...block.position },
      lastDx: 0,
      lastDy: 0,
    };

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", endInteraction);
  }, [store, onPointerMove, endInteraction]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", endInteraction);
    };
  }, [onPointerMove, endInteraction]);

  return { beginInteraction };
}
