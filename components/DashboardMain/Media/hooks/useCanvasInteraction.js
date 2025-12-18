import { useRef, useCallback, useEffect } from "react";

export default function useCanvasInteraction({
  store,
  pageId,
  commit = () => {},
} = {}) {
  const interactionRef = useRef(null);

  /* ================= POINTER MOVE ================= */
  const onPointerMove = useCallback(
    (e) => {
      const i = interactionRef.current;
      if (!i || i.type !== "move") return;

      const { blockId, startPointer, startRect, canvasRect } = i;

      // Pointer delta (viewport space)
      const dx = e.clientX - startPointer.x;
      const dy = e.clientY - startPointer.y;

      // Original DOM center
      const startCenterX = startRect.left + startRect.width / 2;
      const startCenterY = startRect.top + startRect.height / 2;

      // New DOM center
      const newCenterX = startCenterX + dx;
      const newCenterY = startCenterY + dy;

      // Convert to canvas-local logical space
      const newX = newCenterX - canvasRect.left;
      const newY = newCenterY - canvasRect.top;

      store.updateBlock(blockId, {
        position: {
          x: newX,
          y: newY,
        },
      });
    },
    [store]
  );

  /* ================= END ================= */
  const endInteraction = useCallback(() => {
    const i = interactionRef.current;
    if (!i) return;

    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", endInteraction);

    interactionRef.current = null;
    commit?.({ name: "Move", pageId });
  }, [commit, pageId, onPointerMove]);

  /* ================= START ================= */
  const beginInteraction = useCallback(
    (e, { type, blockId }) => {
      e.stopPropagation();
      e.preventDefault();

      const blockEl = store.blockRefs?.[pageId]?.[blockId];
      const canvasRect = store.canvasRect;

      if (!blockEl || !canvasRect) return;

      const rect = blockEl.getBoundingClientRect();

      interactionRef.current = {
        type,
        blockId,
        startPointer: { x: e.clientX, y: e.clientY },
        startRect: rect,
        canvasRect,
      };

      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", endInteraction);
    },
    [store, pageId, onPointerMove, endInteraction]
  );

  /* ================= CLEANUP ================= */
  useEffect(() => {
    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", endInteraction);
    };
  }, [onPointerMove, endInteraction]);

  return { beginInteraction };
}
